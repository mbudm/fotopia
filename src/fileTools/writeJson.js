const fs = require('fs');
const path = require('path');

function writeJson(obj, filePath){
  ensureDirectoryExistence(filePath);
  const json = JSON.stringify(obj);
  try {
    fs.writeFile(filePath, json, function(err) {
      if(err) {
        return console.log(err);
      }else{
        console.log("file saved");
      }
    });
  } catch (err) {
    console.error(err);
  }
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