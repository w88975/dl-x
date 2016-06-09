var ckLogin = require('../lib/cklogin.js');
var sql = require('../db/sqlite.js');
module.exports = function(app) {
    app.get(['/data'],function(req,res) {
        ckLogin(req,res,function(t,uname) {
            if (t) {
                var userId = req.cookies.oid;
                sql.all('select * from datas where isDelete=0 and userId='+userId+' order by id desc;',function(err,rows){
                    res.render('pages/data.html',{layout: 'pages/layout.html',msg: null,hasErr: false,userName: uname,datas: rows});
                });
            } else {
                res.redirect('/login');
            }
        });
    });

    app.post(['/data'],function(req,res) {
        ckLogin(req,res,function(t,uname) {
            if (t) {
                var id = req.body.id;
                sql.all('update datas set isDelete=1 where id=' + id + ';',function() {
                    res.redirect('/data');
                });
            } else {
                res.redirect('/login');
            }
        });
    });
};
