const fs = require('fs');
const glob = require('glob');
const { ExifImage } = require('exif');
const getImageDimensions = require('image-size');


function getExtension(path) {
  const ext = path.split('.').pop();
  return ext !== path ? ext : 'no-extension';
}

function collectExtensions(files) {
  return files.reduce((accumulatedExtensions, item) => {
    const ext = getExtension(item);
    if (accumulatedExtensions[ext]) {
      accumulatedExtensions[ext] += 1;
    } else {
      accumulatedExtensions[ext] = 1;
    }
    return accumulatedExtensions;
  }, {});
}

function getFileList(pattern = '**/*', opts) {
  return new Promise((resolve, reject) => {
    glob(pattern, opts, (er, files) => {
      if (er) {
        reject(er);
      } else {
        resolve(files);
      }
    });
  });
}

function isExifSupportedImage(image) {
  return /jpe?g/.test(getExtension(image));
}

function createNewExifImage(image, callback) {
  return new ExifImage({ image }, callback);
}

function normaliseExif(exifData) {
  return {
    width: exifData.exif.ExifImageWidth,
    height: exifData.exif.ExifImageHeight,
    type: 'jpg',
    exifData,
  };
}

function getImageDimensionsPromise(image) {
  return new Promise((resolve) => {
    getImageDimensions(image, (err, dimensions) => {
      if (err) {
        resolve({ err });
      } else {
        resolve(dimensions);
      }
    });
  });
}

function getExifData(image) {
  return new Promise((resolve) => {
    createNewExifImage(image, (error, exifData) => {
      if (error) {
        resolve(getImageDimensionsPromise(image).then(dimensions => ({
          exifError: error,
          ...dimensions,
        })));
      } else {
        resolve(normaliseExif(exifData));
      }
    });
  });
}

function getFileStats(image) {
  return new Promise((resolve) => {
    fs.stat(image, (error, stat) => {
      if (error) {
        resolve(error);
      } else if (typeof stat !== 'object') {
        resolve({
          nostat: true,
          stat,
        });
      } else {
        resolve({
          size: stat.size,
          birthtime: (stat.birthtime ? stat.birthtime : stat.mtime),
        });
      }
    });
  });
}

function getImageData(image) {
  const p = isExifSupportedImage(image) ? getExifData(image) : getImageDimensionsPromise(image);
  return p.then(meta => ({
    path: image,
    ...meta,
  }));
}

function getFiles(config) {
  const options = {
    cwd: config.cwd,
    nodir: true,
    nocase: true,
  };
  const extensionsToSearch = config.extensions.length > 1 ? `{${config.extensions.join()}}` : config.extensions[0];
  let extensions = null;
  return getFileList(`**/*.${extensionsToSearch}`, options)
    .then((files) => {
      extensions = collectExtensions(files);
      return Promise.all(files.map(file => getImageData(`${options.cwd}/${file}`)));
    })
    .then(filesData => Promise.all(filesData.map(fileData => getFileStats(fileData.path)
      .then(stats => ({
        ...fileData,
        ...stats,
      })))))
    .then(data => ({
      data,
      extensions,
    }))
    .catch(err => console.error(err));
}

module.exports = getFiles;
