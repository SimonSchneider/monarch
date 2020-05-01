const fetch = require("node-fetch");
const merge = require("lodash.merge");

function getQueryString(query) {
  const entries = Object.entries(query).filter((e) => e[1]);
  if (entries.length === 0) {
    return "";
  }
  return `?${entries.map((e) => `${e[0]}=${e[1]}`).join("&")}`;
}

module.exports.fetch = (baseUrl) => async (
  context,
  path,
  { method = "GET", query = {}, ...args } = {}
) => {
  const fullPath = baseUrl + path + getQueryString(query);
  const extra = merge({}, { method }, args, context);
  const response = await fetch(fullPath, extra);
  if (response.ok) {
    return response.json();
  }
  throw new Error(
    `error fetching from ${fullPath}, status: ${
      response.status
    }, body: "${await response.text()}"`
  );
};
