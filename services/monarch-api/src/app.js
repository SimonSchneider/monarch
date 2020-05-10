const express = require("express");
const bodyParser = require("body-parser");
const Utils = require("./utils/middlewares.js");
const log = require("./utils/logger");
const Prom = require("./prometheus");
const conf = require("./config.json");
const stub = require("./stub.json");
const stubWarning = require("./stub-warn.json");
const stubCritical = require("./stub-critical.json");
const fs = require('fs');
var path = require('path');

const app = express();

app.use(Utils.contextMiddleware);
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(bodyParser.raw());

async function getTopicList(context) {
  const topicResp = await Prom.query(context, conf.topics.query);
  return topicResp.data.result.map((v) => ({
    name: v.metric[conf.topics.key],
    eventRate: Number(v.value[1]),
  }));
}

async function getConsumerGroups(context) {
  const [consumerLagResp, consumerRateResp] = await Promise.all([
    Prom.query(context, conf.consumerGroups.lagQuery),
    Prom.query(context, conf.consumerGroups.rateQuery),
  ]);
  const consumerRates = consumerRateResp.data.result.map((r) => {
    const name = r.metric[conf.consumerGroups.groupKey];
    const topic = r.metric[conf.consumerGroups.topicKey];
    const rate = r.value[1] >= 0 ? Number(r.value[1]) : 0;
    return { name, topic, rate };
  });
  return consumerLagResp.data.result.reduce((agg, v) => {
    const name = v.metric[conf.consumerGroups.groupKey];
    const topicName = v.metric[conf.consumerGroups.topicKey];
    const topic = {
      name: topicName,
      lag: v.value[1] >= 0 ? Number(v.value[1]) : 0,
      rate: consumerRates.find((r) => r.name === name && r.topic === topicName)
        .rate,
    };
    const { topics, ...extra } = agg.find((c) => c.name === name) || {
      name,
      topics: [],
    };
    return [
      ...agg.filter((c) => c.name !== name),
      {
        ...extra,
        topics: [...topics, topic],
      },
    ];
  }, []);
}

function promToMap(promResp, key) {
  return promResp.data.result.reduce((agg, r) => {
    const val = r.metric[key];
    return {
      ...agg,
      [val]: r.value[1],
    };
  }, {});
}

async function getServiceList(context, topics, consumerGroups) {
  const { metrics, services } = conf;
  const [rateRes, errorRes, durationRes] = await Promise.all([
    Prom.query(context, metrics.requests.rateQuery),
    Prom.query(context, metrics.requests.errorQuery),
    Prom.query(context, metrics.requests.durationQuery),
  ]).then((rs) => rs.map((r) => promToMap(r, metrics.requests.serviceKey)));
  return Object.keys(services).map((name) => {
    const serviceCgs = (services[name].consumerGroups || []).flatMap((c) =>
      consumerGroups.filter((cg) => cg.name === c)
    );
    const producer = [
      ...(services[name].producer ? services[name].producer : []),
      ...(services[name].producerRegex
        ? topics
          .map((t) => t.name)
          .filter((t) => t.match(services[name].producerRegex))
        : []),
    ];
    return {
      name,
      metrics: {
        requests: {
          rate: rateRes[name],
          errors: errorRes[name],
          duration: durationRes[name],
        },
      },
      requestsFrom: services[name].requestsFrom || [],
      producesTo: producer,
      consumerGroups: serviceCgs,
    };
  });
}

app.get(
  "/api/v1/curr",
  Utils.asyncHandler(async (req, res) => {
    if (req.query.state === "good") {
      res.json(stub);
      return;
    }
    if (req.query.state === "warn") {
      res.json(stubWarning);
      return;
    }
    if (req.query.state === "crit") {
      res.json(stubCritical);
      return;
    }
    const [topics, allConsumerGroups] = await Promise.all([
      getTopicList(req.context),
      getConsumerGroups(req.context),
    ]);
    const services = await getServiceList(
      req.context,
      topics,
      allConsumerGroups
    );
    const matchedConsumerGroups = new Set(
      services.flatMap((s) => s.consumerGroups).map((c) => c.name)
    );
    const consumerGroups = allConsumerGroups.filter(
      (c) => !matchedConsumerGroups.has(c.name)
    );
    res.json({ topics, consumerGroups, services });
  })
);

app.get(
  "/api/v1/configurations/",
  Utils.asyncHandler((req, res) => {
    res.json(conf);
    //   console.log(__dirname);
    //   fs.readFile(
    //     path.join(__dirname, "/config.json"), (f) => res.json(f));
  })
);

app.use(Utils.errorMiddleware);
module.exports = app;
