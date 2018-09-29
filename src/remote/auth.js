import AWS from 'aws-sdk';
import Amplify from 'aws-amplify';


function configureAmplify(config) {
  Amplify.configure({
    Auth: {
      identityPoolId: config.IdentityPoolId,
      region: config.Region,
      userPoolId: config.UserPoolId,
      userPoolWebClientId: config.UserPoolClientId,
    },
    Storage: {
      region: config.Region,
      bucket: config.Bucket,
      identityPoolId: config.IdentityPoolId,
    },
    API: {
      endpoints: [
        {
          name: 'fotos',
          endpoint: config.ServiceEndpoint,
          region: config.Region,
        },
      ],
    },
  });
}

function authenticateExistingUser(apiConfig, userConfig) {
  return new Promise((resolve, reject) => {
    configureAmplify(apiConfig);
    Amplify.Auth.signIn(userConfig.user, userConfig.pwd)
      .then(resolve)
      .catch(reject);
  });
}

function checkUserExists(apiConfig, userConfig) {
  const cognitoISP = new AWS.CognitoIdentityServiceProvider({
    region: apiConfig.Region,
  });
  return cognitoISP.listUsers({
    UserPoolId: apiConfig.UserPoolId,
    Filter: `username = "${userConfig.user}"`,
  }).promise();
}

function auth(apiConfig, userConfig) {
  return checkUserExists(apiConfig, userConfig)
    .then((response) => {
      console.log('checkUserExists', response);
      return authenticateExistingUser(apiConfig, userConfig);
    })
    .catch((err) => {
      console.log('check user err', err);
    });
}

module.exports = auth;
