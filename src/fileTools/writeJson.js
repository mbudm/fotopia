const fs = require('fs');
const path = require('path');

function writeJson(obj, filePath){
  return new Promise((resolve, reject) => {
    ensureDirectoryExistence(filePath);
    const json = JSON.stringify(obj);
    try {
      fs.writeFile(filePath, json, function(err) {
        if(err) {
          return reject(err);
        }else{
          resolve(filePath);
        }
      });
    } catch (err) {
      reject(err);
    }
  });
}

function ensureDirectoryExistence(filePath) {
  var dirname = path.dirname(filePath);
  if (fs.existsSync(dirname)) {
    return true;
  }
  ensureDirectoryExistence(dirname);
  fs.mkdirSync(dirname);
}

module.exports = writeJson