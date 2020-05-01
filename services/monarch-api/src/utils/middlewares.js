const log = require("./logger");

function from(req) {
  return {
    headers: {
      ...(req.headers.authorization && {
        Authorization: req.headers.authorization,
      }),
    },
  };
}

module.exports.contextMiddleware = (req, res, next) => {
  req.context = from(req);
  log.info("received request");
  next();
};

module.exports.errorMiddleware = (err, req, res, next) => {
  if (res.headersSent) {
    return next(err);
  }
  log.error(`failed to answer ${req.path} due to ${err.message}`);
  res.status(500);
  return res.send("Internal server error");
};

module.exports.asyncHandler = (fn) => (req, res, next) =>
  Promise.resolve(fn(req, res)).catch(next);
