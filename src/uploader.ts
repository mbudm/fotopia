import 'isomorphic-fetch';

// import * as fs from 'fs';
// import omitEmpty from 'omit-empty';

// import fileTools from './fileTools';
import { config } from '../config';
import auth from './remote/auth';
// import { post } from './remote/api';
// import init from './remote/storage';


// function getKey(signedIn, file) {
//   return `${signedIn.username}/${file.src}`;
// }

// function createRecord(file, signedIn, userIdentityId) {
//   // avoid ValidationException errors with empty attrubutes
//   // https://docs.aws.amazon.com/amazondynamodb/latest/APIReference/API_PutItem.html
//   const fileWithNoEmptyProps = omitEmpty(file);
//   return {
//     username: signedIn.username,
//     userIdentityId,
//     birthtime: file.birthtime,
//     img_key: getKey(signedIn, file),
//     meta: {
//       ...fileWithNoEmptyProps,
//     },
//     tags: [],
//     people: [],
//   };
// }

// function uploadFile(file, signedIn, uploadClient, userIdentityId) {
//   const object = fs.createReadStream(file.path);
//   const key = getKey(signedIn, file);
//   return uploadClient(key, object, {
//     contentType: 'image/jpeg',
//   })
//     .then((responseBody) => {
//       console.log('S3 upload response', responseBody);
//       const body = createRecord(file, signedIn, userIdentityId);
//       console.log('Uploaded, now creating:', key);
//       return post(config.fotopia.api, '/create', {
//         body,
//       });
//     });
// }

function getApiConfig() {
  const configEndpoint = `${config.fotopia.api}/config`;
  return fetch(configEndpoint)
    .then(response => response.json());
}

// function uploadPromiseMap(files, signedIn, uploadClient, userIdentityId) {
//   const reducer = (responsesAcc, file) =>
//     responsesAcc.then(responseAcc => uploadFile(file, signedIn, uploadClient, userIdentityId)
//       .then((response) => {
//         console.log('Created:', response.img_key);
//         responseAcc.push(response);
//         return responseAcc;
//       }));
//   return files.reduce(reducer, Promise.resolve([]));
// }

// function readJsonAndUpload(filePath, signedIn, uploadClient, userIdentityId) {
//   return fileTools.readJson(filePath)
//     .then((data) => {
//       if (Array.isArray(data.accepted)) {
//         return uploadPromiseMap(data.accepted, signedIn, uploadClient, userIdentityId);
//       }
//       throw new Error('No accepted images');
//     })
//     .catch(e => console.error(e));
// }

export default function uploader(filePath) {
  let uploadClient;
  let apiConfig;
  return getApiConfig()
    .then((apiConfigResponse) => {
      apiConfig = apiConfigResponse;
      return auth(apiConfig, config.fotopia);
    })
    .then((response) => {
      console.log("Auth", response, apiConfig)
    })
    // .then(({ signedIn, userIdentityId }) => {
    //   uploadClient = init(apiConfig, userIdentityId);
    //   return readJsonAndUpload(filePath, signedIn, uploadClient, userIdentityId);
    // });
}
