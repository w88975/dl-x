var dbMan = require('../db/mongo.js');
module.exports = function(app) {
    app.get(['/login'],function(req,res) {
        res.clearCookie('oid');
        res.render('pages/login.html',{layout: null,msg:'请登录!'});
    });

    app.post(['/login'],function(req,res) {
        res.clearCookie('oid');
        var name = req.body.name;
        var pwd = req.body.pwd;
        dbMan.find('users',{isDelete: false,userName:name,userPwd:pwd},function(err,results) {
            if (results.length >0 ) {
                res.clearCookie('oid');
                res.cookie('oid', results[0].customId);
                return res.redirect('/index');
            }
            res.clearCookie('oid');
            res.render('pages/login.html',{layout: null,msg:'登录失败,请检查账号密码是否正确!'});
        });
    })
};
