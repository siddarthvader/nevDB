var db = require('./../db');

exports.getUserByEmailId = (body, done) => {
    console.log(body.email);
    db.get().collection('loginCollection').find({ email: body.email }).toArray((err,results)=>{
        console.log(results);
        done(results);
    });
}