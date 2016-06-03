var sql = require('../db/sqlite.js');
module.exports = function(req,res,cb) {
    var uid = req.cookies.oid;
    sql.all('select * from users where id='+uid+';',function(err,results) {
        if (!!results && results.length > 0) {
            cb(true,results[0].userName);
        } else {
            cb(false,'未登录');
        }
    });
};
