var ckLogin = require('../lib/cklogin.js');
var sql = require('../db/sqlite.js');
module.exports = function(app) {
    app.get(['/index','/'],function(req,res) {
        ckLogin(req,res,function(t,uname) {
            if (t) {
                var userId = req.cookies.oid;
                sql.all('select * from urls where isDelete=0;',function(err,rows){
                    res.render('pages/index.html',{userName: uname,urls:rows,userId:userId});
                });
                
            } else {
                res.redirect('/login');
            }
        });
    })
};
