const winston = require("winston");

const logger = winston.createLogger({
  level: "info",
  format: winston.format.combine(winston.format.simple()),
  transports: [new winston.transports.Console()],
});

if (process.env.NODE_ENV === "cloud") {
  logger.format = winston.format.json();
  logger.defaultMeta = { service: "monarch" };
}

module.exports = logger;
