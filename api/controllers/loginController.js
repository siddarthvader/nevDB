var userModel = require('./../models/userCollecton.js');
var userView = require('./../views/userView.js');

exports.get = (req, res, path) => {
    console.log(path, "path");
    switch (path) {
        case '/email':
            email(req, res);
            break;
        case '/pwd':
            password(req, res);
            break;
        case '/validateToken':
            validateToken(req, res);
            break;
        case '/logout':
            logout(req, res);
            break;
        default:
            break;
    }
}


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
            console.log(emailRes, 'emailRes');
            if (emailRes) {
                userView.sendLoginDataToClient(req, res, emailRes);
            }
            else {
                userView.sendLoginDataToClient(req, res, null);
            }


        })
        console.log(typeof body);

    })

};

var password = (req, res) => {
    console.log('here for pwd');

    let body = '';
    req.on('data', (data) => {
        body += data;
    });

    req.on('end', () => {
        userModel.validatePasswordUsingEmail(JSON.parse(body), function (pwdRes) {
            // console.log(pwdRes,"pwdRes");
            if (pwdRes) {
                userModel.generateJWT(pwdRes, (encryptedData) => {
                    userModel.insertTokenToDb(encryptedData, req.headers['user-agent'], (err, results) => {
                        userView.sendPwdVerificationToClient(req, res, encryptedData);
                    })

                })
            }
            else {
                userView.sendPwdVerificationToClient(req, res, null);
            }

        })
        // console.log(typeof body);

    })

};

var validateToken = (req, res) => {
    console.log(typeof req.headers.token, 'validateToken in controller');
    let body = '';
    req.on('data', (data) => {
        body += data;
    });

    req.on('end', () => {
        console.log(body, 'body');
        userModel.verifyJWT(JSON.parse(body), req.headers, (valid) => {
            if (valid) {
                userView.sendValidationResToClient(req, res, valid);
            }
            else {
                userView.sendValidationResToClient(req, res, valid)
            }
        });
    })
};

var logout = (req, res) => {
    console.log('logginout');
    let body = '';
    req.on('data', (data) => {
        body += data;
    });

    req.on('end', () => {
        console.log(body, 'body');
        userModel.destroySession(req, res, function (results) {

            userView.logOutFromDevice(req, res);

        });
    })
}