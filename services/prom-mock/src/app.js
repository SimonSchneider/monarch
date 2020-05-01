const express = require("express");
const bodyParser = require("body-parser");
const stub = require("./stub.json");

const app = express();

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(bodyParser.raw());

const answer = (result) => ({ data: { result } });

const topics = () => stub.topics.map(
  t => ({ metric: { topic: t.name }, value: [0, t.rate] }))

const getCg = (key, { mod = (name, r) => r } = {}) => stub.consumerGroups.flatMap(
  cg => cg.topics.map(t => ({ metric: { topic: t.name, consumergroup: cg.name }, value: [0, mod(cg.name, t[key])] }))
);

const getService = (key) => stub.services.flatMap(
  s => (s.metrics ? { metric: { service: s.name }, value: [0, s.metrics.requests[key]] } : [])
)

function get(query, state) {
  const lagMod = (state === "warn" || state === "crit") ? { mod: (name, l) => name === "service-8-consumer" ? l + 200000 : name === "service-4-consumer" ? l + 30000000 : l } : {};
  const rateMod = state === "crit" ? { mod: (name, r) => name === "service-8-consumer" ? 10 : r } : {};
  switch (query) {
    case "topic": return topics();
    case "cgLag": return getCg('lag', lagMod);
    case "cgRate": return getCg('rate', rateMod);
    case "serviceRate": return getService('rate');
    case "serviceError": return getService('errors');
    case "serviceDuration": return getService('duration');
    default: return "bad";
  }
}

app.get(
  "/api/v1/query",
  (req, res) => res.json(answer(get(req.query.query, req.headers.authorization)))
);

module.exports = app;
