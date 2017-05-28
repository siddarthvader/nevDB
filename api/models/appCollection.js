var request = require('request');
var db = require('./../db');
var moment = require('moment');
var request = require('request');
const quandl_api_key = "xL_9oFs5gTigbat_D6RH";

exports.scrapeEPSFromZacks = (body, done) => {
    console.log(body, "body");
    request('https://widget3.zacks.com/data/chart/json/' + body.symbol + '/price_and_eps_estimates_consensus/www.zacks.com', function (err, response, body) {
        done(body);
    });
};

exports.getCurrencyDatafromDB = (body, done) => {
    console.log(body.symbols);
    var response = {};
    db.get().collection('currencyWeeklyCollection').find({ symbol: { $in: body.symbols } }).toArray((err, data) => {
        response.weekly = data;
        db.get().collection('currencyHistoricMonthlyCollection').find({ symbol: { $in: body.symbols } }).toArray((err, res) => {
            response.monthly = res;
            done(response);
        });
    });
};

exports.getEquitiesDataFromQuandl = (body, done) => {
    var symbol = body.symbols.toString() || 'AAPL';
    var url="https://www.quandl.com/api/v3/datatables/WIKI/PRICES.json?qopts.columns=ticker,date,adj_close,adj_volume&date.gte=19860101&date.lt=20160101&ticker="+symbol+"&api_key=xL_9oFs5gTigbat_D6RH";
    // var url = "https://www.quandl.com/api/v3/datatables/ZACKS/P.json?qopts.columns=ticker,date,close,volume&ticker=" + symbol + "&date.gte=1985-01-01&date.lt=2016-12-31&api_key=xL_9oFs5gTigbat_D6RH";
    request.get({
        url: url,
        json: true
    }, function (err, data) {
        console.log(data.body);
        done(data.body);
    });


};

exports.getFuturesDataFromQuandl = (body, done) => {
    console.log(body.symbols,"<<");
    var url = "https://www.quandl.com/api/v1/datasets/CHRIS/ICE_CT1.json?api_key=xL_9oFs5gTigbat_D6RH&transform=rdiff&collapse=weekly";
    request.get({
        url: url,
        json: true
    }, function (err, data) {
        console.log(data.body);
        done(data.body);
    });
};