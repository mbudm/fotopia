import 'isomorphic-fetch';

import * as fs from 'fs';
import * as omitEmpty from 'omit-empty';

import * as fileTools from './fileTools';
import { config } from '../config';
import auth from './remote/auth';
import initApi from './remote/api';
import initStorage from './remote/storage';

let uploadClient;
let apiClient;
let apiConfig;
let authConfig;

function getKey(file) {
  return `${config.fotopia.user}/${file.src}`;
}

function createRecord(file) {
  // avoid ValidationException errors with empty attrubutes
  // https://docs.aws.amazon.com/amazondynamodb/latest/APIReference/API_PutItem.html
  const fileWithNoEmptyProps = omitEmpty(file);
  return {
    username: config.fotopia.user,
    userIdentityId: authConfig.userIdentityId,
    birthtime: file.birthtime,
    img_key: getKey(file),
    meta: {
      ...fileWithNoEmptyProps,
    },
    tags: [],
    people: [],
  };
}

function uploadFile(file) {
  const object = fs.createReadStream(file.path);
  const key = getKey(file);
  return uploadClient(key, object, {
    contentType: 'image/jpeg',
  })
    .then((responseBody) => {
      console.log('S3 upload response', responseBody);
      const body = createRecord(file);
      console.log('Uploaded, now creating:', key);
      return apiClient.post(config.fotopia.api, '/create', {
        body,
      });
    });
}

function getApiConfig() {
  const configEndpoint = `${config.fotopia.api}/config`;
  return fetch(configEndpoint)
    .then(response => response.json());
}

function uploadPromiseMap(files) {
  const reducer = (responsesAcc, file) =>
    responsesAcc.then(responseAcc => uploadFile(file)
      .then((response) => {
        console.log('Created:', response.img_key);
        responseAcc.push(response);
        return responseAcc;
      }));
  return files.reduce(reducer, Promise.resolve([]));
}

function readJsonAndUpload(filePath) {
  return fileTools.readJson(filePath)
    .then((data) => {
      if (Array.isArray(data.accepted)) {
        return uploadPromiseMap(data.accepted);
      }
      throw new Error('No accepted images');
    })
    .catch(e => console.error(e));
}

export default function uploader(filePath) {
  return getApiConfig()
    .then((apiConfigResponse) => {
      apiConfig = apiConfigResponse;
      return auth(apiConfig, config.fotopia);
    })
    .then((authResponse) => {
      authConfig = authResponse;
      uploadClient = initStorage(apiConfig, authConfig.userIdentityId);
      apiClient = initApi(apiConfig.Region, authConfig.credentials)
      return readJsonAndUpload(filePath);
    });
}
