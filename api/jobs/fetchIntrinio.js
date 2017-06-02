//index.js
var username = "2bcbcf116b6c5e30af69da737a264d56" //Your Intrinio App Username
var password = "059b6abb3eb50b1dafd88e026da957ca" //Your Intrinio App Password
var intrinio = require("intrinio-client")(username, password)
var db = require('./../db');
var urlDB = process.env.MONGODB_URI || 'mongodb://localhost:27017/nevDb?authMechanism=DEFAULT&authSource=db';
var auth = {
    user: 'nevRoot',
    pwd: 'nevRoot'
};

intrinio
    .companies('AAPL')			//All endpoints follow this pattern
    .on('complete', function (data, response) {
        //data is the response from the Intrinio API
        //response is the http response
        if (response.statusCode == 404) {
            console.log("Not found")
        } else if (response.statusCode == 200) {
            console.log(data)
            db.connect(urlDB, auth, (err) => {
                if (err) {
                    console.log('unable to connect to mongo');
                }
                else {
                    db.get().collection('companiesDetailsCollection').insert({
                        
                    })
                }
            });


        }
    });

//https://api.intrinio.com/prices?ticker=XLV