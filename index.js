const config = require('./config.js');
const getFiles = require('./src/getFiles.js').getFiles;

const files = getFiles(config)
.then(fileList => {
  console.log('extensions', fileList.extensions);
  console.log('data', fileList.data.length);
  console.log('data - limit 10', JSON.stringify(fileList.data.slice(0,10), null, 5) );
});