var appModal = require('./../models/appCollection.js');
var appView = require('./../views/appView.js');

exports.get = (req, res, path) => {
    console.log(path, "path");
    switch (path) {
        case '/scrapeZacksForEPS':
            scrapeZacks(req, res);
            break;
        case '/currencyData':
            currencyData(req, res);
            break;
        default:
            break;
    }
}

var scrapeZacks = (req, res) => {
    let body = '';
    req.on('data', (data) => {
        body += data;
    });


    req.on('end', function () {
        console.log(JSON.parse(body));
        appModal.scrapeEPSFromZacks(JSON.parse(body), function (results) {
            appView.sendEPStoClient(req, res, results);
        });
    });
}

var currencyData = (req, res) => {
    let body = '';
    req.on('data', (data) => {
        body += data;
        console.log(data,"data");
    });
    req.on('end', function () {
        console.log(body,"body");
        appModal.getCurrencyDatafromDB(JSON.parse(body),(results) => {
            appView.sendCurrencyData(req,res,JSON.parse(body),results);
        })
    });

};
