const express = require('express');

function createReviewServer(filePath) {
  return new Promise((resolve, reject) => {
    try {
      const app = express();
      app.get('/', (req, res) => {
        res.send(`Todo - build a viewer for photos in ${filePath}`);
      });
      const listener = app.listen(3000, () => {
        resolve(listener);
      });
    } catch (e) {
      reject(e);
    }
  });
}

module.exports = createReviewServer;
