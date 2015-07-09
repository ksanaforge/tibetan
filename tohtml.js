/*
	Do not edit, this is obsolete, replaced by html.js(yy)
*/

var css ="body {font-size:150%}\n"
//TODO: remove completely (and test if ok)
//+"\tbold { font-weight: bold }\n"
//+"\titalic { font-style:italic }\n"
//+"\tunderline { text-decoration:underline }\n"
//+"\textra { font-size: 180% }\n"
//+"\tvery { font-size: 150% }\n"
//+"\tlarge { font-size: 120% }\n"
//+"\tsmall { font-size: 80% }\n"
//+"\tfine { font-size: 60% }\n"
//+"\tredline { text-decoration: none; border-bottom: 1px solid red; }\n"
//+"\thilite1 { color: 'red' }\n"
//+"\thilite2 { color: 'green' }\n"
//+"\n"
//+""

formatHeader = function() {
	return '<html><meta charset="utf8"><style>' + css + '</style>\n<body>'
}

TibetDocJSONToHTML = function(J) {
	var R = formatHeader()+TibetDocJSONToHTML_page(J)+"</body></html>";
	return R
}

function TibetDocJSONToHTML_page(J) {
	var R = [], style = {}, fonts = {}

	for (var i = 0; i < J.length; i++) {
		if (J[i].type == 'fonts') {
			fonts = J[i].fonts
		}
		else if (J[i].para) {
			var align = J[i].para.align
			var F = J[i].flow, text = ''
			for (var f = 0; f < F.length; f++) {
				if (typeof F[f] == 'string') text += F[f]
				else {
					var tags = ['bold', 'italic', 'underline', 'strike', 'redline', 'hilite1', 'hilite2','extra','very','large','small','fine']
					var stl = tags.indexOf(F[f].type)
					if (stl >= 0) {
						var tag = tags[stl]
						style[F[f].type] = !style[F[f].type]
						if (style[F[f].type]) text += '<'+tag+'>'
						else text += '</'+tag+'>'
						//TODO: replace with inline <font size=NNN> etc
					}
					else if (F[f].type == 'font') {
						if (F[f].begin) text += '<font face="'+fonts[F[f].id]+'">'
						else text += '</font>'
					}
					else if (F[f].type == 'size') {
						if (F[f].begin) text += '<font style="font-size:'+F[f].size+'pt">'
						else text += '</font>'
					}
					else if (F[f].type == 'tab') {
						text += '<code>&nbsp;&nbsp;</code>'
					}
					else if (F[f].type == 'pagebreak') {
						text += '<hr style="page-break-after:always;margin-top:200px">'
					}
					else if (F[f].type == 'color') {
						var C = parseInt(F[f].color).toString(16)
						while (C.length < 6) C = '0' + C
						var Z = C.substr(4,5) + C.substr(2,2) + C.substr(0,2)
						text += '<color style="color: #'+Z+'">'
					}
					else if(['left','center','right','justify']
						.indexOf(F[f].type) >= 0)
						align = F[f].type
				}
			}
			R.push('<p align="' + align + '"/>' + text)
		}
	}
	var s = R.join('');
	return s
}

