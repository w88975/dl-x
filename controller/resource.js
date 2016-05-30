var cwd = process.cwd();
var path = require('path');
module.exports = function(app) {
    app.get(/^(.+)$/, function(req, res) {
        res.sendFile( path.join(cwd,'/views/') + req.params[0]);
    });
    app.post(/^(.+)$/, function(req, res) {
        res.sendFile( path.join(cwd,'/views/') + req.params[0]);
    });
};
