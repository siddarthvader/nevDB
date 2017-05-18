var request = require('request');
var http=require('http');

var csvData = '';
var url='http://query1.finance.yahoo.com/v7/finance/download/AAPL?period1=345407400&period2=1495045800&interval=1d&events=history&crumb=bAeOkkBgI4X';
var request = http.get(url, function (response) {
    response.on('data', function (chunk) {
        csvData += chunk;
    });
    response.on('end', function () {
        // prints the full CSV file
        console.log(csvData);
    });
});