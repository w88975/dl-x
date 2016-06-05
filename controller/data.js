var ckLogin = require('../lib/cklogin.js');
var sql = require('../db/sqlite.js');
module.exports = function(app) {
    app.get(['/data'],function(req,res) {
        ckLogin(req,res,function(t,uname) {
            if (t) {
                sql.all('select * from datas where isDelete=0;',function(err,rows){
                    res.render('pages/data.html',{layout: 'pages/layout.html',msg: null,hasErr: false,userName: uname,datas: rows});
                });
            } else {
                res.redirect('/login');
            }
        });
    });
};
