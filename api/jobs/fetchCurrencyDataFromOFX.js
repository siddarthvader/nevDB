var request = require('request');
var db = require('./../db');
var http = require('https');
var moment = require('moment');
var urlDB = process.env.MONGODB_URI || 'mongodb://localhost:27017/nevDb?authMechanism=DEFAULT&authSource=db';
var auth = {
    user: 'nevRoot',
    pwd: 'nevRoot'
};

exports.storeIntoDb = (type) => {
    db.connect(urlDB, auth, (err) => {
        if (err) {
            console.log('unable to connect to mongo');
        }
        else {
            console.log("listening nice");
            var SYMBOL = ['AUD', 'EUR', 'GBP', 'JPY', 'CAD'];

            SYMBOL.forEach(function (symbol) {

                //monthly url    
                var url = 'https://api.ofx.com/PublicSite.ApiService/SpotRateHistory/' + symbol + '/USD/757794600000/1483122600000?DecimalPlaces=6&ReportingInterval=monthly';

                //weekly url (no weekly option so fetching daily 
                // and then computing)  
                var url = 'https://api.ofx.com/PublicSite.ApiService/SpotRateHistory/' + symbol + '/USD/757794600000/1483122600000?DecimalPlaces=6&ReportingInterval=daily';
                
                request({
                    url: url,
                    json: true
                }, function (error, response, body) {

                    if (!error && response.statusCode === 200) {
                        var history = body.HistoricalPoints;
                        history.forEach(function (f, i) {
                            var date = moment(f.PointInTime / 1000, 'X');
                            var average;
                            if (i == 0) {
                                average = 0;
                            }
                            else {
                                average = 100 * (f.InterbankRate - history[i - 1].InterbankRate) / history[i - 1].InterbankRate;
                            }

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
                                console.log(err, "err")
                            });

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
                                console.log(err, "err")
                            });

                        });
                    }
                });

            });
        }
    });
};
exports.weeklyTablePrepare = () => {
    db.connect(urlDB, auth, (err) => {
        if (err) {
            console.log('there is error');
        }
        else {
            console.log('here ok')
            var SYMBOL = ['AUD', 'EUR', 'GBP', 'JPY', 'CAD'];

            SYMBOL.forEach(function (symbol) {
                for (y = 1994; y <= 2016; y++) {
                    for (w = 1; w <= 53; w++) {
                        // console.log(y,w,symbol);
                        db.get().collection('currencyHistoricCollection').find({ symbol: symbol, year: y, week: w }, { sort: [['year', 'asc'], ['week', 'asc'], ["day_of_week", 'desc']] }).toArray(function (err, data) {
                            if (data.length) {
                                // console.log(data);
                                // console.log("yes", data[0].day_of_week);
                                console.log("year", data[0].year);
                                console.log('weel', data[0].week);
                                db.get().collection('currencyWeeklyCollection').insert({
                                    symbol: data[0].symbol,
                                    change: data[0].interest_rate_change_percentage,
                                    week: data[0].week,
                                    year: data[0].year,
                                    month: data[0].month_int
                                }, function (err, data) {
                                    console.log(err);
                                });
                            }
                            else {
                                console.log(err);
                            }
                        });
                        // db.get().collection('currencyHistoricalCollection').find({symbol:symbol,year:y,week:w},function(err,data){
                        //     console.log(data);
                        // });
                    }
                }

                db.get().collection('currencyHistoricCollection').find({ symbol: symbol }).toArray((err, data) => {
                    var weekData = {};


                });
            });
        }
    });
};

exports.monthlyTablePrepare = () => {
    db.connect(urlDB, auth, (err) => {
        if (err) {
            console.log('there is error');
        }
        else {
            console.log('here ok')
            var SYMBOL = ['AUD', 'EUR', 'GBP', 'JPY', 'CAD'];

            SYMBOL.forEach(function (symbol) {
                for (y = 1994; y <= 2016; y++) {
                    for (w = 1; w <= 53; w++) {
                        // console.log(y,w,symbol);
                        db.get().collection('currencyHistoricCollection').find({ symbol: symbol, year: y, week: w }, { sort: [['year', 'asc'], ['week', 'asc'], ["day_of_week", 'desc']] }).toArray(function (err, data) {
                            if (data.length) {
                                // console.log(data);
                                // console.log("yes", data[0].day_of_week);
                                console.log("year", data[0].year);
                                console.log('weel', data[0].week);
                                db.get().collection('currencyMonthlyCollection').insert({
                                    symbol: data[0].symbol,
                                    change: data[0].interest_rate_change_percentage,
                                    week: data[0].week,
                                    year: data[0].year,
                                    month: data[0].month_int
                                }, function (err, data) {
                                    console.log(err);
                                });
                            }
                            else {
                                console.log(err);
                            }
                        });
                        // db.get().collection('currencyHistoricalCollection').find({symbol:symbol,year:y,week:w},function(err,data){
                        //     console.log(data);
                        // });
                    }
                }

                db.get().collection('currencyHistoricCollection').find({ symbol: symbol }).toArray((err, data) => {
                    var weekData = {};


                });
            });
        }
    });
};