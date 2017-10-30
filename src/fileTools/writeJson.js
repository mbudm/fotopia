const fs = require('fs');
const path = require('path');
const summariseFilteredList = require('./summariseFilteredList');

function ensureDirectoryExistence(filePath) {
  const dirname = path.dirname(filePath);
  if (fs.existsSync(dirname)) {
    return true;
  }
  ensureDirectoryExistence(dirname);
  return fs.mkdirSync(dirname);
}

function writeJson(obj, filePath) {
  return new Promise((resolve, reject) => {
    ensureDirectoryExistence(filePath);

    const summary = summariseFilteredList(obj);
    const json = JSON.stringify({
      source: filePath,
      summary,
      ...obj,
    });
    try {
      fs.writeFile(filePath, json, (err) => {
        if (err) {
          reject(err);
        } else {
          resolve(filePath);
        }
      });
    } catch (err) {
      reject(err);
    }
  });
}

module.exports = writeJson;
