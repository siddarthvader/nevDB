var fetch=require('./fetchCurrencyDataFromOFX.js');

var init=()=>{
    // fetch.storeIntoDb();
    fetch.weeklyTablePrepare();
}   

init();