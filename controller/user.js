var dbMan = require('../db/mongo.js');
var Async = require('async');
module.exports = function(app) {
    app.get(['/adduser'],function(req,res) {
        res.render('pages/adduser.html',{layout: 'pages/layout.html',msg: null,hasErr: false});
    });
    app.post(['/adduser'],function(req,res) {
        var idNumber = 0;
        var name = req.body.username;
        var pwd = req.body.userpwd;
        var admin = req.body.isAdmin === 'admin' ? true : false;
        var regTime = new Date().getTime().toString();
        if (name.length <= 0 || pwd.length <=0) {
            return res.render('pages/adduser.html',{layout: 'pages/layout.html',msg: '账号密码不能为空!',hasErr: true});
        }
        Async.series([
            function(cb) {
                dbMan.count('users',{},function(err,length) {
                    if (err) {
                        return cb(1,false)
                    }
                    idNumber = Number(length) + 1;
                    cb(null,true);
                });
            },
            function(cb) {
                dbMan.count('users',{userName: name,isDelete: false}, function(err, length) {
                    if (length <= 0) {
                        return cb(null,true);
                    }
                    step = false;
                    return cb('用户已存在!',false)
                });
            },
            function(cb) {
                dbMan.insert('users',{
                    userName: name,
                    userPwd: pwd,
                    customId: idNumber,
                    isDelete: false,
                    isAdmin: admin,
                    tempId: -1,
                    regTime: regTime,
                },function(err,results) {
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
            res.render('pages/adduser.html',{layout: 'pages/layout.html',msg: err,hasErr: _hasErr});
        });
    })
};
