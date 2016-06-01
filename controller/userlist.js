var dbMan = require('../db/mongo.js');
module.exports = function(app) {
    app.get(['/users'],function(req,res) {
        dbMan.find('users',{isDelete: false},function(err,results) {
            res.render('pages/users.html',{layout: 'pages/layout.html',userlist:results });
        });
    });

    app.post(['/users'],function(req,res) {
        var uid = req.body.uid;
        if (uid) {
            dbMan.update('users',{customId: uid},{isDelete: true},function(err,results) {
                res.redirect('users');
            });
        }
    });
};
