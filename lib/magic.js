var fs = require('fs');
var htmlMin = require('./htmlformat.js');
module.exports = function(file,cb) {
    fs.readFile(file,"utf8",function (error,data){
         if(error) throw error ;
         var _data = data;
         var head = 'dl_';
         var end = '_end';
         var reg = new RegExp(head + ".*" + end,"g");
         var result;
         while ((result = reg.exec(_data)) != null)  {
            var magic_text = result[0];
            var _reg = new RegExp(magic_text,"g");
            _data = _data.replace(_reg,'_' + (Math.round(Math.random() * 20901) + 19968).toString(16) + '_' + (Math.round(Math.random() * 20901) + 19968).toString(16));
        }
        _data = htmlMin(_data);
        cb(_data);
     }) ;
};
