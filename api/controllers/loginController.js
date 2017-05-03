var userModel = require('./../models/userCollecton.js');
var userView = require('./../views/userView.js');


exports.get = (req, res, path) => {
    switch (path) {
        case '/email':
            email(req, res);
            break;
        case '/pwd':
            password(req, res);
            break
        default:
            break;
    }
}

var mongo = require('mongodb');

var email = (req, res) => {
    console.log('here for email');
    // console.log(req.body);
    // userModel.getUserByMailId()

    var body = '';
    req.on('data', function (data) {
        body += data;
    });

    req.on('end', function () {
        userModel.getUserByEmailId(JSON.parse(body), function (emailRes) {
            var responseObj = {
                message: 'success',
                status: 200,
                data: {
                    state: 'goToPwd',
                    found:emailRes
                }
            };
            res.writeHead(200, {
                'Content-Type': 'text/html'
            });
            res.write(JSON.stringify(responseObj));
            res.end();
        })
        console.log(typeof body);

    })

};

var password = (req, res) => {
    console.log('here for password');
    var responseObj = {
        message: 'success',
        status: 200,
        data: {
            state: 'goToGetin'
        }
    };

    res.writeHead(200, {
        'Content-Type': 'text/html'
    });
    res.write(JSON.stringify(responseObj));
    res.end();

};