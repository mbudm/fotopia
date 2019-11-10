import * as fs from 'fs';

export function readJson(filename) {
  return new Promise((resolve, reject) => {
    fs.readFile(filename, (err, jsonBuffer) => {
      if (err) {
        reject(err);
        return;
      }
      try {
        const data = JSON.parse(jsonBuffer.toString());
        resolve(data);
      } catch (exception) {
        reject(exception);
      }
    });
  });
}
