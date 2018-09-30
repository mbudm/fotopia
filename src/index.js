require('babel-register');

const config = require('../config');
const fileTools = require('./fileTools');
const uploader = require('./uploader');
const createReviewServer = require('./reviewer/server');
const path = require('path');
const colors = require('colors/safe');
const { argv } = require('yargs');

const startTime = Date.now();

function logThen(message, data, cbPromise) {
  console.log(`${message}: ${JSON.stringify(data, null, 2)} (${Date.now() - startTime}ms)`);
  return cbPromise;
}

function createFilelistLogData(fileList) {
  return {
    'Image files found': fileList.data.length,
    'Tally by extension': fileList.extensions,
  };
}

function buildListPath() {
  const cwdPrefix = config.cwd.split('/');
  const timestamp = Date.now();
  return path.join(config.temp, `${cwdPrefix.pop()}-${timestamp}.json`);
}

const reviewExistingFile = argv['review-file'];
const uploadExistingFile = argv['upload-file'];

if (uploadExistingFile) {
  uploader(uploadExistingFile)
    .then((responses) => {
      console.log('Success! All files uploaded and created', responses);
    })
    .catch((e) => {
      console.log(colors.red('Oh no, we errored somewhere'), e);
    });
} else if (reviewExistingFile) {
  createReviewServer(reviewExistingFile, uploader)
    .then((appListener) => {
      const address = appListener.address();
      console.log(colors.green(`Success! You can now review your sorted images at: \nhttp://localhost:${address.port}`));
    })
    .catch((e) => {
      console.log(colors.red('Oh no, we errored somewhere'), e);
    });
} else {
  fileTools.getFiles(config)
    .then(fileList => logThen('getFiles', createFilelistLogData(fileList), fileTools.createThumbnails(fileList.data, config)))
    .then(thumbsList => logThen('thumbsCreated', { thubs: thumbsList.length }, fileTools.filterFiles(config, thumbsList)))
    .then(filteredList => logThen('filterFiles', fileTools.summariseFilteredList(filteredList), fileTools.writeJson(filteredList, buildListPath())))
    .then(filePath => logThen('listSaved', { filePath }, createReviewServer(filePath, uploader)))
    .then((appListener) => {
      const address = appListener.address();
      console.log(colors.green(`Success! You can now review your sorted images at: \nhttp://localhost:${address.port}`));
    })
    .catch((e) => {
      console.log(colors.red('Oh no, we errored somewhere'), e);
    });
}

