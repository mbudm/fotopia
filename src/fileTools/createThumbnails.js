const Jimp = require('jimp');
const path = require('path');

function createThumbnail(filename, options) {
  return new Promise((resolve) => {
    Jimp.read(filename).then((image) => {
      const thumbnail = path.join(options.thumbs, filename.split('/').pop());
      image.resize(256, 256)
        .quality(60)
        .write(thumbnail);
      resolve(thumbnail);
    }).catch((err) => {
      resolve(err);
    });
  });
}

function createThumbnails(list, config) {
  return Promise.all(list.map(listItem => createThumbnail(listItem.path, config)
    .then(thumbnail => ({
      ...listItem,
      thumbnail,
    }))));
}

module.exports = createThumbnails;
