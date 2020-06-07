import * as path from 'path';
import * as colors from 'colors/safe';
import { argv } from 'yargs';

import {config} from '../config';
import * as fileTools from './fileTools';
import uploader from './uploader';
import {createReviewServer} from './reviewer/server';


const startTime = Date.now();

function log(message, data?) {
  console.log(`${message}: ${JSON.stringify(data, null, 2)} (${Date.now() - startTime}ms)`);
}

function logThen(message, data, cbPromise) {
  log(`${message}: ${JSON.stringify(data, null, 2)} (${Date.now() - startTime}ms)`);
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
    .then((responses: any[]) => {
      console.log(`Upload and create of ${responses.length} images complete`);
    })
    .catch((e) => {
      console.log(colors.red('Oh no, we errored somewhere'), e);
      process.exit(1);
    });
} else if (reviewExistingFile) {
  createReviewServer(reviewExistingFile, uploader)
    .then((appListener: any) => {
      const address = appListener.address();
      console.log(colors.green(`Success! You can now review your sorted images at: \nhttp://localhost:${address.port}`));
    })
    .catch((e) => {
      console.log(colors.red('Oh no, we errored somewhere'), e);
      process.exit(1);
    });
} else {
  fileTools.getFiles(config)
    .then((fileList) => {
      log('getFiles', createFilelistLogData(fileList));
      return fileTools.createThumbnails(fileList.data, config);
    })
    .then(thumbsList => logThen('thumbsCreated', { thubs: thumbsList.length }, fileTools.filterFiles(config, thumbsList)))
    .then(filteredList => logThen('filterFiles', fileTools.summariseFilteredList(filteredList), fileTools.writeJson(filteredList, buildListPath())))
    .then(filePath => logThen('listSaved', { filePath }, createReviewServer(filePath, uploader)))
    .then((appListener) => {
      const address = appListener.address();
      console.log(colors.green(`Success! You can now review your sorted images at: \nhttp://localhost:${address.port}`));
    })
    .catch((e) => {
      console.log(colors.red('Oh no, we errored somewhere'), e);
      process.exit(1);
    });
}

