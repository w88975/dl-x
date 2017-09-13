var ckLogin = require('../lib/cklogin.js');
var sql = require('../db/sqlite.js');
var code = require('../lib/incode.js');
var ranStr = require('../lib/ranstr.js')
module.exports = function (app) {
    app.get(['/admin'], function (req, res) {
        ckLogin(req, res, function (t, uname) {
            if (t) {
                var userId = req.cookies.oid;
                sql.all('select * from urls where isDelete=0;', function (err, rows) {
                    sql.all('select * from users cross join temps where users.tempId=temps.id and users.id=' + userId + ';', function (err, results) {
                        var isMail = false;
                        if (results[0]) {
                            if (results[0].url) {
                                if (results[0].url === 'MAIL') {
                                    isMail = true;
                                }
                            }
                        }
                        res.render('pages/index.html', { userName: uname, urls: rows, userId: code.encode(userId), _uid: userId, func: code.encode, isMail: isMail, ranStr: ranStr.en() });
                    });

                });

            } else {
                res.redirect('/login');
            }
        });
    })
};
