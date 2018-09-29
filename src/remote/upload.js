const { Storage } = require('aws-amplify');

Storage.configure({ level: 'protected' });

function upload(key, object, options) {
  return Storage.put(key, object, { level: 'protected', ...options });
}

module.exports = upload;
