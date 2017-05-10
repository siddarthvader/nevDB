var http_IP = '127.0.0.1'
port = process.env.PORT || 3000;
var http = require("http");
var login = require('./api/controllers/loginController.js');
var url = 'mongodb://localhost:27017/nevDb?authMechanism=DEFAULT&authSource=db';
var auth = {
	user: 'nevRoot',
	pwd: 'nevRoot'
};
var db = require('./api/db');

var server = http.createServer((req, res) => {

	res.setHeader('Access-Control-Allow-Origin', '*');
	res.setHeader('Access-Control-Request-Method', '*');
	res.setHeader('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE,PATCH,OPTIONS');
	res.setHeader('Access-Control-Allow-Headers', "Origin, X-Requested-With, Content-Type, Accept, Token");
	res.setHeader('Content-Type', 'application/json');
	console.log('hit');
	require('./api/router/router.js').get(req, res);
});


db.connect(url, auth, (err) => {
	if (err) {
		console.log('unable to connect to mongo');
	}
	else {
		server.listen(port, http_IP);
		console.log("listening nice");
	}
});
