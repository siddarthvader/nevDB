var yahooFinance = require('yahoo-finance');

exports.get = () => {
     yahooFinance.historical({
         symbol:'CT',
         from:"1986-01-01",
         to:"2016-01-01",
         period:'d'
     },function(err,quotes){
        console.log(quotes);
     });   
    
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