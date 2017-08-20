const glob = require('glob');
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

function getFiles(pattern = "**/*"){
  return new Promise((resolve, reject) => {
    glob(pattern, options, function (er, files) {
      if(er){
        reject(er);
      }else{
        resolve(files)
      }
    });
  });
}
//""
getFiles("**/*.{jpg,jpeg,mp4,mov,avi,png,pmg,gif}")
  .then((files)=>{
    const extensions = collectExtensions(files);
    console.log('file types count:', extensions);
  })
  .catch((err) => console.error(err));