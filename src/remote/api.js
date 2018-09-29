const { API } = require('aws-amplify');

const endpointName = 'fotos';
const post = (hostname, route, params) => API.post(endpointName, route, params);
const get = (hostname, route) => API.get(endpointName, route);
const del = (hostname, route) => API.del(endpointName, route);
const put = (hostname, route, params) => API.put(endpointName, route, params);

module.exports = {
  post,
  get,
  del,
  put,
};
