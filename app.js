const config = require('./config.json');
var express = require('express');
var partials = require('express-partials');
var bodyParser = require("body-parser");

var cookieParser = require('cookie-parser'); //如果要使用cookie，需要显式包含这个模块

var app = express();
// 设置 Cookie
app.use(cookieParser('dl-x'));
app.use(partials());
app.use(bodyParser.urlencoded({ extended: false }));
require('./controller/index.js')(app);
require('./controller/user.js')(app);
require('./controller/login.js')(app);
require('./controller/userlist.js')(app);
require('./controller/test.js')(app);
require('./controller/resource.js')(app);
app.engine('html', require('ejs').renderFile);
app.listen(config.port);
