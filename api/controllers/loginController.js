var model = require('./../models/userCollecton.js');
var model = require('./../views/userView.js');


exports.get = (req, res, path) => {
    switch (path) {
        case '/email':
            email(req,res);
            break;
        case '/pwd':
            password(req,res);
            break
        default:
            break;
    }

    res.end();
}

var mongo = require('mongodb');

var email = (req,res) => {
    console.log('here for email');
    var responseObj = {
        message: 'success',
        status: 200,
        data: {
            state: 'goToPwd'
        }
    };
    res.writeHead(200, {
        'Content-Type': 'text/html'
    });
    console.log('er');
    res.write(JSON.stringify(responseObj));
    res.end();
};

var password = (req,res) => {
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