var jwt = require('jsonwebtoken');

var token="eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJlbWFpbCI6Im5ldkBnbWFpbC5jb20iLCJyb2xlIjoiYWRtaW4iLCJpYXQiOjE0OTQ0MDU3NTMsImV4cCI6MTQ5NDQwNTgxM30.om6h9dIdZ5RxdlLku64fNFLLbIBHhKyEweDVuh8Q9c8";
jwt.verify(token,'nelson',function(a,b){
    //console.log(a,"a");
    //console.log(b,"b");
})