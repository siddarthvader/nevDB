var queries = {
    "removeAllFromHistory": "db.loginCollection.update({},{$pull:{history:{}}})",
    "removeEmptyDocument": "db.loginCollection.deleteOne({email:null})",
    "findDocumentbyValueOfToken": "db.loginCollection.find({history:{$elemMatch:{jwt:'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJfaWQiOiI1OTA5YWU3ZjBjMzE4YTIxOGM2MDgyMGMiLCJlbWFpbCI6Im5ldkBnbWFpbC5jb20iLCJyb2xlIjoiYWRtaW4iLCJpYXQiOjE0OTQ0NDE3MTAsImV4cCI6MTQ5NTMwNTcxMH0.u34ER2CpSDqX42DfLVtZrgTX-O9rwIMO2xFdh9MZfxI'}}})"
}


// update the value of is_Alive token on the basis of jwt value
db.loginCollection.update(
    {
        email: "nev@gmail.com",
        "history.jwt": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJfaWQiOiI1OTA5YWU3ZjBjMzE4YTIxOGM2MDgyMGMiLCJlbWFpbCI6Im5ldkBnbWFpbC5jb20iLCJyb2xlIjoiYWRtaW4iLCJpYXQiOjE0OTQ0NDE3MTAsImV4cCI6MTQ5NTMwNTcxMH0.u34ER2CpSDqX42DfLVtZrgTX-O9rwIMO2xFdh9MZfxI"
    }, {
        $set: {
            "history.$.is_alive": false
        }
    });

db.loginCollection.find(
    {
        email: "nev@gmail.com"
    }
);

db.loginCollection.find({
    email:"nev@gmail.com",
    "history.jwt":null
});