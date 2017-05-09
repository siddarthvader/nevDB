var db = require('./../db');
var jwt = require('jsonwebtoken');

exports.getUserByEmailId = (body, done) => {
    db.get().collection('loginCollection').findOne({ email: body.email },{email:1},(err, results) => {
        console.log(results,"results");
        done(results);
    })
};

exports.validatePasswordUsingEmail = (body, done) => {
    console.log(body, 'pwd body');
    db.get().collection('loginCollection').findOne({ email: body.email, password: body.pwd },{password:0},(err, results) => {
        console.log(results, 'pwd results');
        done(results);
    });
};
exports.generateJWT = (pwdRes, done) => {
    // console.log(pwdRes, 'generate jwt');
    let token = jwt.sign(
        { 
            email: pwdRes.email,
            role:pwdRes.role 
        }
        , 'nelson',{expiresIn:'1m'});

    pwdRes.token=token;   
    done(pwdRes); 


}