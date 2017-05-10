var db = require('./../db');
var jwt = require('jsonwebtoken');
var moment = require('moment');
var ua = require('ua-parser');

exports.getUserByEmailId = (body, done) => {
    db.get().collection('loginCollection').findOne(
        {
            email: body.email
        },
        {
            email: 1
        },
        (err, results) => {
            console.log(results, "results");
            done(results);
        })
};

exports.validatePasswordUsingEmail = (body, done) => {
    console.log(body, 'pwd body');
    db.get().collection('loginCollection').findOne(
        {
            email: body.email,
            password: body.pwd
        },
        {
            password: 0
        },
        (err, results) => {
            console.log(results, 'pwd results');
            done(results);
        });
};

exports.generateJWT = (pwdRes, done) => {
    // console.log(pwdRes, 'generate jwt');
    let token = jwt.sign(
        {

            _id: pwdRes._id,
            email: pwdRes.email,
            role: pwdRes.role
        }
        , 'nelson', { expiresIn: '10d' });

    pwdRes.token = token;
    done(pwdRes);
}

exports.verifyJWT = (body, headers, done) => {
    console.log("inside model verifyJWT", headers.token);

    jwt.verify(headers.token, 'nelson', { email: body.email }, (err, decoded) => {
        console.log("decodedTOken", err);
        if (err) {
            done(false);
        }
        else {
            done(true);
        }

    })
}

exports.insertTokenToDb = (data, user_agent, done) => {
    console.log(user_agent, "user_agent");
    let uaparsed = ua.parse(user_agent);
    db.get().collection('loginCollection').update(
        {
            email: data.email
        },
        {
            $push:
            {
                history: {
                    created_on: moment().unix(),
                    destroyed_on: null,
                    is_alive: true,
                    device: {
                        browser: uaparsed.ua.toString(),
                        OS: uaparsed.os.toString()
                    },
                    jwt: data.token
                }
            }
        }, (err, results) => {
            done();
        }
    )
};

exports.destroySession = (req, res, done) => {
    db.get().collection('loginCollection').update(
        {
            email: "nev@gmail.com",
            "history.jwt": req.headers.token
        }, {
            $set: {
                "history.$.is_alive": false
            }
        }, function (err, results) {
            console.log(err, results);
            if (!err) {
                done(true);
            }
            else{
                done(false);
            }
        });
}
