var fs = require('fs');
var file = 'dl.db';
var sqlite3 = require('sqlite3').verbose();
var db = new sqlite3.Database(file);
module.exports = db;
