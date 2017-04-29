var express = require('express');
var app = express();

app.use((req, res, next) => {
    // allow all origins
    res.setHeader('Access-Control-Allow-Origin', "*");

    // Request methods you wish to allow
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE');

    // Request headers you wish to allow
    res.setHeader('Access-Control-Allow-Headers', "Origin, X-Requested-With, Content-Type, Accept");

    // Set to true if you need the website to include cookies in the requests sent
    // to the API (e.g. in case you use sessions)
    res.setHeader('Access-Control-Allow-Credentials', true);


    console.log('res');

    // Pass to next layer of middleware
    next();
});

app.post('/email', (req, res, next) => {
    // console.log(req);
    // console.log(res);
    console.log('here');
    var responseObj={
        message:'success',
        status:200,
        data:{}
    };
    res.json(responseObj);
});

app.listen(3000, () => {
    console.log('keep listening');
});