import * as fs from 'fs';
import * as path from 'path';
import * as glob from 'glob';
import { ExifImage } from 'exif';
import { imageSize as getImageSize} from 'image-size';


function getExtension(filePath) {
  const ext = filePath.split('.').pop();
  return ext !== filePath ? ext : 'no-extension';
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

function getFileList(pattern = '**/*', opts): Promise<any[]> {
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
    getImageSize(image, (err, dimensions) => {
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


function getImageData(cwd, image) {
  const imgPath = `${cwd}/${image}`;
  const p = isExifSupportedImage(imgPath) ?
    getExifData(imgPath) :
    getImageDimensionsPromise(imgPath);
  return p.then(meta => ({
    path: imgPath,
    src: path.relative(process.cwd(), imgPath),
    ...meta,
  }));
}

export function getFiles(config): Promise<any> {
  const options = {
    cwd: config.cwd,
    nodir: true,
    nocase: true,
  };
  const extensionsToSearch = config.extensions.length > 1 ? `{${config.extensions.join()}}` : config.extensions[0];
  let extensions = null;
  return getFileList(`**/*.${extensionsToSearch}`, options)
    .then((files: any[]) => {
      extensions = collectExtensions(files);
      return Promise.all(files.map(file => getImageData(options.cwd, file)));
    })
    .then((filesData: any[]) => Promise.all(filesData.map(fileData => getFileStats(fileData.path)
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

