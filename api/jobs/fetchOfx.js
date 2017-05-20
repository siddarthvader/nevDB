var request = require('request');
var db = require('./../db');
var http = require('https');
var moment = require('moment');
var urlDB = process.env.MONGODB_URI || 'mongodb://localhost:27017/nevDb?authMechanism=DEFAULT&authSource=db';
var auth = {
    user: 'nevRoot',
    pwd: 'nevRoot'
};

var storeRaw = (freq, symbol, date, f, average) => {
    if (freq === 'monthly') {
        // monthly data
        db.get().collection('currencyHistoricMonthlyCollection').insert({
            "symbol": symbol,
            "base_currency": "USD",
            "date": date.unix(),
            "month_str": date.format('MMM'),
            "month_int": parseInt(date.format('MM')),
            "year": parseInt(date.format('YYYY')),
            "interest_rate": f.InterbankRate,
            "inverse_interest_rate": f.InverseInterbankRate,
            "interest_rate_change_percentage": average

        }, (err, res) => {
            // console.log(err, "err")
        });
    }
    else {
        //weekly data
        db.get().collection('currencyHistoricCollection').insert({
            "symbol": symbol,
            "base_currency": "USD",
            "date": date.unix(),
            "day_of_week": date.day(),
            "day_of_month": parseInt(date.format('DD')),
            "week": date.week(),
            "month_str": date.format('MMM'),
            "month_int": parseInt(date.format('MM')),
            "year": parseInt(date.format('YYYY')),
            "is_end_of_month": moment().endOf('month').format('DD') === date.format('DD') ? true : false,
            "interest_rate": f.InterbankRate,
            "inverse_interest_rate": f.InverseInterbankRate,
            "interest_rate_change_percentage": average

        }, (err, res) => {
            // console.log(err, "err")
        });
    }
}
exports.get = () => {
    db.connect(urlDB, auth, (err) => {
        if (err) {
            console.log('unable to connect to mongo');
        }
        else {
            console.info('doing well');
            var timeTickers = ['daily', 'monthly'];

            timeTickers.forEach((freq) => {
                var SYMBOL = ['AUD', 'EUR', 'GBP', 'JPY', 'CAD', 'CHF', 'NZD'];

                SYMBOL.forEach(function (symbol) {
                    //monthly url  
                    var url = 'https://api.ofx.com/PublicSite.ApiService/SpotRateHistory/' + symbol + '/USD/457794600000/1483122600000?DecimalPlaces=6&ReportingInterval=' + freq;
                    console.log(url);
                    request({
                        url: url,
                        json: true
                    }, function (error, response, body) {
                        if (!error && response.statusCode === 200) {
                            var history = body.HistoricalPoints;
                            history.forEach(function (f, i) {
                                var date = history[i].date = moment(f.PointInTime / 1000, 'X');
                                history[i].year = parseInt(date.format("YYYY"));
                                history[i].month = parseInt(date.format("MM"));
                                history[i].week = date.week();
                                history[i].symbol=symbol;

                                var average;
                                if (i == 0) {
                                    average = 0;
                                }
                                else {
                                    average = 100 * (f.InterbankRate - history[i - 1].InterbankRate) / history[i - 1].InterbankRate;
                                }
                                history[i].average = average;
                                storeRaw(freq, symbol, date, f, average);


                                if (freq === 'daily') {
                                    console.log(freq);

                                    if (i > 0) {
                                        if (history[i - 1].year === f.year && history[i - 1].week === f.week) {
                                            // weeklyObj = {
                                            //     symbol: symbol,
                                            //     change: average,
                                            //     week: history.week,
                                            //     year: history.year,
                                            //     month: history.month
                                            // };
                                        }
                                        else {
                                            console.log('here');
                                            console.log(history[i - 1])
                                            var symbol_inner = history[i - 1].symbol;
                                            var week = history[i - 1].week;
                                            var year = history[i - 1].year;
                                            var change = history[i - 1].average;
                                            var month_int = history[i - 1].month;
                                            db.get().collection('currencyWeeklyCollection').insert({
                                                symbol: symbol_inner,
                                                change: change,
                                                week: week,
                                                year: year,
                                                month: month_int
                                            }, function (err, data) {
                                                console.log(err);
                                            });
                                        }
                                    }
                                }

                            });
                        };
                    });
                });
            });
        }
    });
}