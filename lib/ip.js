var request = require('request');
module.exports = function(ip,cb) {
    request('http://ip.taobao.com/service/getIpInfo.php?ip=' + ip, function (error, response, body) {
        if (!error && response.statusCode == 200) {
            var obj = JSON.parse(body);
            if (obj.data === 'invaild ip.') {
                return cb(ip,'[未知地址]');
            };
            cb(ip,(obj.data.country + obj.data.region + obj.data.city + '['+ obj.data.isp+']'));
        } else {
            cb(ip,'[未知地址]');
        }
    });
};
