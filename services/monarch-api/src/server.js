const app = require("./app");
const log = require("./utils/logger");

const port = 9081;

process.on("SIGINT", () => {
  log.info("Caught interrupt signal");
  process.exit();
});

app.listen(port, () => log.info(`App listening at http://localhost:${port}`));
