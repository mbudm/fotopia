const glob = require('glob');
const ExifImage = require('exif').ExifImage;
const config = require('./config.js');
const options = {
  cwd: config.cwd,
  nodir: true,
  nocase: true
};


// find all photo/movie files
// get the image metadata
// add all these to a Database
// filter out duplicates, corrupted files

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

function getFiles(pattern = "**/*", opts){
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

function getImageData(image){
  return new Promise((resolve, reject) => {
      new ExifImage({ image }, (error, exifData) => {
        if (error){
          resolve({error});
        }else{
          resolve(exifData)
        }
    });
  });
}

getFiles('**/*.{jpg,jpeg,mp4,mov,avi,png,pmg,gif}', options)
  .then((files)=>{
    const extensions = collectExtensions(files);
    console.log('file types count:', extensions);
    return Promise.all(files.map((file) => getImageData(`${options.cwd}/${file}`)));
  })
  .then((data)=>{
    console.log('imageData',data.length, data.slice(0,10));
  })
  .catch((err) => console.error(err));