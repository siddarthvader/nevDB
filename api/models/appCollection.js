var request = require('request');
var db = require('./../db');
var moment = require('moment');
var request = require('request');
const quandl_api_key = "xL_9oFs5gTigbat_D6RH";
var async = require('async');
var https = require('https');
var cheerio = require('cheerio');
var yahooFinance = require('yahoo-finance');

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
        db.get().collection('currencyMonthlyCollection').find({ symbol: { $in: body.symbols } }).toArray((err, res) => {
            response.monthly = res;
            db.get().collection('currencyHistoricCollection').find({ symbol: { $in: body.symbols } }).toArray((err, res) => {
                response.daily = res;
                done(response);
            });
        });
    });
};

exports.getEquitiesDataFromYahoo = (body, done) => {
    // var symbol = body.symbols.toString() || 'AAPL';
    console.log(body.symbols);
    var completed_requests = 0;
    var responses = [];
    yahooFinance.historical({
        symbols: body.symbols,
        from: '1986-01-01',
        to: '2016-12-31',
        period: 'd'  // 'd' (daily), 'w' (weekly), 'm' (monthly), 'v' (dividends only)
    }, function (err, quotes) {
        if (!err) {
            // console.log(quotes);
            body.symbols.forEach(function (symbol) {
                // con
                if (quotes[symbol]) {
                    // console.log(symbol, res.body.datatable.data.length ,"<<<<<<");
                    responses = responses.concat(quotes[symbol]);
                }
                // console.log(quotes);

            });

            done(responses);

        }

    });

};

exports.getFuturesDataFromQuandl = (body, done) => {
    console.log(body.code, "<<");
    var completed_requests = 0;
    var urls = body.code;
    var responses = {
        datatable: {
            data: [],
            dates: {}
        }
    };
    urls.forEach(function (code) {
        url = "https://www.quandl.com/api/v1/datasets/" + code + "1.json?api_key=xL_9oFs5gTigbat_D6RH&transform=rdiff&collapse=daily"
        console.log(url);
        request.get({
            url: url,
            json: true
        }, function (err, res) {
            let code = res.body.code;
            let date_index;
            let close_index;
            let volumn_index;
            let settle_index;

            console.log(res.body.column_names, code);
            res.body.column_names.forEach(function (column, i) {
                if (column === 'Date') {
                    date_index = i;
                }
                if (column == 'Settle') {
                    settle_index = i;
                }
                if (column == 'Close') {
                    close_index = i;
                }
                if (column === 'Volume') {
                    volumn_index = i;
                }
            });

            var temp = [];

            res.body.data.forEach(function (data, i) {
                res.body.data[i].push(code);
                temp[i] = [];
                temp[i].push(code, data[date_index], data[close_index] ? data[close_index] : data[settle_index], data[volumn_index]);
            });

            if (!responses.datatable.data) {
                responses.datatable.data = temp;
            }
            else {
                responses.datatable.data = responses.datatable.data.concat(temp);
            }
            responses.datatable.dates[code] = res.body.from_date;


            if (completed_requests++ == urls.length - 1) {
                // All downloads are completed
                // console.log(responses);
                done(responses);
            }
        });
    })
};

exports.scrapeYahooWeightage = (body, done) => {
    var url = 'https://finance.yahoo.com/quote/SPY/holdings?p=+'+body.ticker;
    request(url, function (err, response, html) {
        // console.log(html,err);
        if (!err) {
            var $ = cheerio.load(html);
            console.log($('#quote-leaf-comp').html());
            done($('#quote-leaf-comp').html());
        }
    });
};

exports.getQuotesFromYahoo = (body, done) => {
    yahooFinance.quote({
        symbol: body.symbol,
        modules: ['summaryDetail','financialData','defaultKeyStatistics','earnings','upgradeDowngradeHistory','calendarEvents','summaryProfile','price'] // see the docs for the full list
    }, function (err, quotes) {
        // ...
        done(quotes);
    });
};