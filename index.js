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

glob("**/*/", options, function (er, files) {
  console.log('all total:', files.length);
});

// glob("**/*.{jpg,jpeg,mp4,mov}", options, function (er, files) {
//   console.log('images total:', files.length);
// });
//
// glob("**/*", {ignore:"**/*.{jpg,jpeg,mp4,mov}",...options}, function (er, files) {
//   console.log('non images total:', files.length);
// });
