var express = require('express');
var app = express();

var login=require('./api/controllers/loginController.js');
app = express(),
    port = process.env.PORT || 3000;
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

console.log(login.email);

app.post('/email', login.email);

app.post('/pwd',login.password);

app.listen(port, () => {
    console.log('keep listening');
});