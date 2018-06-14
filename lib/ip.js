var request = require('request');
module.exports = function(ip,cb) {
    request('http://ip.taobao.com/service/getIpInfo.php?ip=' + ip, function (error, response, body) {
        if (!error && response.statusCode == 200) {
            var obj = JSON.parse(body);
            obj = obj.data
            cb(ip,(obj.country + obj.region + obj.city));
        } else {
            cb(ip,'[未知地址]');
        }
    });
};
