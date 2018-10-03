const { Storage } = require('aws-amplify');

Storage.configure({ level: 'protected' });

function upload(key, object, options) {
  return Storage.put(key, object, { level: 'protected', ...options });
}

function list(path) {
  return Storage.list(path, { level: 'protected' });
}

module.exports = {
  upload,
  list,
};
