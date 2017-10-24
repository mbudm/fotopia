const config = require('../config');
const fileTools = require('./fileTools');
const createReviewServer = require('./reviewServer');
const path = require('path');
const colors = require('colors/safe');

const startTime = Date.now();

function logThen(message, data, cbPromise) {
  console.log(`${message}: ${JSON.stringify(data, null, 2)} (${Date.now() - startTime})`);
  return cbPromise;
}

function createFilelistLogData(fileList) {
  return {
    'Image files found': fileList.data.length,
    'Tally by extension': fileList.extensions,
  };
}

function createFilteredFilesLogData(filteredList) {
  return {
    Accepted: filteredList.accepted.length,
    Rejected: filteredList.rejected.length,
    'Tally by reason': filteredList.rejected.reduce((rejectedTally, item) => {
      if (rejectedTally[item.reason] === undefined) {
        rejectedTally[item.reason] = 0;
      }
      rejectedTally[item.reason] += 1;
      return rejectedTally;
    }, {}),
  };
}

function buildListPath() {
  const cwdPrefix = config.cwd.split('/');
  const timestamp = Date.now();
  return path.join(config.temp, `${cwdPrefix.pop()}-${timestamp}.json`);
}

fileTools.getFiles(config)
  .then(fileList => logThen('getFiles', createFilelistLogData(fileList), fileTools.filterFiles(config, fileList.data)))
  .then(filteredList => logThen('filterFiles', createFilteredFilesLogData(filteredList), fileTools.writeJson(filteredList, buildListPath())))
  .then(filePath => logThen('listSaved', { filePath }, createReviewServer(filePath)))
  .then((appListener) => {
    const address = appListener.address();
    console.log(address);
    console.log(colors.green(`Success! You can now review your sorted images at: \n ${address.address}:${address.port}`));
  })
  .catch((e) => {
    console.log(colors.red('Oh no, we errored somewhere'), e);
  });

