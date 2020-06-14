import * as sharp from 'sharp';
import * as path from 'path';
import ensureDirectoryExistence from './ensureDirectoryExistence';

function createThumbnailFilename(filename, thumbPath) {
  return path.join(thumbPath, filename.split('/').pop());
}

function createThumbnail(filename, thumbnail) {
  return sharp(filename)
    .resize(200, 200)
    .toFile(thumbnail);
}

export function createThumbnails(list: any[], config) {
  if (!Array.isArray(list) || list.length === 0) {
    throw new Error(`list is null or empty ${list}`);
  }
  ensureDirectoryExistence(path.join(process.cwd(), config.thumbs, list[0].path));
  return Promise.all(list.map((listItem) => {
    const thumbnail = createThumbnailFilename(listItem.path, config.thumbs);
    return createThumbnail(listItem.path, thumbnail)
      .then(thumbData => ({
        ...listItem,
        thumbnail,
        thumbData,
      }))
      .catch(error => ({
        ...listItem,
        thumbnail: 'error',
        thumbError: error,
        thumbData: null
      }));
  }));
}

