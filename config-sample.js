module.exports = {
  extensions:['jpg','png'],
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
