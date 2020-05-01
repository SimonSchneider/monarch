const express = require("express");
const bodyParser = require("body-parser");
const Utils = require("./utils/middlewares.js");
const log = require("./utils/logger");
const Prom = require("./prometheus");
const conf = require("./config.json");
const stub = require("./stub.json");

log.info("hello");

const app = express();

app.use(Utils.contextMiddleware);
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(bodyParser.raw());

async function getTopics(context) {
  const topicResp = await Prom.query(context, conf.topics.query);
  return topicResp.data.result.reduce(
    (acc, tar) => ({ ...acc, [tar.metric[conf.topics.key]]: tar.value[1] }),
    {}
  );
}

async function getTopicList(context) {
  const topicResp = await Prom.query(context, conf.topics.query);
  return topicResp.data.result.map((v) => ({
    name: v.metric[conf.topics.key],
    eventRate: Number(v.value[1]),
  }));
}

async function getConsumerGroups(context) {
  const consumerResp = await Prom.query(context, conf.consumerGroups.query);
  return consumerResp.data.result.reduce((agg, v) => {
    const name = v.metric[conf.consumerGroups.groupKey];
    const topic = {
      name: v.metric[conf.consumerGroups.topicKey],
      lag: v.value[1] >= 0 ? Number(v.value[1]) : 0,
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

async function getServiceList(context, topics, consumerGroups) {
  const { services } = conf;
  return Object.keys(services).map((name) => {
    const serviceCgs = services[name].consumerGroups.flatMap((c) =>
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
      producesTo: producer,
      consumerGroups: serviceCgs,
    };
  });
}

async function getConsumers(context) {
  const consumerResp = await Prom.query(context, conf.consumerGroups.query);
  return consumerResp.data.result.reduce((acc, tar) => {
    const cgName = tar.metric[conf.consumerGroups.groupKey];
    const currCg = acc[cgName] ? acc[cgName] : {};
    const newCg = {
      ...currCg,
      [tar.metric[conf.consumerGroups.topicKey]]: tar.value[1],
    };
    const { [cgName]: deletedKey, ...withoutCurrCg } = acc;
    return {
      ...withoutCurrCg,
      [cgName]: newCg,
    };
  }, {});
}

async function getServices(context) {
  const [topics, cgs] = await Promise.all([
    getTopics(context),
    getConsumers(context),
  ]);
  const serv = conf.services;
  return Object.keys(serv).map((k) => {
    const consumer = serv[k].consumerGroups.map((c) => ({
      name: c,
      lag: cgs[c],
    }));
    const producer = [
      ...(serv[k].producer ? serv[k].producer : []),
      ...(serv[k].producerRegex
        ? Object.keys(topics).filter((t) => t.match(serv[k].producerRegex))
        : []),
    ];
    return {
      name: k,
      producesTo: producer,
      cgs: consumer,
    };
  });
}

app.get(
  "/",
  Utils.asyncHandler(async (req, res) => {
    const topics = await getTopics(req.context);
    const cgs = await getConsumers(req.context);
    const services = await getServices(req.context);
    res.json({ topics, cgs, services });
  })
);

app.get(
  "/api/v1/curr",
  Utils.asyncHandler(async (req, res) => {
    res.json(stub);
    return;
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

app.use(Utils.errorMiddleware);
module.exports = app;
