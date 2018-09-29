const fs = require('fs');

function readJson(filename) {
  return new Promise((resolve, reject) => {
    fs.readFile(filename, (err, json) => {
      if (err) {
        reject(err);
        return;
      }
      try {
        const data = JSON.parse(json);
        resolve(data);
      } catch (exception) {
        reject(exception);
      }
    });
  });
}

module.exports = readJson;
