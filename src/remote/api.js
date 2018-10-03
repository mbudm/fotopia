const { API } = require('aws-amplify');
const retry = require('retry');

function retryer(fn, args) {
  return new Promise((res, rej) => {
    const operation = retry.operation();
    operation.attempt((currentAttempt) => {
      API[fn](...args)
        .then(res)
        .catch((err) => {
          console.log(`Failed attempt ${currentAttempt} at route ${args[1]}`);
          if (operation.retry(err)) {
            console.log('Retrying');
            return;
          }
          rej(operation.mainError());
        });
    });
  });
}

const endpointName = 'fotos';
const post = (hostname, route, params) => retryer('post', [endpointName, route, params]);
const get = (hostname, route) => retryer('get', [endpointName, route]);
const del = (hostname, route) => retryer('del', [endpointName, route]);
const put = (hostname, route, params) => retryer('put', [endpointName, route, params]);

module.exports = {
  post,
  get,
  del,
  put,
};

