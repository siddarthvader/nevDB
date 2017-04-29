var mongo = require('mongodb');

exports.email=(req, res, next) => {
    console.log('here for email');
    var responseObj = {
        message: 'success',
        status: 200,
        data: {}
    };
    res.json(responseObj);
};

exports.password=(req, res, next) => {
    console.log('here for password');
    var responseObj = {
        message: 'success',
        status: 200,
        data: {}
    };
    res.json(responseObj);
};