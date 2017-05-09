exports.sendLoginDataToClient = (req, res, obj) => {
    let reponseObj = {};
    console.log(obj,"obj");
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
                state: 'newEmail'
            }
        };
    }

    writeHead(res,responseObj);

};

exports.sendPwdVerificationToClient = (req, res, obj) => {
    let responseObj = {};
    // console.log(obj,"obj")
    if (obj) {
        responseObj = {
            message: 'success',
            status: 200,
            data: {
                state: 'goToLanding',
                data:obj
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

    writeHead(res,responseObj);
}

let writeHead = (res,responseObj) => {
    res.writeHead(200, {
        'Content-Type': 'text/html'
    });
    if(typeof responseObj === 'string'){
        res.write(responseObj);
    }
    else{
        res.write(JSON.stringify(responseObj));
    }
    res.end();
}

