var fs = require('fs');
var file = 'master.zip';
var sqlite3 = require('sqlite3').verbose();
var db = new sqlite3.Database(file);
module.exports = db;
