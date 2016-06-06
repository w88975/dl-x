var ckLogin = require('../lib/cklogin.js');
var sql = require('../db/sqlite.js');
module.exports = function(app) {
    app.get(['/temps'],function(req,res) {
        ckLogin(req,res,function(t,uname) {
            if (t) {
                var userId = req.cookies.oid;
                sql.all('select * from temps where isDelete=0;',function(err,rows) {
                    sql.all('select tempId from users where id=' + userId + ';',function(err,tids) {
                        res.render('pages/temps.html',{layout: 'pages/layout.html',tempList:rows,userName: uname,tempId:tids[0].tempId });
                    })
                });
            } else {
                res.redirect('/login');
            }
        });
    })

    app.post(['/temps'],function(req,res) {
        ckLogin(req,res,function(t,uname) {
            if (t) {
                var uid = req.body.uid;
                sql.all('update temps set isDelete = 1 where id=' + uid + ';',function(err,rows) {
                    res.redirect('/temps');
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
                var url = req.body.url;
                var regTime = new Date().getTime().toString();
                sql.all('insert into temps values(null,"' + name +'","/upload/' + fileName + '","'+url+'",0,"' + regTime + '");',function(err,rows){
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


    // 选择模板

    app.get(['/usetemp'],function(req,res) {
        ckLogin(req,res,function(t,uname) {
            if (t) {
                var id = req.query.id;
                var userId = req.cookies.oid;
                sql.all('update users set tempId=' + id + ' where id=' + userId + ';',function(err,rows){
                    if (!err) {
                        return res.redirect('/usetemp_s');
                    } else {
                        return res.redirect('/usetemp_f');
                    }
                })
            } else {
                res.redirect('/login');
            }
        });
    });

    app.get(['/usetemp_s','/usetemp_f'],function(req,res) {
        if (req.path === '/usetemp_s') {
            return res.send('<script>alert("设置模板成功!");window.location.href="/temps";</script>')
        }
        res.send('<script>alert("设置模板失败!");window.location.href="/temps";</script>')
    });
};
