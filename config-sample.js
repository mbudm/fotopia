module.exports = {
  extensions: ['jpg', 'jpeg', 'png'], // all images and videos that seem to work: jpg,jpeg,mp4,mov,avi,png,pmg,gif
  criteria: {
    fileSize: 100000, // bytes
    pixels: (640 * 480),
  },
  cwd: '/path/to/images',
  temp: './temp',
  thumbs: './thumbs',
  fotopia: {
    api: 'https://api.your-fotopia-instance.com',
    user: 'fotopia-user',
    pwd: 'fotopia-user-pwd',
  },
};
