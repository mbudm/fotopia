const fs = require('fs');
const util = require('util');
const glob = require('glob');
const ExifImage = require('exif').ExifImage;
const getImageDimensions = require('image-size');


function getExtension(path){
  const ext = path.split('.').pop();
  return ext !== path ? ext : 'no-extension';
}

function collectExtensions(files){
  return files.reduce((accumulatedExtensions, item) => {
    const ext = getExtension(item);
    if(accumulatedExtensions[ext]){
      accumulatedExtensions[ext]++
    }else{
      accumulatedExtensions[ext] = 1;
    }
    return accumulatedExtensions;
  }, {});
}

function getFileList(pattern = "**/*", opts){
  return new Promise((resolve, reject) => {
    glob(pattern, opts, function (er, files) {
      if(er){
        reject(er);
      }else{
        resolve(files)
      }
    });
  });
}

function isExifSupportedImage(image){
  return /jpe?g/.test(getExtension(image));
}

function getExifData(image){
  return new Promise((resolve, reject) => {
    new ExifImage({ image }, (error, exifData) => {
      if (error){
        resolve(getImageDimensionsPromise(image).then((dimensions) => {
            return {
              exifError: error,
              ...dimensions
            };
          })
        );
      }else{
        resolve(normaliseExif(exifData));
      }
    });
  });
}

/* pluck width and height from exif, so it's the same as non exif data 
{
  width
  height
  type
}
*/
function normaliseExif(exifData){
 return {
  width: exifData.exif.ExifImageWidth,
  height: exifData.exif.ExifImageHeight,
  type: 'jpg',
  exifData
 };
}

function getImageDimensionsPromise(image){
  return new Promise((resolve, reject) => {
    getImageDimensions(image, (err, dimensions) =>{
      if (err){
        resolve({err});
      }else{
        resolve(dimensions);
      }
    });
  });
}

function getFileStats(image){
  return new Promise((resolve, reject) => {
    fs.stat(image, function(error, stat) {
      if(error ) {
        resolve(error);
      }else if(typeof stat !== "object"){
        resolve({
          nostat:true,
          stat
        });
      }else{
        resolve({
          size: stat.size,
          birthtime: (stat.birthtime ? stat.birthtime : stat.mtime ),
        });
      }   
    });
  });
}

function getImageData(image){
  const p = isExifSupportedImage(image) ? getExifData(image) : getImageDimensionsPromise(image)
    return p.then((meta) => {
      return {
        path: image,
        ...meta
      };
    });
}
function getFiles(config){
    const options = {
      cwd: config.cwd,
      nodir: true,
      nocase: true
    };
    const extensionsToSearch = config.extensions.length >1 ? `{${config.extensions.join()}}` : config.extensions[0]
    let extensions = null;
    return getFileList(`**/*.${extensionsToSearch}`, options)
        .then((files)=>{
            extensions = collectExtensions(files);
            return Promise.all(files.map((file) => getImageData(`${options.cwd}/${file}`)));
        })
        .then((filesData)=>{
            return Promise.all(filesData.map((fileData) => {
                return getFileStats(fileData.path).then((stats) => {
                    return {
                    ...fileData,
                    ...stats
                    } 
                });
            }));
        })
        .then((data)=>{
          return {
            data,
            extensions
          }
        })
        .catch((err) => console.error(err));
}

module.exports = getFiles
  