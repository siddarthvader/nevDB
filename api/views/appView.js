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
                            data[currentIndex][val.week][val.symbol].sum_of_rates = 0;
                        }

                        data[currentIndex][val.week][val.symbol].sum += val.interest_rate_change_percentage;
                        data[currentIndex][val.week][val.symbol].count++;
                        data[currentIndex][val.week][val.symbol].sum_of_rates += val.interest_rate;

                        if (val.interest_rate_change_percentage >= 0) {
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
                            data[currentIndex][val.month_int][val.symbol].positiveCount = 0;
                            data[currentIndex][val.month_int][val.symbol].negativeCount = 0;
                            data[currentIndex][val.month_int][val.symbol].sum_of_rates = 0;
                        }


                        data[currentIndex][val.month_int][val.symbol].count++;
                        data[currentIndex][val.month_int][val.symbol].sum += val.interest_rate_change_percentage;
                        data[currentIndex][val.month_int][val.symbol].sum_of_rates += val.interest_rate;
                        if (val.interest_rate_change_percentage >= 0) {
                            data[currentIndex][val.month_int][val.symbol].positiveCount++;
                        }
                        else {
                            data[currentIndex][val.month_int][val.symbol].negativeCount++;
                        }
                    }
                }
            }

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
                                        if (data[i][j][element].sum_of_rates / data[i][j][element].count < body.minValChange) {
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

exports.sendEquitiesData = (req, res, body, results) => {

    var modified = {
        'weekly': {},
        'monthly': {}
    };
    var refined = {};
    var response = {};
    var data = {};
    var frequeny = ['weekly', 'monthly'];
    var currentYear = moment().year() - 1;
    results.datatable.data.forEach(function (dataset, i) {
        // console.log(i);
        var rate_change = 0;
        var rate_change_percentage = 0;
        var thisDate = moment(dataset[1], 'YYYY-MM-DD');
        var isoYear = thisDate.year();
        var year = thisDate.isoWeekYear();
        var week = thisDate.isoWeek();
        var month = thisDate.month() + 1;
        results.datatable.data[i].push(year);
        results.datatable.data[i].push(week);
        results.datatable.data[i].push(month);
        if (i == 0) {
            last_week_rate = 0;
            results.datatable.data[i].push(rate_change);
            results.datatable.data[i].push(rate_change_percentage);

        }
        else {
            rate_change = dataset[2] - results.datatable.data[i - 1][2];
            rate_change_percentage = 100 * (rate_change / results.datatable.data[i - 1][2]);
            rate_change = Math.round(rate_change * 10000) / 10000;
            rate_change_percentage = Math.round(rate_change_percentage * 10000) / 10000

            results.datatable.data[i].push(rate_change);
            results.datatable.data[i].push(rate_change_percentage);


            if (moment(results.datatable.data[i - 1][1], 'YYYY-MM-DD').isoWeek() != thisDate.isoWeek() && results.datatable.data[i - 1][0] === dataset[0]) {
                last_week_rate = results.datatable.data[i - 1][2];

                if (!modified.weekly[results.datatable.data[i - 1][4]]) {
                    modified.weekly[results.datatable.data[i - 1][4]] = {};
                }
                if (!modified.weekly[results.datatable.data[i - 1][4]]) {
                    modified.weekly[results.datatable.data[i - 1][4]] = {};
                }

                if (!modified.weekly[results.datatable.data[i - 1][4]][results.datatable.data[i - 1][5]]) {
                    modified.weekly[results.datatable.data[i - 1][4]][results.datatable.data[i - 1][5]] = {};
                }

                if (!modified.weekly[results.datatable.data[i - 1][4]][results.datatable.data[i - 1][5]][results.datatable.data[i - 1][0]]) {
                    modified.weekly[results.datatable.data[i - 1][4]][results.datatable.data[i - 1][5]][results.datatable.data[i - 1][0]] = {}
                }

                modified.weekly[results.datatable.data[i - 1][4]][results.datatable.data[i - 1][5]][results.datatable.data[i - 1][0]] = {
                    date: moment(results.datatable.data[i - 1][1], 'YYYY-MM-DD').unix(),
                    ticker: results.datatable.data[i - 1][0],
                    interest_rate: results.datatable.data[i - 1][2],
                    interest_rate_change: results.datatable.data[i - 1][7],
                    interest_rate_change_percentage: results.datatable.data[i - 1][8],
                    week: results.datatable.data[i - 1][5],
                    volume: results.datatable.data[i - 1][3],
                    ticker: results.datatable.data[i-1][0]
                };
            }


            // console.log(results.datatable.data[i - 1][3],"<<<<<<<<<<<<,,");
            if (moment(results.datatable.data[i - 1][1], 'YYYY-MM-DD').month() != thisDate.month() && results.datatable.data[i - 1][0] === dataset[0]) {
                if (!modified.monthly[results.datatable.data[i - 1][4]]) {
                    modified.monthly[results.datatable.data[i - 1][4]] = {};
                }
                if (!modified.monthly[results.datatable.data[i - 1][4]]) {
                    modified.monthly[results.datatable.data[i - 1][4]] = {};
                }

                if (!modified.monthly[results.datatable.data[i - 1][4]][results.datatable.data[i - 1][6]]) {
                    modified.monthly[results.datatable.data[i - 1][4]][results.datatable.data[i - 1][6]] = {};
                }

                if (!modified.monthly[results.datatable.data[i - 1][4]][results.datatable.data[i - 1][6]][results.datatable.data[i - 1][0]]) {
                    modified.monthly[results.datatable.data[i - 1][4]][results.datatable.data[i - 1][6]][results.datatable.data[i - 1][0]] = {}
                }

                modified.monthly[results.datatable.data[i - 1][4]][results.datatable.data[i - 1][6]][results.datatable.data[i - 1][0]] = {
                    date: moment(results.datatable.data[i - 1][1], 'YYYY-MM-DD').unix(),
                    ticker: results.datatable.data[i - 1][0],
                    interest_rate: results.datatable.data[i - 1][2],
                    interest_rate_change: results.datatable.data[i - 1][7],
                    interest_rate_change_percentage: results.datatable.data[i - 1][8],
                    month: results.datatable.data[i - 1][6],
                    volume: results.datatable.data[i - 1][3],
                    ticker:results.datatable.data[i-1][0]
                };
            }

        }
        //  [0]- ticker
        //  [1]- date
        //  [2] close value
        //  [3] volume
        //  [4]- year
        //  [5] - week
        //  [6] month
        //  [7] - rate change
        //  [8] - percentage rate change


    });

    var finalDataSet = {};

    ['weekly', 'monthly'].forEach((freq) => {
        for (year in modified[freq]) {

            if (!refined[freq]) {
                refined[freq] = {};
            }

            if (modified[freq].hasOwnProperty(year)) {
                for (i in modified[freq][year]) {
                    if (modified[freq][year].hasOwnProperty(i)) {
                        for (j in modified[freq][year][i]) {
                            if (modified[freq][year][i].hasOwnProperty(j)) {
                                // console.log(modified[freq][year][i][j]);
                                for (k = 1; k <= 6; k++) {
                                    var currentIndex = currentYear - k * 5;

                                    if (year > currentIndex) {
                                        if (!refined[freq][currentIndex]) {
                                            refined[freq][currentIndex] = {};
                                        }

                                        if (!refined[freq][currentIndex][i]) {
                                            refined[freq][currentIndex][i] = {};
                                        }
                                        if (!refined[freq][currentIndex][i][j]) {
                                            refined[freq][currentIndex][i][j] = {};
                                            refined[freq][currentIndex][i][j].sum = 0;
                                            refined[freq][currentIndex][i][j].count = 0;
                                            refined[freq][currentIndex][i][j].positiveCount = 0;
                                            refined[freq][currentIndex][i][j].negativeCount = 0;
                                            refined[freq][currentIndex][i][j].sum_of_rates = 0;
                                            refined[freq][currentIndex][i][j].sum_of_volume = 0;
                                        }
                                        refined[freq][currentIndex][i][j].sum += modified[freq][year][i][j].interest_rate_change_percentage;
                                        refined[freq][currentIndex][i][j].count++;
                                        refined[freq][currentIndex][i][j].sum_of_rates += modified[freq][year][i][j].interest_rate
                                        refined[freq][currentIndex][i][j].sum_of_volume += modified[freq][year][i][j].volume;
                                        if (modified[freq][year][i][j].interest_rate_change_percentage >= 0) {
                                            refined[freq][currentIndex][i][j].positiveCount++;
                                        }
                                        else {
                                            refined[freq][currentIndex][i][j].negativeCount++
                                        }
                                    }


                                    // console.log(modified[freq][year][i][j],"----");

                                }

                            }
                        }
                    }
                }
            }
        }

        for (year in refined[freq]) {

            if (!finalDataSet[freq]) {
                finalDataSet[freq] = {};
            }

            if (refined[freq].hasOwnProperty(year)) {
                for (i in refined[freq][year]) {
                    if (refined[freq][year].hasOwnProperty(i)) {
                        for (j in refined[freq][year][i]) {
                            if (refined[freq][year][i].hasOwnProperty(j)) {
                                // console.log(refined[freq][year][i][j]);
                                for (k = 1; k <= 6; k++) {
                                    var currentIndex = currentYear - k * 5;
                                    if(year>currentIndex){

                                    if (refined[freq][currentIndex][i][j]) {
                                        if (refined[freq][currentIndex][i][j].sum > 0) {
                                            refined[freq][currentIndex][i][j].type = 'long';
                                            refined[freq][currentIndex][i][j].reliabality = Math.round(10000 * refined[freq][currentIndex][i][j].positiveCount / refined[freq][currentIndex][i][j].count) / 100;

                                        }
                                        else {
                                            refined[freq][currentIndex][i][j].type = 'short';
                                            refined[freq][currentIndex][i][j].reliabality = Math.round(10000 * refined[freq][currentIndex][i][j].negativeCount / refined[freq][currentIndex][i][j].count) / 100;
                                        }
                                        refined[freq][currentIndex][i][j].type.sum = Math.round(refined[freq][currentIndex][i][j].type * 10000) / 10000;
                                        if (!finalDataSet[freq]) {
                                            finalDataSet[freq] = {};
                                        }
                                        if (!finalDataSet[freq][currentIndex]) {
                                            finalDataSet[freq][currentIndex] = {};
                                        }

                                        if (!finalDataSet[freq][currentIndex][refined[freq][currentIndex][i][j].type]) {
                                            finalDataSet[freq][currentIndex][refined[freq][currentIndex][i][j].type] = {};
                                        }

                                        if (!finalDataSet[freq][currentIndex][refined[freq][currentIndex][i][j].type][i]) {
                                            finalDataSet[freq][currentIndex][refined[freq][currentIndex][i][j].type][i] = {};
                                        }
                                        if (!finalDataSet[freq][currentIndex][refined[freq][currentIndex][i][j].type][i][j]) {
                                            finalDataSet[freq][currentIndex][refined[freq][currentIndex][i][j].type][i][j] = {};
                                        }




                                        var flag = {
                                            prob: true,
                                            per: true,
                                            val: true,
                                            vol: true,
                                            cap: true
                                        }

                                        if (body.minProb) {
                                            if (refined[freq][currentIndex][i][j].reliabality < body.minProb) {
                                                flag.prob = false;
                                            }
                                        }

                                        if (body.minPer) {
                                            if (refined[freq][currentIndex][i][j].sum / refined[freq][currentIndex][i][j].count < body.minPer) {
                                                flag.per = false;
                                            }
                                        }


                                        if (body.minValChange) {
                                            if (refined[freq][currentIndex][i][j].sum_of_rates / refined[freq][currentIndex][i][j].count < body.minValChange) {
                                                flag.val = false;
                                            }
                                        }


                                        if (body.volume) {
                                            if (refined[freq][currentIndex][i][j].sum_of_volume / refined[freq][currentIndex][i][j].count < body.volume) {
                                                flag.vol = false;
                                                console.log('here');
                                            }
                                        }

                                        console.log(refined[freq][currentIndex][i][j].sum_of_volume / refined[freq][currentIndex][i][j].count, "00-----")

                                        if (body.cap) {
                                            if (refined[freq][currentIndex][i][j].sum_of_cap / refined[freq][currentIndex][i][j].count < body.cap) {
                                                flag.cap = false;
                                            }
                                        }



                                        if (flag.per && flag.prob && flag.val && flag.vol && flag.cap) {

                                            finalDataSet[freq][currentIndex][refined[freq][currentIndex][i][j].type][i][j] = refined[freq][currentIndex][i][j];

                                        }
                                        else {
                                            delete finalDataSet[freq][currentIndex][refined[freq][currentIndex][i][j].type][i][j];
                                        }
                                    }


                                    }


                                }

                            }
                        }
                    }
                }
            }
        }
    });


    let responseObj = {
        message: 'success',
        status: 200,
        data: finalDataSet

    };
    writeHead(res, responseObj, 200, 'text/html');
}


exports.sendFuturesData = (req, res, results) => {

    let responseObj = {
        message: 'success',
        status: 200,
        data: results
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
