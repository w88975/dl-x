var ckLogin = require('../lib/cklogin.js');
var sql = require('../db/sqlite.js');
module.exports = function(app) {
    app.get(['/data'],function(req,res) {
        ckLogin(req,res,function(t,uname) {
            if (t) {
                var userId = req.cookies.oid;
                var p = 0;
                if (req.query.p){
                    p = Number(req.query.p);
                }
                'select * from datas where isDelete=0 and userId=8 order by id desc limit 10 offset 0';
                sql.all('select * from datas where isDelete=0 and userId='+userId+' order by id desc limit 50 offset '+(p*50)+';',function(err,rows){
                    sql.all('select count(*) from datas where isDelete=0 and userId=' + userId + ';',function(err,count) {
                        var lastPage = parseInt(count[0]['count(*)']/50);
                        var _rows = rows;
                        for (var i = 0; i < _rows.length; ++i) {
                            var t = eval('new Date('+_rows[i].insertTime+')');
                            _rows[i].insertTime = t.getFullYear() + '-' + (t.getMonth()+1) + '-' + t.getDate() + ' ' + t.getHours() + ':' + t.getMinutes() + ':' + t.getSeconds();
                        }
                        res.render('pages/data.html',{layout: 'pages/layout.html',msg: null,hasErr: false,userName: uname,datas: _rows,p:p,lastPage:lastPage});
                    });

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

    app.post(['/data_d'],function(req,res) {
        ckLogin(req,res,function(t,uname) {
            if (t) {
                var lst = req.body.lst;
                lst = lst.split(',');
                var wheresql = '';
                for (var i = 0; i < lst.length; ++i) {
                    if (i ===0) {
                        wheresql = 'where id=' + lst[i];
                    } else {
                        wheresql += ' or id='+ lst[i];
                    }
                }
                sql.all('update datas set isDelete=1 ' + wheresql +';',function() {
                    res.redirect('/data');
                });
            } else {
                res.redirect('/login');
            }
        });
    });
};
