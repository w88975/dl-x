var fs = require('fs')
var cssStr = fs.readFileSync(process.cwd() + '/csshack.test.css').toString()
var copy = cssStr;
// 匹配css name
var reg = new RegExp(/(\.+(\w+)(,))|(\.+(\w+)(:))|(\.+(\w+)(\s))|(#+(\w+)(\s))/g)
// 匹配classname
var classReg = new RegExp(/(\.+(\w+)(,))|(\.+(\w+)(:))|(\.+(\w+)(\s))|(#+(\w+)(\s))/g)
var i = 0;

function replaceIndex(str, idx, length, newStr) {
    return str.substring(0, idx) + newStr + str.substring(idx + length)
}

var offset = 0;
while (reg.lastIndex >= 0) {
    try {
        var str = reg.exec(cssStr)[0];
        // .replace(/#/g, '')
        var rplStr = str.replace(/\./g, '').replace(/:/g, '').replace(/\ /g, '').replace(/,/g, '')
        var newStr = `<%=sha('${rplStr}')%>`
        var idx = reg.lastIndex
        copy = replaceIndex(copy, idx - str.length + 1 + offset, rplStr.length, newStr)

        offset += (newStr.length - rplStr.length)
    } catch (e) {
        // console.log(e)
        break;
    }
    i++;
}
fs.writeFileSync('./newcss.html', copy.toString())

// TODO 查找html标签内的class 
x.match(/(class\="(\w+\s)")/g)
