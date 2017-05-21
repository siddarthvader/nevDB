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
    var data = {};
    var response = {};
    // console.log(body);

    var frequeny = ['weekly', 'monthly'];

    console.log('here');

    frequeny.forEach((freq) => {
        console.log(freq, "freq");
        var data = {};
        
        results[freq].forEach(function (val, index) {
            console.log(freq, "freq");
            var currentYear = moment().year() - 1;
            // for 5 years
            // going upto 5*6=30 years
            for (i = 1; i <= 6; i++) {
                var currentIndex=currentYear - i * 5;
                if (val.year > currentIndex) {

                    if (!data[currentIndex]) {
                        data[currentIndex] = {};
                    }
                    if (!data[currentIndex][val.symbol]) {
                        data[currentIndex][val.symbol] = {};
                    }
                    if (!data[currentIndex][val.symbol][val.week]) {
                        if (freq === 'weekly') {
                            data[currentIndex][val.symbol][val.week] = {}
                            data[currentIndex][val.symbol][val.week].sum = 0;
                            data[currentIndex][val.symbol][val.week].count = 0;
                            data[currentIndex][val.symbol][val.week].positiveCount = 0;
                            data[currentIndex][val.symbol][val.week].negativeCount = 0;
                        }
                        else {
                            data[currentIndex][val.symbol][val.month_int] = {}
                            data[currentIndex][val.symbol][val.month_int].sum = 0;
                            data[currentIndex][val.symbol][val.month_int].count = 0;
                            data[currentIndex][val.symbol][val.month_int].positiveCount = 0;
                            data[currentIndex][val.symbol][val.month_int].negativeCount = 0;
                        }
                    }

                    if (freq === 'weekly') {
                        data[currentIndex][val.symbol][val.week].sum += val.change;
                        data[currentIndex][val.symbol][val.week].count++;
                        if (val.change >= 0) {
                            data[currentIndex][val.symbol][val.week].positiveCount++;
                        }
                        else {
                            data[currentIndex][val.symbol][val.week].negativeCount++;
                        }
                    }
                    else {
                        data[currentIndex][val.symbol][val.month_int].sum += val.change;
                        data[currentIndex][val.symbol][val.month_int].count++;
                        if (val.change >= 0) {
                            data[currentIndex][val.symbol][val.month_int].positiveCount++;
                        }
                        else {
                            data[currentIndex][val.symbol][val.month_int].negativeCount++;
                        }
                    }
                }
            }
        });

        for (i in data) {
            console.log(i);
            body.symbols.forEach((element) => {
                for (j in data[i][element]) {
                    if (data[i][element][j].sum >= 0) {
                        data[i][element][j].reliabality = parseInt((data[i][element][j].positiveCount / data[i][element][j].count) * 100);
                        data[i][element][j].type = 'long';
                    }
                    else {
                        data[i][element][j].reliabality = parseInt((data[i][element][j].negativeCount / data[i][element][j].count) * 100);
                        data[i][element][j].type = 'short';
                    }
                };
            });
        }


        console.log(freq);
        response[freq] = data;
    });

    let responseObj = {
        message: 'success',
        status: 200,
        data: {
            data: response
        }
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
