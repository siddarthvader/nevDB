var db = require('./../db');

exports.getUserByEmailId = (body, done) => {
    console.log(body.email);
    db.get().collection('loginCollection').find({ email: body.email }).toArray((err, results) => {
        done(results);
    });
};

exports.validatePasswordUsingEmail = (body, done) => {
    console.log(body,'pwd body');
    db.get().collection('loginCollection').find({ email: body.email, password: body.pwd }).count((err, results) => {
        console.log(results,'pwd results');
        done(results);
    });
};