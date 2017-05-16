var appModel = require('./../models/appCollection.js');
var appView = require('./../views/appView.js');

exports.get = (req, res, path) => {
    //console.log(path, "path");
    switch (path) {
        case '/scrapeZacksForEPS':
            scrapeZacks(req, res);
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
        appModel.scrapeEPSFromZacks(JSON.parse(body),function (results) {
            appView.sendEPStoClient(req,res,results);
        });
    });
}