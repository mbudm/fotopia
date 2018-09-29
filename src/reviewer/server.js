const express = require('express');
const fileTools = require('./../fileTools');

function createReviewServer(filePath) {
  return fileTools.readJson(filePath)
    .then(data => new Promise((resolve, reject) => {
      try {
        const app = express();
        app.set('view engine', 'pug');
        app.set('views', './templates');
        app.use(express.static(process.cwd()));
        app.get('/', (req, res) => {
          res.render('index', data);
        });
        app.post('/upload', (req, res) => {
          res.send('Got a POST request');
        });
        // more paths
        // reject
        // accept
        // upload [array]
        // rotate left 90 / rotate right 90
        const listener = app.listen(3000, () => {
          resolve(listener);
        });
      } catch (e) {
        reject(e);
      }
    }));
}

module.exports = createReviewServer;
