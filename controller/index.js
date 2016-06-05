var ckLogin = require('../lib/cklogin.js');
module.exports = function(app) {
    app.get(['/index','/'],function(req,res) {
        ckLogin(req,res,function(t,uname) {
            if (t) {
                console.log(req.device.type);
                res.render('pages/index.html',{userName: uname});
            } else {
                res.redirect('/login');
            }
        });
    })
};
