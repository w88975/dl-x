var sql = require('./db/sqlite.js');
sql.all('select * from users cross join temps where users.tempId=temps.id and users.id=' + '8' + ';',function(err,rows){
    // var mid = rows[0].tempId;
    console.log(rows);
});
