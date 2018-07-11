var rep = { // 替换用的数据，使用了4个零宽字符，数据量减少了一半。
    '00': '\u200b',
    '01': '\u200c',
    '10': '\u200d',
    '11': '\uFEFF'
};

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

function tounicode(data)
{
   if(data == '') return '请输入汉字';
   var str =''; 
   for(var i=0;i<data.length;i++)
   {
      str+="\\u"+parseInt(data[i].charCodeAt(0),10).toString(16);
   }
   var arr = str.split('\\u')
   var newStr = ''
   for (let index = 1; index < arr.length; index++) {
        newStr+= '\\u200b'+('\\u'+arr[index])
   }
   return newStr;
}

console.log(tohanzi(tounicode('​登​ ​录')))

var zeroWidth = ['\\u200b','\\u200c','\\u200d','\\uFEFF']

function encrypt(text, pwd) {
    
    var _zarr = text.split('')
    var _newZStrs = ''
    for (let i = 0; i < _zarr.length; i++) {
        var idx = Math.floor(Math.random()*4)
        _newZStrs += ( _zarr[i]+ tohanzi(zeroWidth[idx]))
    }
    return _newZStrs
}

var a = encrypt('我爱你')

console.log(a == '我爱你')
console.log(a)

