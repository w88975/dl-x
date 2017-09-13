// var code = require('./lib/incode.js');
// console.log(code.encode(8));

function en(text, pwd) {
    var arr1 = text.split('')
    var arr2 = pwd.split('')
    var offset = 0;
    arr2.map(function (item) {
        offset += item.charCodeAt()
    })
    var str2 = '';
    for (var index = 0; index < arr1.length; index++) {
        var charCode = arr1[index].charCodeAt() + offset
        str2 = str2 + (String.fromCharCode(charCode))
    }
    return str2
}

function de(text, pwd) {
    var arr1 = text.split('')
    var arr2 = pwd.split('')
    var offset = 0;
    arr2.map(function (item) {
        offset += item.charCodeAt()
    })
    var str2 = '';
    for (var index = 0; index < arr1.length; index++) {
        var charCode = arr1[index].charCodeAt() - offset
        str2 = str2 + (String.fromCharCode(charCode))
    }
    return str2
}

console.log(en('富家大室放假了打扫房间', 'kWexkTCymNkz'))
console.log(de('遦鐂嗔黻逰籰', 'fmzeMZCaPeRk'))