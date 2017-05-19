var request = require('request');
var db = require('./../db');
var http = require('https');
var moment = require('moment');
var urlDB = process.env.MONGODB_URI || 'mongodb://localhost:27017/nevDb?authMechanism=DEFAULT&authSource=db';
var auth = {
    user: 'nevRoot',
    pwd: 'nevRoot'
};

exports.get = (type) => {
    db.connect(urlDB, auth, (err) => {
        if (err) {
            console.log('unable to connect to mongo');
        }
        else {
            console.log("listening nice");
            var SYMBOL = ['AUD', 'EUR', 'GBP', 'JPY', 'CAD'];

            SYMBOL.forEach(function (symbol) {

                var url = 'https://api.ofx.com/PublicSite.ApiService/SpotRateHistory/'+symbol+'/USD/757794600000/1483122600000?DecimalPlaces=6&ReportingInterval=daily';
                request({
                    url: url,
                    json: true
                }, function (error, response, body) {

                    if (!error && response.statusCode === 200) {
                        console.log(body.HistoricalPoints.length) // Print the json response
                        var history = body.HistoricalPoints;
                        history.forEach(function (f, i) {
                            var date = moment(f.PointInTime / 1000, 'X');
                            // console.log(moment().endOf('month').format('DD') === date.format('DD'));
                            var average;
                            if (i == 0) {
                                average = 0;
                            }
                            else {
                                average = 100 * (f.InterbankRate - history[i - 1].InterbankRate) / history[i - 1].InterbankRate;
                            }
                            db.get().collection('currencyHistoricCollection').insert({
                                "symbol": SYMBOL,
                                "base_currency": "USD",
                                "date": date.unix(),
                                "month_str": date.format('MMM'),
                                "month_int": parseInt(date.format('MM')),
                                "week": date.week(),
                                "day_of_week": date.day(),
                                "is_end_of_month": moment().endOf('month').format('DD') === date.format('DD') ? true : false,
                                "interest_rate": f.InterbankRate,
                                "inverse_interest_rate": f.InverseInterbankRate,
                                "interest_rate_change_percentage": average

                            }, (err, res) => {
                                console.log(err, "err")
                            });

                        });
                    }
                });

            });
        }
    });
};