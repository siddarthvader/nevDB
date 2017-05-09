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
    req.on('data', (data) => {
        body += data;
    });

    req.on('end', function () {
        userModel.getUserByEmailId(JSON.parse(body), (emailRes) => {
            console.log(emailRes,'emailRes');
            if (emailRes) {
                userView.sendLoginDataToClient(req, res,emailRes);
            }
            else {
                userView.sendLoginDataToClient(req, res, {});
            }


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
        userModel.validatePasswordUsingEmail(JSON.parse(body), function (pwdRes) {
            // console.log(pwdRes,"pwdRes");
            if (pwdRes) {
                userModel.generateJWT(pwdRes, (encryptedData) => {
                    userView.sendPwdVerificationToClient(req, res, encryptedData);
                })
            }
            else{
                userView.sendPwdVerificationToClient(req, res, {});
            }
            
        })
        // console.log(typeof body);

    })

};