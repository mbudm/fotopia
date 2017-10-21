const config = require('./config.js');
const fileTools = require('./src/fileTools');
const path = require('path');


// find all photo/movie files
// get the image metadata
// filter out duplicates, corrupted files
const startTime = Date.now();

const files = fileTools.getFiles(config)
  .then(fileList => {
    console.log('extensions', fileList.extensions);
    console.log('data', fileList.data.length);
    console.log('data - limit 10', JSON.stringify(fileList.data.slice(0,10), null, 5) );
    console.log('1. time taken', Date.now() - startTime);
    return fileTools.filterFiles(config, fileList.data);
  }).then(filteredList => {
    console.log('filtered - accepted:', filteredList.accepted.length, 'rejected:', filteredList.rejected.length)
    const rejectedTally = {}
    filteredList.rejected.forEach(item => {
      if(rejectedTally[item.reason] ===  undefined){
        rejectedTally[item.reason] = 0;
      }
      rejectedTally[item.reason]++;
    })
    console.log('rejected tally', rejectedTally);
    console.log('2. time taken', Date.now() - startTime);

    const cwdPrefix = config.cwd.split('/');
    const timestamp = Date.now();
    const listPath = path.join(config.temp, cwdPrefix.pop() + '-' + timestamp + '.json');

    console.log('listPath', listPath);
    fileTools.writeJson(filteredList, listPath);
  });


