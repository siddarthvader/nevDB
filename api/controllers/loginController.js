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

    let body = '';
    req.on('data', function (data) {
        body += data;
    });

    req.on('end', function () {
        userModel.getUserByEmailId(JSON.parse(body), function (emailRes) {
            userView.sendLoginDataToClient(req, res, emailRes);
        })
        console.log(typeof body);

    })

};

var password = (req, res) => {
    console.log('here for pwd');
   
    let body = '';
    req.on('data', function (data) {
        body += data;
    });

    req.on('end', function () {
        userModel.validatePasswordUsingEmail(JSON.parse(body), function (emailRes) {
            userView.sendPwdVerificationToClient(req, res, emailRes);
        })
        console.log(typeof body);

    })

};