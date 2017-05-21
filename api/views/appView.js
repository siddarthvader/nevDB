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
    var response={};
    console.log(body);
    body.symbols.forEach((element) => {
        data[element] = {};
    });

    results.weekly.forEach(function (val, index) {
        var currentYear = moment().year() - 1;
        // for 5 years
        // going upto 5*6=30 years
        for (i = 1; i <= 6; i++) {
            if (val.year > currentYear - i * 5) {
                if (!data[val.symbol][currentYear - i * 5]) {
                    data[val.symbol][currentYear - i * 5] = {};
                    data[val.symbol][currentYear - i * 5][val.week] = {}
                    data[val.symbol][currentYear - i * 5][val.week].sum = 0;
                    data[val.symbol][currentYear - i * 5][val.week].count = 0;
                    data[val.symbol][currentYear - i * 5][val.week].positiveCount = 0;
                    data[val.symbol][currentYear - i * 5][val.week].negativeCount = 0;
                }
                if (!data[val.symbol][currentYear - i * 5][val.week]) {
                    data[val.symbol][currentYear - i * 5][val.week] = {};
                    data[val.symbol][currentYear - i * 5][val.week].sum = 0;
                    data[val.symbol][currentYear - i * 5][val.week].count = 0;
                    data[val.symbol][currentYear - i * 5][val.week].positiveCount = 0;
                    data[val.symbol][currentYear - i * 5][val.week].negativeCount = 0;
                }

                data[val.symbol][currentYear - i * 5][val.week].sum += val.change;
                data[val.symbol][currentYear - i * 5][val.week].count++;
                if (val.change >= 0) {
                    data[val.symbol][currentYear - i * 5][val.week].positiveCount++;
                }
                else {
                    data[val.symbol][currentYear - i * 5][val.week].negativeCount++;
                }
            }
        }

        // data.forEach((f,i)=>{

        // });
    });


    body.symbols.forEach((element) => {
        for (i in data[element]) {
            // console.log(i);
            console.log(data[element][i], "yay");
            for (j in data[element][i]) {
                if (data[element][i][j].sum >= 0) {
                    data[element][i][j].reliabality = parseInt((data[element][i][j].positiveCount / data[element][i][j].count) * 100);
                    data[element][i][j].type = 'long';
                }
                else {
                    data[element][i][j].reliabality = parseInt((data[element][i][j].negativeCount / data[element][i][j].count) * 100);
                    data[element][i][j].type = 'short';
                }
            };
        }
    });

    var response={
        weekly:data
    };
    delete data;
    
    results.monthly.forEach((val,index)=>{
        
    });

    let responseObj = {
        message: 'success',
        status: 200,
        data: {
            data:response
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
