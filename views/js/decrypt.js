function decrypt(text, pwd) {
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