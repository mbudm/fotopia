# fotopia

A collection of node scripts for sorting through a phot archive and working out what is good.

## Usage
- `npm install`
- copy `config-sample.js` edit to suit your preferences and save as `config.js`
- npm start

## Tests
- `npm test`

## Config
```javascript
  extensions:['jpg','jpeg','png'], // all images and videos that seem to work: jpg,jpeg,mp4,mov,avi,png,pmg,gif
  criteria: {
    fileSize: 100000, // your minimum file size criteria
    pixels: (640 * 480) // cut off for small images not worth keeping
  },
  cwd: '/path/to/images', //image folder you want to sorth through
  temp: './temp', // outputs file list here
  api:{
    kairos:{ //todo use the kairos api to identify people
      appId: '<your app id>',
      key: '<key>',
      base_url: 'api.kairos.com'
    }
  }
```