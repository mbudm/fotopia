import "isomorphic-fetch";

// import * as awsCredsLoader from 'aws-creds-loader';
import * as AWS from "aws-sdk";
import * as AmazonCognitoIdentity from 'amazon-cognito-identity-js';

// awsCredsLoader(AWS);

export function checkUserExists(config: any, userConfig) {
  const username = userConfig.user;
  const cognitoISP = new AWS.CognitoIdentityServiceProvider({
    region: config.Region,
  });
  return cognitoISP.listUsers({
    Filter: `username = "${username}"`,
    UserPoolId: config.UserPoolId,
  }).promise();
}

export function signIn(apiConfig, userConfig){
  return new Promise((res, rej) => {
    const authenticationData = {
      Username : userConfig.user,
      Password : userConfig.pwd,
    };
    const authenticationDetails = new AmazonCognitoIdentity.AuthenticationDetails(authenticationData);
    const poolData = {
      UserPoolId : apiConfig.UserPoolId,
      ClientId : apiConfig.UserPoolClientId
    };
    const userPool = new AmazonCognitoIdentity.CognitoUserPool(poolData);
    const userData = {
      Username : userConfig.user,
      Pool : userPool
    };
    const cognitoUser = new AmazonCognitoIdentity.CognitoUser(userData);
    cognitoUser.authenticateUser(authenticationDetails, {
        onSuccess: function (result) {
            const accessToken = result.getAccessToken().getJwtToken();
            // fetch(`${userConfig.api}/query`, {
            //   method: 'POST',
            //   headers: {
            //     accesstoken: accessToken
            //   }
            // })
            // .then((response) => {
            //   console.log('test api call', response)
            // })
            // .catch((err) => {
            //   console.error('Test api err', err)
            // })
            /* Use the idToken for Logins Map when Federating User Pools with identity pools or when passing through an Authorization Header to an API Gateway Authorizer*/
            const idToken = result.getIdToken();
            const cognitoLogin = `cognito-idp.${apiConfig.Region}.amazonaws.com/${apiConfig.UserPoolId}`;
            console.log("cognitoLogin", cognitoLogin);

            AWS.config.credentials = new AWS.CognitoIdentityCredentials({
              IdentityPoolId: apiConfig.IdentityPoolId,
              Logins: {
                [cognitoLogin]: idToken.getJwtToken()
              }
            });

            AWS.config.credentials['get'](function(){
              res({
                accessToken,
                idToken,
                creds: AWS.config.credentials
              })
          });


        },
        onFailure: function(err) {
            rej(err);
        },
    });
  });
}

export default function auth(apiConfig: any, userConfig) {
  return checkUserExists(apiConfig, userConfig)
    .then((result) => signIn(apiConfig, userConfig))
    .catch((err) => {
      // tslint:disable-next-line:no-console
      console.error("check user err", err);
    });
}
