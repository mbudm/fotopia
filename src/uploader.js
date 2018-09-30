require('isomorphic-fetch');
const fs = require('fs');
const omitEmpty = require('omit-empty');

const fileTools = require('./fileTools');
const config = require('../config');
const auth = require('./remote/auth');
const { post } = require('./remote/api');
const upload = require('./remote/upload');


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

function uploadFile(file, signedIn) {
  const object = fs.createReadStream(file.path);
  // const body = createRecord(file, signedIn, { key: file.src });
  // console.log(JSON.stringify({
  //   objType: typeof object,
  //   body,
  // }, null, 2));
  return upload(file.src, object, {
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
        console.log('Response:', JSON.stringify(response, null, 2));
        responseAcc.push(response);
        return responseAcc;
      }));
  return files.reduce(reducer, Promise.resolve([]));
}

function uploader(filePath) {
  return getApiConfig()
    .then(apiConfig => auth(apiConfig, config.fotopia))
    .then((signedIn) => {
      fileTools.readJson(filePath)
        .then((data) => {
          if (Array.isArray(data.accepted)) {
            return uploadPromiseMap(data.accepted, signedIn);
          }
          throw new Error('No accepted images');
        })
        .catch(e => console.error(e));
    });
}

module.exports = uploader;
