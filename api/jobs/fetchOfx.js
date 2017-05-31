var request = require('request');
var db = require('./../db');
var http = require('https');
var moment = require('moment');
var fs = require("fs");
var urlDB = process.env.MONGODB_URI || 'mongodb://localhost:27017/nevDb?authMechanism=DEFAULT&authSource=db';
var auth = {
    user: 'nevRoot',
    pwd: 'nevRoot'
};

var storeRaw = (freq, symbol, date, f, interest_rate_change_percentage, interest_rate_change) => {
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
            "interest_rate_change": interest_rate_change,
            "interest_rate_change_percentage": interest_rate_change_percentage

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
            "week": date.isoWeek(),
            "month_str": date.format('MMM'),
            "month_int": parseInt(date.format('MM')),
            "year": parseInt(date.format('YYYY')),
            "is_end_of_month": moment().endOf('month').format('DD') === date.format('DD') ? true : false,
            "interest_rate": f.InterbankRate,
            "inverse_interest_rate": f.InverseInterbankRate,
            "interest_rate_change": interest_rate_change,
            "interest_rate_change_percentage": interest_rate_change_percentage

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
                                history[i].week = date.isoWeek();
                                history[i].symbol = symbol;
                                var interest_rate_change;
                                var interest_rate_change_percentage;
                                if (i == 0) {
                                    interest_rate_change_percentage = 0;
                                    interest_rate_change = 0;
                                }
                                else {
                                    if (f.symbol === history[i - 1].symbol) {
                                        interest_rate_change_percentage = 100 * (f.InterbankRate - history[i - 1].InterbankRate) / history[i - 1].InterbankRate;
                                        interest_rate_change = f.InterbankRate - history[i - 1].InterbankRate;
                                    }
                                    else {
                                        interest_rate_change_percentage = 0;
                                        interest_rate_change = 0;
                                    }
                                }
                                interest_rate_change_percentage = Math.round(interest_rate_change_percentage * 10000) / 10000;
                                interest_rate_change = Math.round(interest_rate_change * 10000) / 10000;

                                // console.log(interest_rate_change_percentage);
                                history[i].interest_rate_change_percentage = interest_rate_change_percentage;
                                history[i].interest_rate_change = interest_rate_change;

                                storeRaw(freq, symbol, date, f, interest_rate_change_percentage, interest_rate_change);;


                                if (freq === 'daily') {
                                    // console.log(freq);

                                    if (i > 0) {

                                        if (history[i - 1].date.isSame(f.date, 'week')) {

                                        }
                                        else {

                                            var symbol_inner = history[i - 1].symbol;
                                            var week = history[i - 1].week;
                                            var year;
                                            var interest_rate = history[i - 1].InterbankRate;
                                            var interest_rate_change_percentage = history[i - 1].interest_rate_change_percentage;
                                            var month_int = history[i - 1].month;
                                            var interest_rate_change;
                                            var date = history[i - 1].date.unix();
                                            year = history[i - 1].date.isoWeekYear();


                                            if (i > 0 && history[i - 1].symbol === history[i].symbol) {
                                                interest_rate_change = Math.round((history[i].InterbankRate - history[i - 1].InterbankRate) * 10000) / 10000;
                                            }
                                            else {
                                                interest_rate_change = 0;
                                            }
                                            db.get().collection('currencyWeeklyCollection').insert({
                                                symbol: history[i - 1].symbol,
                                                week: week,
                                                year: year,
                                                month: month_int,
                                                date: date,
                                                interest_rate: interest_rate,
                                                interest_rate_change: interest_rate_change,
                                                interest_rate_change_percentage: interest_rate_change_percentage
                                            }, function (err, data) {
                                                if (!err) {
                                                    if (data.ops[0].week === 1) {
                                                        db.get().collection('currencyWeeklyCollection').findOne({ symbol: data.ops[0].symbol, week: 53, year: data.ops[0].year - 1 }, function (err, res) {
                                                            if (res) {
                                                                // console.log(res, res.rate);
                                                                // console.log(data.ops[0].rate);
                                                                // console.log(data.ops[0].rate);
                                                                db.get().collection('currencyWeeklyCollection').update({ _id: data.ops[0]._id }, { $set: { interest_rate_change_weekly: Math.round((data.ops[0].interest_rate - res.interest_rate) * 10000) / 10000 } }, function (err) {
                                                                    console.log(err, 'inserted');
                                                                });
                                                            }
                                                            else {

                                                                db.get().collection('currencyWeeklyCollection').findOne({ symbol: data.ops[0].symbol, week: 52, year: data.ops[0].year - 1 }, function (err, res) {
                                                                    if (res) {
                                                                        db.get().collection('currencyWeeklyCollection').update({ _id: data.ops[0]._id }, { $set: { interest_rate_change_weekly: Math.round((data.ops[0].interest_rate - res.interest_rate) * 10000) / 10000 } }, function (err) {
                                                                            // console.log(err,'inserted');
                                                                        });
                                                                    }
                                                                    else {
                                                                        db.get().collection('currencyWeeklyCollection').update({ _id: data.ops[0]._id }, { $set: { interest_rate_change_weekly: 0 } }, function (err) {
                                                                            // console.log(err,'inserted');
                                                                        });
                                                                    }
                                                                });
                                                            }
                                                        });
                                                    }
                                                    else {
                                                        db.get().collection('currencyWeeklyCollection').findOne({ symbol: data.ops[0].symbol, week: data.ops[0].week - 1, year: data.ops[0].year }, function (err, res) {
                                                            if (res) {
                                                                // console.log(res, res.rate);
                                                                // console.log(data.ops[0].rate);
                                                                // console.log(data.ops[0].rate);
                                                                db.get().collection('currencyWeeklyCollection').update({ _id: data.ops[0]._id }, { $set: { interest_rate_change_weekly: Math.round((data.ops[0].interest_rate - res.interest_rate) * 10000) / 10000 } }, function (err) {
                                                                    // console.log(err,'inserted');
                                                                });
                                                            }
                                                        });
                                                    }

                                                }
                                                // console.log(err);
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

exports.setMonthlyData = () => {
    db.connect(urlDB, auth, (err) => {
        if (err) {
            console.log('unable to connect to mongo');
        }
        else {
            console.info('doing well');
            var freq = ['monthly', 'weekly'];


         db.get().collection('currencyHistoricCollection').find({}).sort({ symbol: 1, year: 1, month_int: 1, day_of_month: 1 }).toArray(function (err, history) {
                // console.log(typeof results);
                var arr = [];
                var json = arr;
                var interest_rate_change, interest_rate_change_percentage;
                freq.forEach(function (f) {
                    history.forEach(function (entity, i) {
                        if (f === 'monthly') {
                            if (i === 0) {

                            }
                            else {

                                if (history[i - 1].month_int !== entity.month_int && history[i - 1].symbol === entity.symbol) {
                                    console.log(i);
                                    db.get().collection('currencyMonthlyCollection').insert({
                                        symbol: history[i - 1].symbol,
                                        year: history[i - 1].year,
                                        month_int: history[i - 1].month_int,
                                        month_str: history[i - 1].month_str,
                                        date: history[i - 1].date,
                                        interest_rate: history[i - 1].interest_rate,
                                        interest_rate_change: history[i - 1].interest_rate_change,
                                        interest_rate_change_percentage: history[i - 1].interest_rate_change_percentage
                                    }, function (err, results) {
                                        // console.log(err,"<<");
                                    });

                                }
                            }
                        }
                        else {
                            if (i === 0) {

                            }
                            else {

                                if (moment(history[i - 1].date,'X').isoWeek() !== moment(entity.date,'X').isoWeek() && history[i - 1].symbol === entity.symbol) {
                                    console.log(i);
                                    db.get().collection('currencyWeeklyCollection').insert({
                                        symbol: history[i - 1].symbol,
                                        year: history[i - 1].year,
                                        week: moment(history[i - 1].date,'X').isoWeek(),
                                        date: history[i - 1].date,
                                        interest_rate: history[i - 1].interest_rate,
                                        interest_rate_change: history[i - 1].interest_rate_change,
                                        interest_rate_change_percentage: history[i - 1].interest_rate_change_percentage
                                    }, function (err, results) {
                                        // console.log(err,"<<");
                                    });

                                }
                            }
                        }

                    });
                });



                // console.log(arr.length);

                // fs.writeFile('dailyCurrency Data.json', JSON.stringify(json), 'utf8', function (err) {
                //     console.log(err);
                // });

            });
        };
    });
};
