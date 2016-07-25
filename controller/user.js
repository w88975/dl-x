var ckLogin = require('../lib/cklogin.js');
var Async = require('async');
var sql = require('../db/sqlite.js');
module.exports = function(app) {
    app.get(['/adduser'],function(req,res) {
        ckLogin(req,res,function(t,uname) {
            if (t) {
                res.render('pages/adduser.html',{layout: 'pages/layout.html',msg: null,hasErr: false,userName: uname});
            } else {
                res.redirect('/login');
            }
        });
    });
    
    app.get(['/changepwd'],function(req,res) {
        ckLogin(req,res,function(t,uname) {
            if (t) {
                res.render('pages/changepwd.html',{layout: 'pages/layout.html',msg: null,hasErr: false,userName: uname});
            } else {
                res.redirect('/login');
            }
        });
    });
    app.post(['/adduser'],function(req,res) {
        ckLogin(req,res,function(t,uname) {
            if (t) {
                var name = req.body.username;
                var pwd = req.body.userpwd;
                var admin = req.body.isAdmin === 'admin' ? 1 : 0;
                var regTime = new Date().getTime().toString();
                if (name.length <= 0 || pwd.length <=0) {
                    return res.render('pages/adduser.html',{layout: 'pages/layout.html',msg: '账号密码不能为空!',hasErr: true,userName: uname});
                }
                Async.series([
                    function(cb) {
                        sql.all('select count(*) from users where userName=' + '"'+name+'"' + 'and isDelete=' + '0;',function(err,rows){
                            if (rows[0]['count(*)'] <= 0) {
                                return cb(null,true);
                            }
                            return cb('用户已存在!',false)
                        });
                    },
                    function(cb) {
                        sql.all('insert into users values(null,-1,'+admin+',0,"'+pwd+'","'+name+'","'+regTime+'"); ',function(err,rows){
                            if (!err) {
                                return cb(null,true);
                            }
                            else {
                                return cb(1,false)
                            }
                        });
                    },
                ],function(err,result) {
                    var _hasErr = true;
                    if (!err) {
                        err = '添加用户成功!'
                        _hasErr = false;
                    }
                    res.render('pages/adduser.html',{layout: 'pages/layout.html',msg: err,hasErr: _hasErr,userName: uname});
                });
            } else {
                res.redirect('/login');
            }
        });
    })
};
