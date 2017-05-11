var userModel = require('./../models/userCollecton.js');
var userView = require('./../views/userView.js');

exports.get = (req, res, path) => {
    console.log(path, "path");
    switch (path) {
        case '/inviteUser':
            inviteUser(req, res);
            break;
        case '/removeUser':
            removeUser(req, res);
            break;
        default:
            break;
    }
}


var inviteUser = (req, res) => {
    let body = '';
    req.on('data', (data) => {
        body += data;
    });

    req.on('end', function () {
        userModel.addNewUserToDb(JSON.parse(body), (results) => {
            console.log(results,'sendUserAddDataToClient');
            userView.sendUserAddDataToClient(req,res,results)
        })
        console.log(typeof body);

    })
}