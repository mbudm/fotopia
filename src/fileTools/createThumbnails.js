const sharp = require('sharp');
const path = require('path');
const ensureDirectoryExistence = require('./ensureDirectoryExistence');

function createThumbnailFilename(filename, thumbPath) {
  return path.join(thumbPath, filename.split('/').pop());
}

function createThumbnail(filename, thumbnail) {
  return sharp(filename)
    .resize(320, 240)
    .toFile(thumbnail);
}

function createThumbnails(list, config) {
  ensureDirectoryExistence(path.join(process.cwd(), config.thumbs, list[0].path));
  return Promise.all(list.map((listItem) => {
    const thumbnail = createThumbnailFilename(listItem.path, config.thumbs);
    return createThumbnail(listItem.path, thumbnail)
      .then(thumbData => ({
        ...listItem,
        thumbnail,
        thumbData,
      }));
  }));
}

module.exports = createThumbnails;
