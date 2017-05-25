var csv = require('fast-csv');
var fs = require('fs');
exports.get = () => {

    var stream = fs.createReadStream('./../docs/secwiki_tickers.csv');
    
    var csvStream = csv()
        .on("data", function (data) {
            console.log(data[0],"<<<");
        })
        .on("end", function () {
            console.log("done");
        });

    stream.pipe(csvStream);
    var symbol="AAPL";
    var url="https://www.quandl.com/api/v3/datatables/ZACKS/P.json?qopts.columns=ticker,date,close&ticker="+symbol+"&date.gte=1986-01-01&date.lt=2016-12-31&api_key=xL_9oFs5gTigbat_D6RH";

};