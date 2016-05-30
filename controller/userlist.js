var dbMan = require('../db/mongo.js');
module.exports = function(app) {
    app.get(['/users'],function(req,res) {
        dbMan.find('users',{},function(err,results) {
            res.render('pages/users.html',{layout: 'pages/layout.html',userlist:results });
        });
    });

    app.post(['/users'],function(req,res) {
        
    });
};
