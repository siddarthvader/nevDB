var csv = require('fast-csv');
var fs = require('fs');
var request = require('request');
var tickers = require('./equitiesTicker.json');
var sectorData = require('./sectorList.json');
var industryData=require('./industryList.json');
exports.get = () => {

    var stream = fs.createReadStream('./../docs/secwiki_tickers.csv');

    var csvStream = csv()
        .on("data", function (data) {
            console.log(data[0], "<<<");
        })
        .on("end", function () {
            console.log("done");
        });

    stream.pipe(csvStream);
    var symbol = "AAPL";
    var url = "https://www.quandl.com/api/v3/datatables/ZACKS/P.json?qopts.columns=ticker,date,close&ticker=" + symbol + "&date.gte=1986-01-01&date.lt=2016-12-31&api_key=xL_9oFs5gTigbat_D6RH";

};

exports.setSectors = () => {
    console.log(tickers.data);
    var sectors = {};
    var industry = {};
    tickers.data.forEach(function (f, i) {
        // console.log(f, i, "<<");
        if (f.Sector) {
            if (!sectors[f.Sector]) {
                sectors[f.Sector] = [];
            }
            sectors[f.Sector].push(f);
        }

        if (f.Industry) {
            if (!industry[f.Industry]) {
                industry[f.Industry] = [];
            }
            industry[f.Industry].push(f);
        }
    });

    // fs.writeFile('sectorList.json', JSON.stringify(sectors), 'utf8', function (err) {
    //     console.log(err);
    // });

    fs.writeFile('industryList.json', JSON.stringify(industry), 'utf8', function (err) {
        console.log(err);
    });

};

exports.prepareSectorArray = () => {
    var sectors = [];
    for (key in sectorData) {
        console.log(key);
        console.log(sectorData[key]);
        var dum = {
            Sector: key,
            TickerData: sectorData[key]
        }
        sectors.push(dum);
    }

    fs.writeFile('sectorData.json', JSON.stringify({data:sectors}), 'utf8', function (err) {
        console.log(err);
    });
};

exports.prepareIndustryArray = () => {
    var sectors = [];
    for (key in industryData) {
        console.log(key);
        console.log(industryData[key]);
        var dum = {
            Sector: key,
            TickerData: industryData[key]
        }
        sectors.push(dum);
    }

    fs.writeFile('industryData.json', JSON.stringify({data:sectors}), 'utf8', function (err) {
        console.log(err);
    });
};