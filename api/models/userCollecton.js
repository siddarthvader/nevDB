var db = require('./../db');
var jwt = require('jsonwebtoken');

exports.getUserByEmailId = (body, done) => {
    db.get().collection('loginCollection').findOne({ email: body.email }, { email: 1 }, (err, results) => {
        console.log(results, "results");
        done(results);
    })
};

exports.validatePasswordUsingEmail = (body, done) => {
    console.log(body, 'pwd body');
    db.get().collection('loginCollection').findOne({ email: body.email, password: body.pwd }, { password: 0 }, (err, results) => {
        console.log(results, 'pwd results');
        done(results);
    });
};
exports.generateJWT = (pwdRes, done) => {
    // console.log(pwdRes, 'generate jwt');
    let token = jwt.sign(
        {
            email: pwdRes.email,
            role: pwdRes.role
        }
        , 'nelson', { expiresIn: '1M' });

    pwdRes.token = token;
    done(pwdRes);
}

exports.verifyJWT = (body, headers, done) => {
    console.log("inside model verifyJWT", headers.token);
    jwt.verify(headers.token, 'nelson', (err, decoded) => {
        console.log("decodedTOken", err);
        if (err) {
            done(false);
        }
        else {
            done(true);
        }

    })
}
