var url = require('url');
exports.get = (req, res) => {

    if (req.method === 'OPTIONS') {
        console.log('!OPTIONS');
        var headers = {};
        // IE8 does not allow domains to be specified, just the *
        // headers["Access-Control-Allow-Origin"] = req.headers.origin;
        headers["Access-Control-Allow-Origin"] = "*";
        headers["Access-Control-Allow-Methods"] = "POST, GET, PUT, DELETE, OPTIONS";
        headers["Access-Control-Allow-Credentials"] = false;
        headers["Access-Control-Max-Age"] = '86400'; // 24 hours
        headers["Access-Control-Allow-Headers"] = "X-Requested-With, X-HTTP-Method-Override, Content-Type, Accept";
        res.writeHead(200, headers);
        res.end()
    }
    else {
        req.requrl = url.parse(req.url, true);
        var path = req.requrl.pathname;
        console.log(path, "dsds");
        switch (path) {
            case '/email':
            case '/pwd':
                require('../controllers/loginController.js').get(req, res, path);
                break;
            default:
                require('../controllers/notFound.js').get(req, res, path);
                break;

        }
    }
}