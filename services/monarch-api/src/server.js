const app = require("./app");
const log = require("./utils/logger");

const port = 9081;

app.listen(port, () => log.info(`App listening at http://localhost:${port}`));
