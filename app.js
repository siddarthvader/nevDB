var MongoClient = require('mongodb').MongoClient
  , assert = require('assert');

// Connection URL
var url = 'mongodb://localhost:27017/nevDb?authMechanism=DEFAULT&authSource=db';

global.__base = __dirname + '/';

// Use connect method to connect to the server
MongoClient.connect(url, (err, db) => {
  assert.equal(null, err);
  console.log("Connected successfully to server");

  db.authenticate("nevRoot", "nevRoot", function (err, result) {
    assert.equal(true, result);
    console.log('connected');
    insertDocuments(db, function () {
      db.close();
    });

    findDocuments(db, () => {
      db.close();
    });
  })
});

var findDocumennts = (db, callBack) => {

  db.collection('loginCollection').find({ email: 'nev@gmail.com' }).toArray((err, results) => {
    done(results);
  });
}

var insertDocuments = (db, callback) => {
  // Get the documents collection
  var collection = db.collection('loginCollection', (err, collection) => {

    // Insert some documents
    collection.insert(
      {
        "email": 'nev@gmail.com',
        "password": 'admin',
        "role": 'admin',
        "is_admin": true,
        "exists": true,
        "created_on": 1493806677,
        "destroyed_on": null,
        "history": [
          {
            "created_on": null,
            "destroyed_on": null,
            "is_alive": null,
            "device": null,
            "jwt": null
          }
        ],
        "notes": [
          {
            "text": null,
            "timestamp": null
          }
        ]
      }, function (err, result) {
        assert.equal(err, null);
        console.log("Inserte  d 3 documents into the collection");
        callback(result);
      });
  });
}