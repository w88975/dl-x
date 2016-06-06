module.exports = {
    encode: function(id) {
        var chars = 'abcdefghijklmnopqrstuvwxyz';
        var len = Math.floor(Math.random()*(3+1));
        var ranLen = Math.floor(Math.random()*(25+1));
        var str = '';
        for (var i = 0; i < 4; ++i) {
            str += chars[Math.floor(Math.random()*(25+1))];
            if (i === len) {
                str += id;
            }
        }
        return str;
    },
    decode: function(text) {
        var chars = 'abcdefghijklmnopqrstuvwxyz';
        var str='';
        for(var i =0; i < text.length; ++i) {
            if (chars.indexOf(text[i]) === -1) {
                str +=text[i];
            }
        }
        return str;
    },
};
