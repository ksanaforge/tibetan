// Transpiled from Elfu
var css = 'body {font-size:200%;font-family:"microsoft himalaya";' +
	'margin-left:100px;margin-right:100px}\n' +
	'\tp { text-indent: 0px }\n' + '\n' + ''

;
var styleTag = {
	bold: 'font-weight: bold;',
	italic: 'font-style: italic;',
	unterline: 'text-decoration: underline;',
	fine: 'font-size: 60%;',
	small: 'font-size: 80%;',
	large: 'font-size: 120%;',
	very: 'font-size: 170%;',
	extra: 'font-size: 200%;',
	strike: 'text-decoration:line-through;',
	redline: 'text-decoration:underline;text-decoration-color:red;',
	hilite1: 'color:red;',
	hilite2: 'color:green;',
}

toHTML = function (a, b, c) {;
	var html = [];
	var pairTags = {
		bold: 1,
		italic: 1,
		underline: 1,
		small: 1,
		large: 1,
		very: 1,
		extra: 1,
		fine: 1,
		hilite1: 1,
		hilite2: 1,
		strike: 1,
		redline: 1
	}

	;
	var style = {};
	var span = false

	function endSpan(a, b, c) {
		if (span) html.push('</span>')
		span = false
	}

	function newSpan(a, b, c) {;
		var s = ''
		for (var i in style) s += styleTag[i]
		if (s.length > 0) {
			html.push('<span style="' + s + '">')
			span = true
		}
	}

	//	html ⬊ ('<span style="color:black">')
	for (var i = 0; i < a.doc.length; i++) {
		para = a.doc[i];
		var flow = para.flow
		endSpan()

		if (para.align == 'full')
			html.push('<p align=justify>')
		else
			html.push('<p align=' + para.align + '>')
		newSpan()
		for (var f = 0; f < flow.length; f++) {
			if (typeof (flow[f]) == 'string')
				html.push(flow[f])
			else {;
				var tag = flow[f];
				var s = ''
				if (pairTags[tag.type]) {
					if (tag.open) style[tag.type] = true
					else delete style[tag.type]
					endSpan()
					newSpan()
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
					html.push('<font color="#' + Z + '">')
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
