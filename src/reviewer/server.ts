import * as express from 'express';
import * as fileTools from './../fileTools';

export function createReviewServer(filePath, uploader) {
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
          uploader(filePath)
            .then(res.send)
            .catch(err => res.status(500).send(err));
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

