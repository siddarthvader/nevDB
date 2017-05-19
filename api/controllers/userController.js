var userModel = require('./../models/userCollecton.js');
var userView = require('./../views/userView.js');

exports.get = (req, res, path) => {
    //console.log(path, "path");
    switch (path) {
        case '/inviteUser':
            inviteUser(req, res);
            break;
        case '/getUsers':
            getUsers(req, res);
            break;
        case '/removeUser':
            removeUser(req, res);
            break;
        case '/history':
            history(req, res);
            break;
        case '/addNote':
            addNote(req, res);
            break;
        case '/getNote':
            getNote(req, res);
            break
        case '/deleteTokens':
            deleteTokens(req, res);
            break;
        case '/changePwd':
            changePwd(req, res);
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
            //console.log(results, 'sendUserAddDataToClient');
            userView.sendUserAddDataToClient(req, res, results)
        })
        //console.log(typeof body);

    })
};

var getUsers = (req, res) => {
    userModel.getUsers((results) => {
        userView.sendUserListToClient(req, res, results);
    })
};

var removeUser = (req, res) => {
    let body = '';
    req.on('data', (data) => {
        body += data;
    });

    req.on('end', function () {
        userModel.removeUserByEmail(JSON.parse(body), (results) => {
            //console.log(results, 'sendUserAddDataToClient');
            userView.userRemovedResToClient(req, res)
        })
    })
};

var history = (req, res) => {
    let body = '';
    req.on('data', (data) => {
        body += data;
    });

    req.on('end', function () {
        userModel.getLoginHistoryByEmail(JSON.parse(body), (results) => {
            userView.sendLoginHistoryToClient(req, res, results)
        })
    })
};

var addNote = (req, res) => {

    let body = '';
    req.on('data', (data) => {
        body += data;
    });

    req.on('end', function () {
        console.log('adding note');
        userModel.addNote(JSON.parse(body), (results) => {
            //console.log(results, 'sendUserAddDataToClient');
            userView.sendAddedNoteResToClient(req, res)
        })
    })

};

var getNote = (req, res) => {
    console.log('getting note');
    let body = '';
    req.on('data', (data) => {
        body += data;
        console.log(data)
    });

    req.on('end', function () {
        console.log(body, "boduy");
        userModel.getNotesByEmail(JSON.parse(body), (results) => {
            //console.log(results, 'sendUserAddDataToClient');
            userView.sendNotesToClient(req, res, results)
        });
    })

};

var deleteTokens = (req, res) => {
    let body = '';
    req.on('data', (data) => {
        body += data;
        console.log(data)
    });

    req.on('end', function () {
        console.log(body, "boduy");
        userModel.deleteTokens(JSON.parse(body), (results) => {
            //console.log(results, 'sendUserAddDataToClient');
            userView.deletTokenResToClient(req, res);
        });
    })
};

var changePwd = (req, res) => {
    let body = '';
    req.on('data', (data) => {
        body += data;
        console.log(data)
    });

    req.on('end', function () {
        console.log(body, "boduy");
        userModel.changePwd(JSON.parse(body), (results) => {
            //console.log(results, 'sendUserAddDataToClient');
            userView.changePwdResToClient(req, res,results)
        });
    })
};