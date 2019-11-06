
import { API } from "aws-amplify";
import retry from "retry";

export function retryer(fn: any, args: any) {
  return new Promise((res, rej) => {
    const operation = retry.operation();
    operation.attempt((currentAttempt) => {
      API[fn](...args)
        .then(res)
        .catch((err: any) => {
          console.log(`Failed attempt ${currentAttempt} with ${JSON.stringify(args)}`);
          if (operation.retry(err)) {
            console.log('Retrying', err);
            return;
          }
          rej(operation.mainError());
        });
    });
  });
}

const endpointName = "fotos";
export const post = (hostname: string, route: string, params: any) => API.post(endpointName, route, params);
export const get = (hostname: string, route: string) => API.get(endpointName, route, {});
export const del = (hostname: string, route: string) => API.del(endpointName, route, {});
export const put = (hostname: string, route: string, params: any) => API.put(endpointName, route, params);
