# fotopia gathering

A collection of node scripts for sorting through a photo archive and working out what is good. Then you have the option to bulk upload the photos to a [fotopia-serverless](https://github.com/mbudm/fotopia-serverless) instance

## Usage
- `yarn`
- copy `config-sample.js` edit to suit your preferences and save as `config.js`
- `yarn start`

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
```
