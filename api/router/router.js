var url = require('url');
exports.get = (req, res) => {
    var headers = {};

    if (req.method === 'OPTIONS') {
        console.log('!OPTIONS');
        // IE8 does not allow domains to be specified, just the *
        // headers["Access-Control-Allow-Origin"] = req.headers.origin;
        res.end()
    }
    else {
        req.requrl = url.parse(req.url, true);
        var path = req.requrl.pathname;
        console.log(path, req.method, "dsds");
        switch (path + '_' + req.method) {
            case ('/email_POST'):
            case '/pwd_POST':
            case '/validateToken_POST':
            case '/logout_POST':
                require('../controllers/loginController.js').get(req, res, path);
                break;
            case '/inviteUser_POST':
                require('../controllers/userController.js').get(req,res,path);
                break;
            default:
                require('../controllers/notFoundController.js').get(req, res);
                break;

        }
    }
}