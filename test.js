var magic = require('./lib/magic.js');
module.exports = function(app) {
    app.get(['/test'],function(req,res) {
        magic('test.html',function(html) {
            res.send(html);
        })
    })
};
