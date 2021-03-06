var sha256 = require('crypto-js/sha256')
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

function randomString2(len) {
    var pwd = '';
    for (i = 0; i < len; i++) {
        pwd += String.fromCharCode(Math.round(Math.random() * 20901))
    }
    return pwd;
}

// String.fromCharCode(Math.round(Math.random() * 20901))

var imgArr = {}

var zeroWidth = ['\\u200b','\\u200c','\\u200d','\\uFEFF']

function tohanzi(data)
{
    if(data == '') return '请输入十六进制unicode';
    data = data.split("\\u");
    var str ='';
    for(var i=0;i<data.length;i++)
    {
        str+=String.fromCharCode(parseInt(data[i],16).toString(10));
    }
    return str;
}

function encrypt(text, pwd) {
    var _zarr = text.split('')
    var _newZStrs = ''
    if (text === 'u' || text === 'p' || text ==='uid' ||text === 'mid' || text==='tz') {
        _newZStrs = text
    } else {
        for (let i = 0; i < _zarr.length; i++) {
            var idx = Math.floor(Math.random()*4)
            _newZStrs += ( _zarr[i]+ tohanzi(zeroWidth[idx]))
        }
    }

    var arr1 = _newZStrs.split('')
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

var _ranStr =  {
    ranString: randomString2,
    cns: function () {

    },
    count: 0,
    sha: function (str) {
        return "_" + sha256(_ranStr.count.toString()).toString() + sha256(str).toString()
    },
    en: function () {
        var arr = []
        for (var index = 0; index < 300; index++) {
            arr.push(randomString(10))
        }
        return arr
    },

    en2: function (key) {
        var arr = []
        for (var index = 0; index < 300; index++) {
            arr.push(`${key}_${index}_${key}`)
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
        var str2 = arr.join(';');
        return str2
    },

    ranImg: function (name) {
        var rstr = randomString(32)
        imgArr[rstr] = name
        return '/bnx/' + rstr
    },

    ranRp: function (text) {
        var _text = ''
        for(var i =0;i<text.length;i++){
            _text = _text+ '‌'+text[i];
        }
        var key = randomString(12)
        var val = encrypt(_text, key)
        return {
            val, key
        }
    },
    ranRp_2: function (text) {
        var _text = text
        var key = randomString(12)
        var val = encrypt(_text, key)
        return {
            val, key
        }
    },

    imgArr: imgArr
}

module.exports = _ranStr;