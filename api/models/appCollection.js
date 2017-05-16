var request = require('request');
var cheerio = require('cheerio');
exports.scrapeEPSFromZacks = (body, done) => {
    console.log(body, "body");
    request('https://widget3.zacks.com/data/chart/json/'+body.symbol+'/price_and_eps_estimates_consensus/www.zacks.com', function (err, response, body) {
        done(body);
    });
};


var scrape = () => {
    request('https://www.zacks.com/stock/chart/AAPL/price-consensus-eps-surprise-chart#chart_canvas', {
        withDomLvl1: true,
        normalizeWhitespace: false,
        xmlMode: false,
        decodeEntities: true
    }, function (err, response, body) {
        var $ = cheerio.load(body);
        var a = $('#chart_canvas').find('svg');
        console.log(a.html());
    });
};

var scrapReddit = function () {
    request("https://www.zacks.com/stock/chart/AAPL/price-consensus-eps-surprise-chart#chart_canvas", function (error, response, body) {
        if (error) {
            console.log("Error: " + error);
        }
        console.log("Status code: " + response.statusCode);

        var $ = cheerio.load(body);

        $('div').each(function (index) {
            console.log("User: " + $(this).html());
        });

    });
}