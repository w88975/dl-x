var ckLogin = require('../lib/cklogin.js');
var sql = require('../db/sqlite.js');
module.exports = function(app) {
    app.get(['/url'],function(req,res) {
        ckLogin(req,res,function(t,uname) {
            if (t) {
                sql.all('select * from urls where isDelete=0;',function(err,rows){
                    res.render('pages/url.html',{layout: 'pages/layout.html',msg: null,hasErr: false,userName: uname,urls: rows});
                });
            } else {
                res.redirect('/login');
            }
        });
    });
    
    app.post(['/addurl'],function(req,res) {
        ckLogin(req,res,function(t,uname) {
            if (t) {
                var domain = req.body.domain;
                sql.all('insert into urls values(null,"' + domain + '",0,0);',function(err,rows){
                    res.redirect('/url');
                });
            } else {
                res.redirect('/login');
            }
        });
    });
    
    app.get(['/deleteurl'],function(req,res) {
        ckLogin(req,res,function(t,uname) {
            if (t) {
                var id = req.query.id;
                sql.all('update urls set isDelete=1 where id=' + id +';',function(err,rows){
                    res.redirect('/url');
                });
            } else {
                res.redirect('/login');
            }
        });
    });
    
    app.post(['/url'],function(req,res) {
        ckLogin(req,res,function(t,uname) {
            if (t) {
                var id = req.body.id;
                var domain = req.body.domain;
                sql.all('update urls set domain="' + domain + '" where id=' + id + ';' ,function(err,rows){
                    res.send('<script>alert("保存成功!");window.location.href="/url";</script>')
                });
            } else {
                res.redirect('/login');
            }
        });
    });
};
