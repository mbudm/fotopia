const express = require('express');

function createReviewServer(filePath){
    return new Promise((resolve, reject) => {
        try{
            const app = express()
            app.get('/', function (req, res) {
                res.send('Hello World')
            })
            app.listen(3000);
            resolve(app);
        }catch(e){
            reject(e);
        }
    })
}

module.exports = createReviewServer;