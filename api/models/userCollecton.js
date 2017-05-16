
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
            //console.log(results, "results");
            done(results);
        })
};

exports.validatePasswordUsingEmail = (body, done) => {
    //console.log(body, 'pwd body');
    db.get().collection('loginCollection').findOne(
        {
            email: body.email,
            password: body.pwd
        },
        {
            password: 0
        },
        (err, results) => {
            //console.log(results, 'pwd results');
            done(results);
        });
};

exports.generateJWT = (pwdRes, done) => {
    // //console.log(pwdRes, 'generate jwt');
    let token = jwt.sign(
        {

            _id: pwdRes._id,
            email: pwdRes.email,
            role: pwdRes.role
        }
        , 'nelson', { expiresIn: '10d' });

    pwdRes.token = token;
    done(pwdRes);
};

exports.verifyJWT = (body, headers, done) => {
    //console.log("inside model verifyJWT", headers.token);


    jwt.verify(headers.token, 'nelson', { email: body.email }, (err, decoded) => {
        //console.log("decodedTOken", err);

        if (err) {
            done(false);
        }
        else {
            console.log(headers.token, "wow ya");
            db.get().collection('loginCollection').find(
                {
                    email: body.email
                },
                {
                    history:
                    {
                        $elemMatch:
                        {
                            jwt: headers.token
                        }

                    }
                }).toArray(function (err, results) {
                    console.log(err, "err", results[0].history[0].is_alive);
                    if (err === null && results.length && results[0].history[0].is_alive) {
                        done(true);
                    }
                    else {
                        done(false);
                    }
                });

        }

    })
};

exports.verifyJWTAlone = (headers, done) => {
    jwt.verify(headers, 'nelson', (err, decoded) => {
        console.log("decodedTOken", decoded);
        if (err) {
            done(false);
        }
        else {
            done(true);
        }

    })
};

exports.insertTokenToDb = (data, user_agent, done) => {
    //console.log(user_agent, "user_agent");
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
                "history.$.is_alive": false,
                "history.$.destroyed_on": moment().unix()

            }
        }, function (err, results) {
            //console.log(err, results);
            if (!err) {
                done(true);
            }
            else {
                done(false);
            }
        });
};

exports.addNewUserToDb = (body, done) => {
    db.get().collection('loginCollection').findOne({ email: body.email }, function (err, results) {
        //console.log(body,'adduser',results);
        if (!results) {
            let userObj = {
                "email": body.email,
                "password": body.email,
                "role": 'user',
                "is_admin": false,
                "exists": true,
                "created_on": moment().unix(),
                "destroyed_on": null,
                "history": [
                    {
                        "created_on": null,
                        "destroyed_on": null,
                        "is_alive": null,
                        "device": null,
                        "browser": null,
                        "jwt": null

                    }
                ],
                "notes": [
                    {
                        "text": null,
                        "timestamp": null
                    }
                ]
            }
            db.get().collection('loginCollection').insert(userObj, function (err, results) {
                //console.log(results,'sendUserAddDataToClient');
                done(true);
            });
        }
        else {
            done('exists');
        }
    })

};

exports.getUsers = (done) => {
    db.get().collection('loginCollection').find({}, { email: 1, is_admin: 1, role: 1 }).toArray((err, results) => {
        //console.log(results,"err")
        done(results);
    });
};

exports.removeUserByEmail = (body, done) => {
    db.get().collection('loginCollection').remove({ email: body.email }, function (err, results) {
        //console.log(results,"results");
        done(true);
    });
};

exports.getLoginHistoryByEmail = (body, done) => {
    db.get().collection('loginCollection').findOne({ email: body.email }, { "history.created_on": 1, "history.destroyed_on": 1, "history.is_alive": 1, "history.device": 1, "_id": 0 }, function (err, results) {
        done(results);
    });
};

exports.addNote = (body, done) => {
    console.log(body, 'adding note');
    db.get().collection('loginCollection').update(
        {
            email: body.email
        }, {
            $push: {
                notes: {
                    text: body.noteText,
                    timestamp: moment().unix()
                }
            }
        }, (err, results) => {
            done();
        }
    )
};

exports.getNotesByEmail = (body, done) => {
    db.get().collection('loginCollection').findOne({ email: body.email }, { notes: 1 }, function (err, results) {
        done(results);
    });
};

exports.deleteTokens = (body, done) => {
    db.get().collection('loginCollection').update({ email: body.email }, { $set: { history: [] } }, function (err, results) {
        done(true)
    });
};

exports.changePwd = (body, done) => {
    db.get().collection('loginCollection').findOne(
        {
            email: body.email
        }, {
            password: 1
        }, function (err, results) {
            console.log(results,"err");
            if (results.password === body.oldPwd) {
                db.get().collection('loginCollection').update(
                    {
                        email: body.email
                    }, {
                        $set:
                        {
                            password: body.newPwd
                        }
                    }, function (err, results) {
                        if(!err){
                            done(true);
                        }
                        else{
                            done('error');
                        }
                    }
                )
            }
            else {
                done('wrongPwd')
            }

        });
}


//  db.loginCollection.findOne({email:'nev@gmail.com'},{history:{$elemMatch:{jwt:"eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJfaWQiOiI1OTA5YWU3ZjBjMzE4YTIxOGM2MDgyMGMiLCJlbWFpbCI6Im5ldkBnbWFpbC5jb20iLCJyb2xlIjoiYWRtaW4iLCJpYXQiOjE0OTQ5NDc0MjIsImV4cCI6MTQ5NTgxMTQyMn0.kb-zBKYd6PxCjVIbRrXEgLkIaTRhgsC1JXirya2klOk"}}})