var fetch=require('./fetchCurrencyDataFromOFX.js');
var ofx=require('./fetchOfx.js')

var init=()=>{
    // fetch.storeIntoDb();
    // fetch.weeklyTablePrepare();
    // fetch.monthlyTablePrepare();
    ofx.get();
}   

init();