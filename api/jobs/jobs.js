var fetch=require('./fetchCurrencyDataFromOFX.js');
var ofx=require('./fetchOfx.js')
var equities=require('./equities.js');
var init=()=>{
    // fetch.storeIntoDb();
    // fetch.weeklyTablePrepare();
    // fetch.monthlyTablePrepare();
    // ofx.get();
    // equities.get();
    ofx.setMonthlyData();
}   

init();