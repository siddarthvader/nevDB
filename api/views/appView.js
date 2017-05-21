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
    console.log(currentYear);

    console.log('here');

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
                        }

                        data[currentIndex][val.week][val.symbol].sum += val.change;
                        data[currentIndex][val.week][val.symbol].count++;
                        if (val.change >= 0) {
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
                        }

                        data[currentIndex][val.month_int][val.symbol].sum += val.change;
                        data[currentIndex][val.month_int][val.symbol].count++;
                        if (val.change >= 0) {
                            data[currentIndex][val.month_int][val.symbol].positiveCount++;
                        }
                        else {
                            data[currentIndex][val.month_int][val.symbol].negativeCount++;
                        }
                    }
                }
            }

            console.log(val.month_int, "month int");
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
                                    refined[i][data[i][j][element].type][j][element] = data[i][j][element];
                                }
                            }

                        });
                    }

                };
            }
        }

        console.log(freq);
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
