var sql = require('../db/sqlite.js');
module.exports = function(app) {
    app.get(['/login'],function(req,res) {
        res.clearCookie('oid');
        res.render('pages/login.html',{layout: null,msg:'请登录!'});
    });

    app.post(['/login'],function(req,res) {
        res.clearCookie('oid');
        var name = req.body.name;
        var pwd = req.body.pwd;
        sql.all('select * from users where userName="' + name + '" and userPwd="' + pwd +'" and isDelete=0;',function(err,rows) {
            if (rows.length >0 ) {
                res.clearCookie('oid');
                res.cookie('oid', rows[0].id);
                res.cookie('isAdmin',rows[0].isAdmin);
                return res.redirect('/admin');
            } else {
                return res.render('pages/login.html',{layout: null,msg:'账号或密码错误!'});
            }
        })
    })
};
