require('isomorphic-fetch');
const fs = require('fs');
const omitEmpty = require('omit-empty');

const fileTools = require('./fileTools');
const config = require('../config');
const auth = require('./remote/auth');
const { post } = require('./remote/api');
const { upload } = require('./remote/storage');


function createRecord(file, signedIn, responseBody = {}) {
  // avoid ValidationException errors with empty attrubutes
  // https://docs.aws.amazon.com/amazondynamodb/latest/APIReference/API_PutItem.html
  const fileWithNoEmptyProps = omitEmpty(file);
  return {
    username: signedIn.username,
    userIdentityId: config.fotopia.userIdentityId,
    birthtime: file.birthtime,
    img_key: responseBody.key,
    meta: {
      ...fileWithNoEmptyProps,
    },
    tags: [],
    people: [],
  };
}

function getKey(signedIn, file) {
  return `${signedIn.username}/${file.src}`;
}

function uploadFile(file, signedIn) {
  const object = fs.createReadStream(file.path);
  const key = getKey(signedIn, file);
  return upload(key, object, {
    contentType: 'image/jpeg',
  })
    .then((responseBody) => {
      const body = createRecord(file, signedIn, responseBody);
      console.log('Uploaded, now creating:', body.img_key);
      return post(config.fotopia.api, '/create', {
        body,
      });
    });
}

function getApiConfig() {
  const configEndpoint = `${config.fotopia.api}/config`;
  return fetch(configEndpoint)
    .then(response => response.json());
}

function uploadPromiseMap(files, signedIn) {
  const reducer = (responsesAcc, file) =>
    responsesAcc.then(responseAcc => uploadFile(file, signedIn)
      .then((response) => {
        console.log('Created:', response.img_key);
        responseAcc.push(response);
        return responseAcc;
      }));
  return files.reduce(reducer, Promise.resolve([]));
}

function readJsonAndUpload(filePath, signedIn) {
  return fileTools.readJson(filePath)
    .then((data) => {
      if (Array.isArray(data.accepted)) {
        return uploadPromiseMap(data.accepted, signedIn);
      }
      throw new Error('No accepted images');
    })
    .catch(e => console.error(e));
}

function uploader(filePath) {
  return getApiConfig()
    .then(apiConfig => auth(apiConfig, config.fotopia))
    .then(signedIn => readJsonAndUpload(filePath, signedIn));
}

module.exports = uploader;
