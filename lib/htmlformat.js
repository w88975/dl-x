module.exports = function style_html(html_source) {
    var source = html_source;
    var sourceLength = source.length;
	if(sourceLength==0){
		return '';
	}
    var rep = /\n+/g;
    var repone = /<!--.*?-->/ig;
    var reptwo = /\/\*.*?\*\//ig;
    var reptree = /[ ]+</ig;
    var sourceZero = source.replace(rep,"");
    var sourceOne = sourceZero.replace(repone,"");
    var sourceTwo = sourceOne.replace(reptwo,"");
    var sourceTree = sourceTwo.replace(reptree,"<");
    return sourceTree;
}
