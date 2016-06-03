var sql = require('../db/sqlite.js');
var ckLogin = require('../lib/cklogin.js');
module.exports = function(app) {
    app.get(['/users'],function(req,res) {
        ckLogin(req,res,function(t,uname) {
            if (t) {
                sql.all('select * from users where isDelete=0;',function(err,results){
                    res.render('pages/users.html',{layout: 'pages/layout.html',userlist:results,userName: uname });
                });
            } else {
                res.redirect('/login');
            }
        });
    });

    app.post(['/users'],function(req,res) {
        ckLogin(req,res,function(t,uname) {
            if (t) {
                var uid = req.body.uid;
                sql.all('update users set isDelete = 1 where id = '+uid+' ;',function(err,rows){
                    return res.redirect('users');
                });
            } else {
                res.redirect('/login');
            }
        });
    });
};
