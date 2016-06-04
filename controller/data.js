var ckLogin = require('../lib/cklogin.js');
var sql = require('../db/sqlite.js');
module.exports = function(app) {
    app.get(['/data'],function(req,res) {
        ckLogin(req,res,function(t,uname) {
            if (t) {
                // sql.all('select * from urls where isDelete=0;',function(err,rows){
                //     res.render('pages/url.html',{layout: 'pages/layout.html',msg: null,hasErr: false,userName: uname,urls: rows});
                // });
                res.render('pages/data.html',{layout: 'pages/layout.html',msg: null,hasErr: false,userName: uname});
            } else {
                res.redirect('/login');
            }
        });
    });
};
