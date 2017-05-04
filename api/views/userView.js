exports.sendLoginDataToClient = (req, res, obj) => {
    let reponseObj = {};
    if (obj.length) {
        responseObj = {
            message: 'success',
            status: 200,
            data: {
                state: 'goToPwd',
                userData: obj[0]
            }
        };
    }
    else {
        responseObj = {
            message: 'success',
            status: 200,
            data: {
                state: 'newEmail'
            }
        };
    }

    writeHead(res,responseObj);

};

exports.sendPwdVerificationToClient = (req, res, obj) => {
    let responseObj = {};
    if (obj) {
        responseObj = {
            message: 'success',
            status: 200,
            data: {
                state: 'goToLanding',
                token: null
            }
        };
    }
    else {
        responseObj = {
            message: 'success',
            status: 200,
            data: {
                state: 'notFound',
                token: null
            }
        };
    }

    writeHead(res,responseObj);
}

let writeHead = (res,responseObj) => {
    res.writeHead(200, {
        'Content-Type': 'text/html'
    });
    res.write(JSON.stringify(responseObj));
    res.end();
}

