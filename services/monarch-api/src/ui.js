const express = require("express");
const path = require("path");

const router = express.Router();

router.use(express.static(path.join(__dirname, "build")));

router.get("/ping", (req, res) => {
  return res.send("pong");
});

router.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "build", "index.html"));
});

module.exports = router;
