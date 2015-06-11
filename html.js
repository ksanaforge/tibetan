// Transpiled from Elfu
var css =
	'body {font-size:200%;font-family:"microsoft himalaya";margin-left:100px;margin-right:100px}\n' +
	'\tbold { font-weight: bold }\n' +
	'\titalic { font-style:italic }\n' +
	'\tunderline { text-decoration:underline }\n' +
	'\textra { font-size: 180% }\n' + '\tvery { font-size: 150% }\n' +
	'\tlarge { font-size: 120% }\n' + '\tsmall { font-size: 80% }\n' +
	'\tfine { font-size: 60% }\n' +
	'\tredline { text-decoration: none; border-bottom: 1px solid red; }\n' +
	'\thilite1 { color: "red" }\n' + '\thilite2 { color: "green" }\n' +
	'\tp { text-indent: 0px }\n' + '\n' + ''

toHTML = function (a, b, c) {;
	var html = [];
	var pairTags = {
		bold: 1,
		italic: 1,
		underline: 1
	}
	for (var i = 0; i < a.doc.length; i++) {
		para = a.doc[i];
		var flow = para.flow
		if (para.align == 'full')
			html.push('<p style="text-align:justify;">')
		else
			html.push('<p align=' + para.align + '>')
		for (var f = 0; f < flow.length; f++) {
			if (typeof (flow[f]) == 'string')
				html.push(flow[f])
			else {;
				var tag = flow[f];
				var s = ''
				if (pairTags[tag.type]) {
					if (tag.type == 'bold') s = 'b'
					else if (tag.type == 'underline') s = 'u'
					else if (tag.type == 'italic') s = 'i'
					if (!tag.open) s = '/' + s
					html.push('<' + s + '>')
				}
				else if (tag.type == 'font') {
					if (tag.begin) html.push('<font face="' + a.fontList[tag.id] +
						'">')
					else html.push('</font>')
				}
				else if (tag.type == 'size') {
					if (tag.begin) html.push('<font style="font-size:' + tag.size +
						'pt">')
					else html.push('</font>')
				}
				else if (tag.type == 'color') {;
					var C = parseInt(tag.color).toString(16)
					while (C.length < 6) C = '0' + C;
					var Z = C.substr(4, 5) + C.substr(2, 2) + C.substr(0, 2)
					html.push('<color style="color: #' + Z + '">')
				}
				else if (tag.type == 'tab') {
					html.push('<code>&nbsp;&nbsp;</code>')
				}
				else if (tag.type == 'pagebreak') {
					html.push(
						'<hr style="page-break-after:always;margin-top:100px;margin-bottom:100px">'
					)
				}
			}
		}
	}
	return '<html><meta charset="utf8"><style>' + css +
		'</style>\n<body>' + html.join('')
}
