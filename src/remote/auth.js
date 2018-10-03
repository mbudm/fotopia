import AWS from 'aws-sdk';
import Amplify from 'aws-amplify';


function configureAmplify(apiConfig, userConfig) {
  console.log('userConfig.api', userConfig, apiConfig.ServiceEndpoint);
  Amplify.configure({
    Auth: {
      identityPoolId: apiConfig.IdentityPoolId,
      region: apiConfig.Region,
      userPoolId: apiConfig.UserPoolId,
      userPoolWebClientId: apiConfig.UserPoolClientId,
    },
    Storage: {
      region: apiConfig.Region,
      bucket: apiConfig.Bucket,
      identityPoolId: apiConfig.IdentityPoolId,
    },
    API: {
      endpoints: [
        {
          name: 'fotos',
          endpoint: userConfig.api,
          region: apiConfig.Region,
        },
      ],
    },
  });
}

function authenticateExistingUser(apiConfig, userConfig) {
  return new Promise((resolve, reject) => {
    configureAmplify(apiConfig, userConfig);
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
