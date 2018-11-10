# fotopia gathering

A collection of node scripts for sorting through a photo archive and working out what is good. Then you have the option to bulk upload the photos to a [fotopia-serverless](https://github.com/mbudm/fotopia-serverless) instance

## Usage
- `yarn`
- copy `config-sample.js` edit to suit your preferences and save as `config.js`
- `yarn start` 
  What this does:
  - reads files in the folder specified in config
  - sorts them into accepted and rejected lists.
  - runs a server at http://localhost:3000 where you can review the photos and decide to upload then.
  - depending on the amount of images in your folder this can take a while. Tested with a HD containing 60k images, this took **10 minutes**.

If you've alread run `yarn start` on a folder then there's no need to rerun the whole thing, just reload the review server with an existing file:
- `yarn start --review-file /path/to/temp/generated-file.json`

Or upload directly with
- `yarn start --upload-file /path/to/temp/generated-file.json`

## Tests
- `yarn test`

## Config
```javascript
  extensions:['jpg','jpeg','png'], // all images and videos that seem to work: jpg,jpeg,mp4,mov,avi,png,pmg,gif
  criteria: {
    fileSize: 100000, // your minimum file size criteria
    pixels: (640 * 480) // cut off for small images not worth keeping
  },
  cwd: '/path/to/images', //image folder you want to sort through
  temp: './temp', // outputs file list here
  fotopia: { // the fotopia-serverless instance you want to upload to
    api: 'https://api.your-fotopia-instance.com',
    user: 'fototpia-user',
    pwd: 'fototpia-user-pwd',
  },
```
