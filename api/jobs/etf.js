var yahooFinance = require('yahoo-finance');

exports.get = () => {
    
    
    // This replaces the deprecated snapshot() API
    yahooFinance.quote({
        symbol: 'JPHY   ',
        modules: ['price', 'summaryDetail'] // see the docs for the full list
    }, function (err, quotes) {
        // ...
        // console.log(err, "<<<");
        // console.log(quotes, 'quotes');
    });
};