var url = require('url');
exports.get = (req, res) => {
    req.requrl = url.parse(req.url, true);
    var path = req.requrl.pathname;
    console.log(path,"dsds");
    switch (path) {
        case '/email':
        case '/pwd':
            require('../controllers/loginController.js').get(req,res,path);
            break;
        default:
            require('../controllers/notFound.js').get(req,res,path);
            break;

    }
}