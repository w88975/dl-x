const config = require('./config.json');
var express = require('express');
var partials = require('express-partials');
var multer = require('multer');
var bodyParser = require("body-parser");
var sql = require('./db/sqlite.js');
var cookieParser = require('cookie-parser'); //如果要使用cookie，需要显式包含这个模块

var app = express();
// 设置 Cookie
app.use(cookieParser('dl-x'));
app.use(partials());
app.use(bodyParser.urlencoded({ extended: false }));

app.use(multer({ dest: './views/upload/' }));

// 建表
sql.all('create table users(id integer PRIMARY KEY,tempId integer,isAdmin integer,isDelete integer,userPwd text,userName text,regTime text);',function(){})
sql.all('create table temps(id integer PRIMARY KEY,tempName text,bgUrl text,isDelete integer,createTime text);',function(){});

require('./controller/index.js')(app);
require('./controller/user.js')(app);
require('./controller/login.js')(app);
require('./controller/userlist.js')(app);
require('./controller/temps.js')(app);
require('./controller/test.js')(app);
require('./controller/resource.js')(app);
app.engine('html', require('ejs').renderFile);
app.listen(config.port);
