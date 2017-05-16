var url = require('url');
var userModel = require('./../models/userCollecton.js');
exports.get = (req, res) => {
    var headers = {};

    if (req.method === 'OPTIONS') {
        //console.log('!OPTIONS');
        // IE8 does not allow domains to be specified, just the *
        // headers["Access-Control-Allow-Origin"] = req.headers.origin;
        res.end()
    }
    else {
        req.requrl = url.parse(req.url, true);
        var path = req.requrl.pathname;
        console.log(req.headers.token, 'headers', path);
        validateHeaders(req, path, function (results) {
            if (results) {
                console.log('headers validated yead');
                switch (path + '_' + req.method) {
                    case ('/email_POST'):
                    case '/pwd_POST':
                    case '/validateToken_POST':
                    case '/logout_POST':
                        require('../controllers/loginController.js').get(req, res, path);
                        break;
                    case '/inviteUser_POST':
                    case '/getUsers_GET':
                    case '/removeUser_POST':
                    case '/history_POST':
                        require('../controllers/userController.js').get(req, res, path);
                        break;

                    case '/scrapeZacksForEPS_POST':
                        require('../controllers/appController.js').get(req,res,path);
                        break;
                    default:
                        require('../controllers/notFoundController.js').get(req, res);
                        break;

                }

            }
            else {
                require('../controllers/notFoundController.js').get(req, res);

            }

        })

    }
};

var validateHeaders = (req, path,done) => {
    if (['/email', '/pwd'].indexOf(path) > -1) {
        done(true);
    }
    else {
        userModel.verifyJWTAlone(req.headers.token, function (results) {
            console.log(results, "jwtverifyalone");
            if (results === true) {
                console.log("returning true");
                done(true);
            }
            else {
                done(false);
            }
        });
    }
}