var dbMan = require('../db/mongo.js');

module.exports = function(req,res,cb) {
    var uid = req.cookies.oid;
    dbMan.find('users',{customId: uid},function(err,results){
        if (results.length > 0) {
            cb(true,results[0].userName);
        }else {
            cb(false,'未登录');
        }
    });
};
