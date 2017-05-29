var fs = require('fs');
exports.sendLoginDataToClient = (req, res, obj) => {
    let reponseObj = {};
    //console.log(obj, "obj");
    if (obj) {
        responseObj = {
            message: 'success',
            status: 200,
            data: {
                state: 'goToPwd',
                userData: obj
            }
        };
    }
    else {
        responseObj = {
            message: 'success',
            status: 200,
            data: {
                state: 'notFound'
            }
        };
    }

    writeHead(res, responseObj, 200, 'text/html');

};

exports.sendPwdVerificationToClient = (req, res, obj) => {
    let responseObj = {};
    //console.log(obj, "obj")
    if (obj) {
        responseObj = {
            message: 'success',
            status: 200,
            data: {
                state: 'goToLanding',
                data: obj
            }
        };
    }
    else {
        responseObj = {
            message: 'success',
            status: 200,
            data: {
                state: 'notFound'
            }
        };
    }

    writeHead(res, responseObj, 200, 'text/html');
}

exports.sendValidationResToClient = (req, res, valid) => {
    let responseObj;
    if (valid) {
        responseObj = {
            message: 'success',
            status: 200,
            data: {
                state: 'goToLanding'
            }
        };
    }
    else {
        responseObj = {
            message: 'success',
            status: 200,
            data: {
                state: 'invalidToken'
            }
        };
    }

    writeHead(res, responseObj, 200, 'text/html');
};

exports.send404Response = (req, res) => {
    //console.log('noptfoundtriggered');
    let responseObj = {
        message: 'notfound',
        status: '404',
        data: {
            state: 'getin'
        }
    }
    writeHead(res, responseObj, 200, 'text/plain');
};

exports.logOutFromDevice = (req, res) => {
    //console.log('noptfoundtriggered');
    let responseObj = {
        state: 'logout'
    }
    writeHead(res, responseObj, 200, 'text/plain');
};

exports.sendUserAddDataToClient = (req, res, status) => {
    let responseObj = {
        data: {}
    };
    if (status === true) {
        responseObj.data.state = 'added'

    }
    else if (status === 'exists') {
        responseObj.data.state = 'exists'

    }
    else {
        responseObj.data.state = 'error'

    }
    writeHead(res, responseObj, 200, 'text/plain');
};

exports.sendUserListToClient = (req, res, list) => {
    // //console.log(list,"list");
    let responseObj = {
        data: list
    };
    writeHead(res, responseObj, 200, 'text/plain');
};

exports.userRemovedResToClient = (req, res) => {
    let responseObj = {
        data: {
            stats: 'removed'
        }
    }
    writeHead(res, responseObj, 200, 'text/plain');

};

exports.sendLoginHistoryToClient = (req, res, list) => {
    // //console.log(list,"list");
    let responseObj = {
        data: list
    };
    writeHead(res, responseObj, 200, 'text/plain');
};

exports.sendAddedNoteResToClient = (req, res, result) => {
    let responseObj = {
        data: true
    };
    writeHead(res, responseObj, 200, 'text/plain');
};


exports.sendNotesToClient = (req, res, result) => {
    let responseObj = {
        data: result
    };
    writeHead(res, responseObj, 200, 'text/plain');
};

exports.editNoteResponse = (req, res, result) => {
    let responseObj = {
        data:{
            message:"success"
        }
    };
    writeHead(res, responseObj, 200, 'text/plain');
};

exports.deleteNoteResponse = (req, res, result) => {
    let responseObj = {
        data:{
            message:"success"
        }
    };
    writeHead(res, responseObj, 200, 'text/plain');
};


exports.deletTokenResToClient = (req, res) => {
    let responseObj = {
        data: {
            state: 'getin'
        }
    };
    writeHead(res, responseObj, 200, 'text/plain');
};

exports.changePwdResToClient = (req, res, results) => {
    let responseObj={};
    if (results === true) {
        responseObj = {
            data: {
                state: 'success'
            }
        };
    }
    else{
        responseObj = {
            data: {
                state: results
            }
        };
    }

    writeHead(res, responseObj, 200, 'text/plain');
};

let writeHead = (res, responseObj, status, contentType) => {
    //console.log('writing head');
    res.writeHead(status, {
        'Content-Type': contentType
    });
    if (typeof responseObj === 'string') {
        res.write(responseObj);

    }
    else {
        res.write(JSON.stringify(responseObj));
    }
    res.end();

};

