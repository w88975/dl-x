var request = require('request');
module.exports = function(ip,cb) {
    request('http://int.dpool.sina.com.cn/iplookup/iplookup.php?format=json&ip=' + ip, function (error, response, body) {
        if (!error && response.statusCode == 200) {
            var obj = JSON.parse(body);
            cb(ip,(obj.country + obj.province + obj.city));
        } else {
            cb(ip,'[未知地址]');
        }
    });
};
