function randomString(len) {
    len = len || 32;
    var $chars = 'ABCDEFHJKMNPQRSTWX_YZabcdefhijkmprstwxyz';    /****默认去掉了容易混淆的字符oOLl,9gq,Vv,Uu,I1****/
    var maxPos = $chars.length;
    var pwd = '';
    for (i = 0; i < len; i++) {
        pwd += $chars.charAt(Math.floor(Math.random() * maxPos));
    }
    return pwd;
}

var imgArr = {}

module.exports = {

    cns: function () {

    },

    en: function () {
        var arr = []
        for (var index = 0; index < 100; index++) {
            arr.push(randomString(10))
        }
        return arr
    },

    cssFmt: function (str) {
        var strs = str.split(';')
        var arr = [];
        for (var i = 0; i < strs.length; i++) {
            arr[i] = strs[i];
        }
        arr.sort(function () { return 0.5 - Math.random() })
        arr.forEach((item, i) => {
            if (item === '') {
                delete arr[i]
            }
        })
        console.log(arr)
        var str2 = arr.join(';');
        return str2
    },

    ranImg: function (name) {
        var rstr = randomString(32)
        imgArr[rstr] = name
        return '/bnx/' + rstr
    },

    imgArr: imgArr
}