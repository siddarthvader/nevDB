var userView=require('./../views/userView.js');

exports.get=(req,res)=>{   
    userView.send404Response(req,res);
}