var cwd = process.cwd();
var path = require('path');
var fs = require('fs');
module.exports = function(app) {
    app.get(/^(.+)$/, function(req, res) {
        fs.exists(path.join(cwd,'/views/') + req.params[0], function(exists) {
          if (exists) {
              res.sendFile( path.join(cwd,'/views/') + req.params[0]);
          } else {
              res.end();
          }
        });
    });
    app.post(/^(.+)$/, function(req, res) {
        fs.exists(path.join(cwd,'/views/') + req.params[0], function(exists) {
          if (exists) {
              res.sendFile( path.join(cwd,'/views/') + req.params[0]);
          } else {
              res.end();
          }
        });
    });
};
