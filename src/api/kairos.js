// https://www.npmjs.com/package/kairos-api
const Kairos = require('kairos-api');
const b64 = require('node-base64-image');

function getKairosClient(appId, appKey) {
  return new Kairos(appId, appKey);
}

function enroll(imageItem, subject, config) {
  return new Promise((resolve, reject) => {
    if (!imageItem.subject) {
      reject(new Error('You need to add a subject to enroll an image'));
    } else {
      b64.encode(imageItem.path, { local: true }, (err, image) => {
        if (err) {
          reject(err);
        } else {
          resolve(image);
        }
      });
    }
  })
    .then((b64Image) => {
      const client = getKairosClient(config.api.kairos.appId, config.api.kairos.key);
      return client.enroll({
        image: b64Image,
        subject_id: imageItem.subject,
        gallery_name: config.api.kairos.gallery,
      });
    });
}

module.exports = enroll;
