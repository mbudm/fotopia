import "isomorphic-fetch";

import * as AmazonCognitoIdentity from "amazon-cognito-identity-js";
import * as AWS from "aws-sdk";
import { CognitoIdentityCredentials } from "aws-sdk";

function authenticateExistingUser(config: any, userConfig) {
  return new Promise((resolve, reject) => {
    const authenticationData = {
      Password : userConfig.pwd || "",
      Username : userConfig.user || "",
    };
    const authenticationDetails = new AmazonCognitoIdentity.AuthenticationDetails(authenticationData);
    const poolData = {
      ClientId : config.UserPoolClientId,
      UserPoolId : config.UserPoolId,
    };
    const userPool = new AmazonCognitoIdentity.CognitoUserPool(poolData);
    const userData = {
        Pool : userPool,
        Username : authenticationData.Username,
    };
    const cognitoUser = new AmazonCognitoIdentity.CognitoUser(userData);
    cognitoUser.authenticateUser(authenticationDetails, {
      onSuccess(result) {
        resolve(result);
      },
      onFailure(err) {
        reject(err);
      },
    });
  });
}

function getCurrentUser(config) {
  const userPool = new  AmazonCognitoIdentity.CognitoUserPool({
    ClientId : config.UserPoolClientId,
    UserPoolId : config.UserPoolId,
  });
  return userPool.getCurrentUser();
}

function getUserToken(currentUser) {
  return new Promise((resolve, reject) => {
    currentUser.getSession((err, session) => {
      if (err) {
        reject(err);
        return;
      }
      resolve(session.getIdToken().getJwtToken());
    });
  });
}

function getAwsCredentials(config: any, userToken) {
  const authenticator = `cognito-idp.${config.Region}.amazonaws.com/${config.UserPoolId}`;

  AWS.config.update({ region: config.Region});
  AWS.config.credentials = new AWS.CognitoIdentityCredentials({
    IdentityPoolId: config.IdentityPoolId,
    Logins: {
      [authenticator]: userToken,
    },
  });

  // tslint:disable-next-line:no-string-literal
  return AWS.config.credentials["getPromise"]()
  .then(() => {
    const cognitoCreds: CognitoIdentityCredentials = AWS.config.credentials as CognitoIdentityCredentials;
    return {
      bucket: config.Bucket,
      userIdentityId: cognitoCreds.identityId,
      credentials: {
        accessKeyId: AWS.config.credentials!.accessKeyId,
        sessionToken: AWS.config.credentials!.sessionToken,
        secretAccessKey: AWS.config.credentials!.secretAccessKey,
      }
    };
  });
}

export default function auth(config: any, userConfig) {
  return authenticateExistingUser(config, userConfig)
    .then(() => getCurrentUser(config))
    .then(getUserToken)
    .then((userToken) => getAwsCredentials(config, userToken))
    .catch((err) => {
      // tslint:disable-next-line:no-console
      console.error("check user err", err);
    });
}
