var dbMan = require('./db/mongo.js');
dbMan.count('users',function(err,res) {
    console.log(res)
});
