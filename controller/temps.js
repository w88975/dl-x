var ckLogin = require('../lib/cklogin.js');
var sql = require('../db/sqlite.js');
module.exports = function(app) {
    app.get(['/temps'],function(req,res) {
        ckLogin(req,res,function(t,uname) {
            if (t) {
                sql.all('select * from temps where isDelete=0;',function(err,rows) {
                    res.render('pages/temps.html',{layout: 'pages/layout.html',tempList:rows,userName: uname });
                });
            } else {
                res.redirect('/login');
            }
        });
    })

    app.post(['/temps'],function(req,res) {
        ckLogin(req,res,function(t,uname) {
            if (t) {
                sql.all('select * from temps where isDelete=0;',function(err,rows) {
                    res.render('pages/temps.html',{layout: 'pages/layout.html',tempList:rows,userName: uname });
                });
            } else {
                res.redirect('/login');
            }
        });
    })

    app.get(['/addtemps'],function(req,res) {
        ckLogin(req,res,function(t,uname) {
            if (t) {
                res.render('pages/addtemps.html',{layout: 'pages/layout.html',msg: null,hasErr: false,userName: uname });
            } else {
                res.redirect('/login');
            }
        });
    });

    app.post(['/addtemps'],function(req,res) {
        ckLogin(req,res,function(t,uname) {
            if (t) {
                var name = req.body.name;
                var fileName = req.files.img.name;
                var regTime = new Date().getTime().toString();
                sql.all('insert into temps values(null,"' + name +'","/upload/' + fileName + '",0,"' + regTime + '");',function(err,rows){
                    var _hasErr = true;
                    if (!err) {
                        err = '添加模板成功!'
                        _hasErr = false;
                        return res.render('pages/addtemps.html',{layout: 'pages/layout.html',msg: err,hasErr: _hasErr,userName: uname });
                    }
                    return res.render('pages/addtemps.html',{layout: 'pages/layout.html',msg: '添加模板失败!',hasErr: _hasErr,userName: uname });
                });
            } else {
                res.redirect('/login');
            }
        });
    });
};
