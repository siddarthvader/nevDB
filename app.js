var MongoClient = require('mongodb').MongoClient
  , assert = require('assert');

// Connection URL
var url = 'mongodb://localhost:27017/nevDb?authMechanism=DEFAULT&authSource=db';

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

  })
});

var insertDocuments = (db, callback) => {
  // Get the documents collection
  var collection = db.collection('loginCollection', (err, collection) => {

    // Insert some documents
    collection.insert(
      {
        "email": null,
        "password": null,
        "role": null,
        "is_admin": null,
        "exists": null,
        "created_on": null,
        "destroyed_on": null,
        "history": [
          {
            "timestamp": null,
            "device": null,
            "browser": null
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
        console.log("Inserted 3 documents into the collection");
        callback(result);
      });
  });
}