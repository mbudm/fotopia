require('isomorphic-fetch');
const fs = require('fs');
const fileTools = require('./fileTools');
const config = require('../config');
const auth = require('./remote/auth');
const { post } = require('./remote/api');
const upload = require('./remote/upload');

function createRecord(file, signedIn, responseBody = {}) {
  return {
    username: signedIn.username,
    userIdentityId: config.fotopia.userIdentityId,
    birthtime: file.birthtime,
    img_key: responseBody.key,
    meta: {
      ...file,
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
  upload(file.src, object, {
    contentType: 'image/jpeg',
  })
    .then((responseBody) => {
      const body = createRecord(file, signedIn, responseBody);
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

function uploader(filePath) {
  return getApiConfig()
    .then(apiConfig => auth(apiConfig, config.fotopia))
    .then((signedIn) => {
      console.log('signedIn', JSON.stringify(signedIn, null, 2));
      fileTools.readJson(filePath)
        .then((data) => {
          if (Array.isArray(data.accepted)) {
            return Promise.all(data.accepted.map(file => uploadFile(file, signedIn)));
          }
          throw new Error('No accepted images');
        })
        .catch(e => console.error(e));
    });
}

module.exports = uploader;
