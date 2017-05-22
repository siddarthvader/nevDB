var moment = require('moment');

exports.sendEPStoClient = (req, res, html) => {

    let responseObj = {
        message: 'success',
        status: 200,
        data: {
            html: JSON.parse(html)
        }
    };
    writeHead(res, responseObj, 200, 'text/html');
}

exports.sendCurrencyData = (req, res, body, results) => {
    var response = {};
    // console.log(body);

    var frequeny = ['weekly', 'monthly'];
    var currentYear = moment().year() - 1;
    // console.log(currentYear);

    console.log('here', body);

    frequeny.forEach((freq) => {
        // console.log(freq, "freq");
        var data = {};
        var refined = {};

        results[freq].forEach(function (val, index) {
            // console.log(freq, "freq");
            // for 5 years
            // going upto 5*6=30 years


            for (i = 1; i <= 6; i++) {
                var currentIndex = currentYear - i * 5;
                if (val.year > currentIndex) {
                    if (!data[currentIndex]) {
                        data[currentIndex] = {};
                    }
                    if (!refined[currentIndex]) {
                        refined[currentIndex] = {};
                    }

                    if (freq === 'weekly') {
                        if (!data[currentIndex][val.week] && freq === 'weekly') {
                            data[currentIndex][val.week] = {};
                        }
                        if (!data[currentIndex][val.week][val.symbol] && freq === 'weekly') {
                            data[currentIndex][val.week][val.symbol] = {}
                            data[currentIndex][val.week][val.symbol].sum = 0;
                            data[currentIndex][val.week][val.symbol].count = 0;
                            data[currentIndex][val.week][val.symbol].positiveCount = 0;
                            data[currentIndex][val.week][val.symbol].negativeCount = 0;
                            data[currentIndex][val.week][val.symbol].date = 0;
                            data[currentIndex][val.week][val.symbol].interest_rate = 0;
                            data[currentIndex][val.week][val.symbol].interest_rate_change = 0;
                            data[currentIndex][val.week][val.symbol].interest_change_weekly = 0;
                        }

                        data[currentIndex][val.week][val.symbol].sum += val.interest_rate_change_percentage;
                        data[currentIndex][val.week][val.symbol].count++;
                        data[currentIndex][val.week][val.symbol].date = val.date;
                        data[currentIndex][val.week][val.symbol].interest_rate = val.interest_rate;
                        data[currentIndex][val.week][val.symbol].interest_rate_change = val.interest_rate_change;
                        data[currentIndex][val.week][val.symbol].interest_change_weekly = val.interest_change_weekly;

                        if (val.interest_change_percentage >= 0) {
                            data[currentIndex][val.week][val.symbol].positiveCount++;
                        }
                        else {
                            data[currentIndex][val.week][val.symbol].negativeCount++;
                        }

                    }
                    else {

                        if (!data[currentIndex][val.month_int] && freq === 'monthly') {
                            data[currentIndex][val.month_int] = {};
                        }
                        if (!data[currentIndex][val.month_int][val.symbol] && freq === 'monthly') {
                            data[currentIndex][val.month_int][val.symbol] = {}
                            data[currentIndex][val.month_int][val.symbol].sum = 0;
                            data[currentIndex][val.month_int][val.symbol].count = 0;
                            data[currentIndex][val.month_int][val.symbol].date = 0;
                            data[currentIndex][val.month_int][val.symbol].positiveCount = 0;
                            data[currentIndex][val.month_int][val.symbol].negativeCount = 0;
                            data[currentIndex][val.month_int][val.symbol].interest_change = 0;
                            data[currentIndex][val.month_int][val.symbol].interest_rate_change = 0;
                        }


                        data[currentIndex][val.month_int][val.symbol].count++;
                        data[currentIndex][val.month_int][val.symbol].interest_change = val.interest_change_percentage;
                        data[currentIndex][val.month_int][val.symbol].date = val.date;
                        data[currentIndex][val.month_int][val.symbol].sum += val.interest_rate_change_percentage;
                        data[currentIndex][val.month_int][val.symbol].interest_rate_change = val.interest_rate_change;

                        if (val.interest_change_percentage >= 0) {
                            data[currentIndex][val.month_int][val.symbol].positiveCount++;
                        }
                        else {
                            data[currentIndex][val.month_int][val.symbol].negativeCount++;
                        }
                    }
                }
            }

            // console.log(val.month_int, "month int");
        });
        for (i in data) {
            if (data.hasOwnProperty(i)) {
                for (j in data[i]) {
                    if (data[i].hasOwnProperty(j)) {
                        body.symbols.forEach((element) => {
                            // console.log(data[i][j][element], '------');
                            if (data[i][j][element]) {

                                if (data[i][j][element].sum !== undefined) {

                                    if (data[i][j][element].sum >= 0) {
                                        data[i][j][element].reliabality = parseInt((data[i][j][element].positiveCount / data[i][j][element].count) * 100);
                                        data[i][j][element].type = 'long';

                                    }
                                    else {
                                        data[i][j][element].reliabality = parseInt((data[i][j][element].negativeCount / data[i][j][element].count) * 100);
                                        data[i][j][element].type = 'short';
                                    }

                                    if (!refined[i][data[i][j][element].type]) {
                                        refined[i][data[i][j][element].type] = {};
                                    }
                                    if (!refined[i][data[i][j][element].type][j]) {
                                        refined[i][data[i][j][element].type][j] = {};
                                    }
                                    if (!refined[i][data[i][j][element].type][j][element]) {
                                        refined[i][data[i][j][element].type][j][element] = {};
                                    }

                                    var flag = {
                                        prob: true,
                                        per: true,
                                        val: true
                                    }

                                    if (body.minProb) {
                                        if (data[i][j][element].reliabality < body.minProb) {
                                            flag.prob = false;
                                        }
                                    }

                                    if (body.minPer) {
                                        if (data[i][j][element].sum / data[i][j][element].count < body.minPer) {
                                            flag.per = false;
                                        }
                                    }

                                    if (body.minValChange) {
                                        if (data[i][j][element].weeklyChange < body.minValChange) {
                                            flag.val = false;
                                        }
                                    }

                                    if (flag.per && flag.prob && flag.val) {
                                        refined[i][data[i][j][element].type][j][element] = data[i][j][element];
                                    }
                                    else {
                                        delete refined[i][data[i][j][element].type][j][element];
                                    }

                                }
                            }

                        });
                    }
                };
            }
        }

        // console.log(freq);
        response[freq] = refined;
    });

    let responseObj = {
        message: 'success',
        status: 200,
        data: response
    };
    writeHead(res, responseObj, 200, 'text/html');
}


let writeHead = (res, responseObj, status, contentType) => {
    //console.log('writing head');
    res.writeHead(status, {
        'Content-Type': contentType
    });
    if (typeof responseObj === 'string') {
        res.write(responseObj);

    }
    else {
        res.write(JSON.stringify(responseObj));
    }
    res.end();

}
