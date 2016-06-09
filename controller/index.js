var ckLogin = require('../lib/cklogin.js');
var sql = require('../db/sqlite.js');
var code = require('../lib/incode.js');
module.exports = function(app) {
    app.get(['/admin'],function(req,res) {
        ckLogin(req,res,function(t,uname) {
            if (t) {
                var userId = req.cookies.oid;
                sql.all('select * from urls where isDelete=0;',function(err,rows){
                    sql.all('select * from users cross join temps where users.tempId=temps.id and users.id=' + userId +';',function(err,results){
                        res.render('pages/index.html',{userName: uname,urls:rows,userId:code.encode(userId),_uid: userId,func: code.encode,isMail: results[0].url === 'MAIL' ? true :false});
                    });

                });

            } else {
                res.redirect('/login');
            }
        });
    })
};
