const fs = require('fs');
const path = require('path');

function ensureDirectoryExistence(filePath) {
  const dirname = path.dirname(filePath);
  if (fs.existsSync(dirname)) {
    console.log('exists:', dirname, filePath);
    return true;
  }
  ensureDirectoryExistence(dirname);
  console.log('about to makdir', dirname);
  return fs.mkdirSync(dirname);
}

module.exports = ensureDirectoryExistence;
