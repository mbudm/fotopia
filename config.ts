export const config = {
  extensions: ['jpg', 'jpeg', 'png'], // all images and videos that seem to work: jpg,jpeg,mp4,mov,avi,png,pmg,gif
  criteria: {
    fileSize: 100000, // bytes
    pixels: (640 * 480),
  },
  cwd: '/Users/steve/Dropbox/test uploads',
  temp: './temp',
  thumbs: './thumbs',
  fotopia: {
    api: 'https://api-test.sosnowski-roberts.com',
    user: 'tester',
    pwd: '@KeepMe3',
  },
};
