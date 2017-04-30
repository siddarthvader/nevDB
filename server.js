var http_IP = '127.0.0.1'
port = process.env.PORT || 3000;
var http=require("http");
var login = require('./api/controllers/loginController.js');


var server=http.createServer((req,res)=>{

	res.setHeader('Access-Control-Allow-Origin', '*');
	res.setHeader('Access-Control-Request-Method', '*');
	res.setHeader('Access-Control-Allow-Methods', 'OPTIONS, GET');
	res.setHeader('Access-Control-Allow-Headers', "Origin, X-Requested-With, Content-Type, Accept");

    require('./api/router/router.js').get(req,res);
});

server.listen(port,http_IP);
console.log("listening nice");

// app = express(),
//     app.use((req, res, next) => {
//         // allow all origins
//         res.setHeader('Access-Control-Allow-Origin', "*");
//         // Request methods you wish to allow
//         res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE');
//         // Request headers you wish to allow
//         res.setHeader('Access-Control-Allow-Headers', "Origin, X-Requested-With, Content-Type, Accept");
//         // Set to true if you need the website to include cookies in the requests sent
//         // to the API (e.g. in case you use sessions)
//         res.setHeader('Access-Control-Allow-Credentials', true);


//         console.log('res');

//         // Pass to next layer of middleware
//         next();
//     });

// console.log(login.email);

// app.post('/email', login.email);

// app.post('/pwd', login.password);

// app.listen(port, () => {
//     console.log('keep listening');
// });