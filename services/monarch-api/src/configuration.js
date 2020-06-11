const fs = require('fs');
var path = require('path');
const configPath = process.env.CONFIG_DIRECTORY;

const configFile = path.join(configPath, "config.json");

module.exports.get = () => {
  return new Promise((resolve, reject) => {
    fs.readFile(configFile, { encoding: "utf8", flag: "r" }, (err, data) => {
      if (err) {
        reject(err);
      }
      resolve(JSON.parse(data));
    });
  });
};

module.exports.set = config => {
  return new Promise((resolve, reject) => {
    fs.writeFile(configFile, JSON.stringify(config), err => {
      if (err) {
        reject(err);
      }
      resolve();
    });
  });
}