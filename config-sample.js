module.exports = {
  extensions:['jpg','jpeg','png'], // all images and videos: jpg,jpeg,mp4,mov,avi,png,pmg,gif
  fileCriteria: {
    fileSize: 100,
    pixels: (640 * 480)
  },
  cwd: '//path/to/images',
  api:{
    kairos:{
      appId: '<yur app id>',
      key: '<key>',
      base_url: 'api.kairos.com'
    }
  }
}
