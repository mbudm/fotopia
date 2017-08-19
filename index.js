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

// glob("**/*", options, function (er, files) {
//   console.log('all total:', files.length);
// });

// glob("**/*.{jpg,jpeg,mp4,mov}", options, function (er, files) {
//   console.log('images total:', files.length);
// });
//
// What files do we have?
function getExtension(path){
  const ext = path.split('.').pop();
  return ext !== path ? ext : 'no-extension';
}

glob("**/*", options, function (er, files) {
  const extensions = files.reduce((knownExtensions, item) => {
    const ext = getExtension(item);
    if(knownExtensions[ext]){
      knownExtensions[ext]++
    }else{
      knownExtensions[ext] = 1;
    }
    return knownExtensions;
  }, {});
  console.log('file types count:', extensions);
});
