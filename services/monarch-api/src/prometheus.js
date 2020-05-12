const baseUrl = `${
  process.env.PROMETHEUS_HOST || "http://localhost:9090"
}/api/v1`;
const fetch = require("./utils/request").fetch(baseUrl);

module.exports.query = async (context, queryString) =>
  fetch(context, "/query", { query: { query: queryString } });
