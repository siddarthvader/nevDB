var request = require('request');
var db = require('./../db');
var moment = require('moment');

exports.scrapeEPSFromZacks = (body, done) => {
    console.log(body, "body");
    request('https://widget3.zacks.com/data/chart/json/' + body.symbol + '/price_and_eps_estimates_consensus/www.zacks.com', function (err, response, body) {
        done(body);
    });
};

exports.getCurrencyDatafromDB = (body, done) => {
    console.log(body.symbols);
    var response={};
    db.get().collection('currencyWeeklyCollection').find({symbol:{$in: body.symbols }}).toArray((err, data) => {
        response.weekly=data;
        db.get().collection('currencyHistoricMonthlyCollection').find({symbol:{$in: body.symbols }}).toArray((err,res)=>{
            response.monthly=res;
            done(response);
        });
    });
};