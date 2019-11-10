import * as fs from 'fs';
import * as path from 'path';

function ensureDirectoryExistence(filePath) {
  const dirname = path.dirname(filePath);
  if (fs.existsSync(dirname)) {
    console.log('exists:', dirname, filePath);
    return true;
  }
  ensureDirectoryExistence(dirname);
  console.log('about to makdir', dirname);
  return fs.mkdirSync(dirname);
}

export default ensureDirectoryExistence;
