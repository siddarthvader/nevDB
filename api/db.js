var MongoClient = require('mongodb').MongoClient
    , assert = require('assert');

var state = {
    db: null,
}

exports.connect = (url, auth, done)=> {
    if (state.db) return done()

    MongoClient.connect(url, (err, db)=> {
        if (err) return done(err)
        state.db = db;
        db.authenticate(auth.user, auth.pwd, (err, result)=> {
            assert.equal(true, result);
            //console.log('connected');
            

            done();
        });
    })
}

exports.get = ()=> {
    return state.db
}

exports.close =(done)=> {
    if (state.db) {
        state.db.close(function (err, result) {
            state.db = null
            state.mode = null
            done(err)
        })
    }
}