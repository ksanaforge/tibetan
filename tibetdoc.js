/* originally written by exebook@gmail.com */
var states = {
	bold: 98,italic: 105,underline: 117,strike: 111,
	redline: 82,hilite1: 49,hilite2: 50,extra: 120,
	very: 118,large: 108,small: 115,fine: 102,
	left: 122,center: 101,right: 114,justify: 106,
}
var state = {}, hash = []
for (var i in states) state[i] = false, hash[states[i]] = i

if (module && module.exports) TibetDocConversionTable = eval('x='+require('fs').readFileSync('ansitable.js').toString())


TibetDocConversionTable[17][32] = ' '
// main function, provide NO extension to file name 

TibetDocParse = function (D) {
	var encoding = ''
	var fontList = []
	D = D.split('\r\n')
	
	// Scan headers
	for (var i = 0; i < D.length; i++) {
		var L = D[i].split(String.fromCharCode(9))
		if (i == 1) encoding = L[6], console.log('encoding', encoding)
		if (i > 1 && L[0] == 'hdr' && L[1] == 'desiredfont')
			fontList.push(L[2])
		if (L[0] == '1' && L[1] == '!') {
			L = L.slice(2).join('\t')
			return decode(L)
		}
	}

	function lookup(a, b) {
		try {
			if (a == 21 || a == 22) return '?2x'
			if (TibetDocConversionTable[a]) {
				var R = TibetDocConversionTable[a][b]
			}
			if (R == undefined || R.length == 0) {
				return '?'+a+'-'+b
//				 console.log('encoding error: ', a, b)
			}
			return R
		} catch (e) {
			console.log(e)
			console.log('data: ', a, b)
		}
	}

	function empty() { return { para:{align:'none'}, flow:[]} }

	function decode(s) {
		var fontStack = [{face:'Default', size:10, color:'#000000'}]
		var mode = 0, R = [{type:'fonts', fonts:fontList}, empty()]

		function add_text(t) {
			var flow = R[R.length - 1].flow
			var tail = flow[flow.length - 1]
			if (typeof tail == 'string') flow[flow.length - 1] += t
			else flow.push(t)
		}
		function add_data(x) { 
			if (['left','center','right','justify'].indexOf(x.type) >= 0) {
				if (R[R.length - 1].para.align == x.type) R.push(empty())
				else R[R.length - 1].para.align = x.type
			}
			else R[R.length - 1].flow.push(x)
		}

		function read27() { // this is how integers are saved in TibetDoc
			i += 2
			var n = ''
			while (s.charCodeAt(i) == 27) {
				n += s.charAt(i+1)
				i += 2
			}
			i--
			return n
		}
		
		function processFormat() {
			if (c == 25 && s.charCodeAt(i + 1) == 99) {
				add_data({type:'color', color:parseInt(read27(), 10)})
			} else if (c == 25 && s.charCodeAt(i + 1) == 116) {
				// "Line indent", aka "i>>"
				add_text(' ')
				// add_data({type: 'tab'})
			} else if (c == 25 && s.charCodeAt(i + 1) == 0x46) {
				var n = read27()
				if (n[0] == '0') add_data({
						type: 'font',
						id: parseInt(n.substr(6, 3)) - 1, 
						begin: n[2] == '0'
					});
				if (n[0] == '1') add_data({
						type: 'size',
						size: parseInt(n.substr(5, 3)),
						begin: n[2] == '0'
					});
			} else {
				var b = s.charCodeAt(++i)
				if (c == 25 && hash[b] != undefined)
					add_data ({ type: hash[b] })
				else add_data ({type: '?', a:c, b:b})
			}
		}
		
		if (encoding == 'AnsiTibetan') mode = 0x10
		if (encoding == 'TibetanAnsi') mode = 0x11
		if (mode == 0) return 'Unknown encoding'
		for (var i = 0; i < s.length; i++) {
			var fontChanged = false
			var c = s.charCodeAt(i)
			if (c == 0x9) add_data({type:'tab'})
			else if (c == 12){ add_data({type:'pagebreak'}) }
			else if (c == 0xB) R.push(empty())
			else if (c < 0x10) console.log('unknown prefix:', c)
			else if (c <= 23) add_text(lookup(c, s.charCodeAt(++i)))
			else if (c == 0x20) add_text(' ')
			else if (c < 0x21) { processFormat(); i++ }
			else add_text(lookup(mode, c))
		}
		return R
	}
}

var css ="body {font-size:150%}\n"
+"\tbold { font-weight: bold }\n"
+"\titalic { font-style:italic }\n"
+"\tunderline { text-decoration:underline }\n"
+"\textra { font-size: 180% }\n"
+"\tvery { font-size: 150% }\n"
+"\tlarge { font-size: 120% }\n"
+"\tsmall { font-size: 80% }\n"
+"\tfine { font-size: 60% }\n"
+"\tredline { text-decoration: none; border-bottom: 1px solid red; }\n"
+"\thilite1 { color: 'red' }\n"
+"\thilite2 { color: 'green' }\n"
+"\n"
+""

formatHeader = function() {
	return '<html><meta charset="utf8"><style>' + css + '</style>\n<body>'
}
function TibetDocJSONToHTML(J) {
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
//					if (F[f] == undefined) continue
					console.log('->', F[f], f, i+'/'+J.length)
					var tags = ['bold', 'italic', 'underline', 'strike', 'redline', 'hilite1', 'hilite2','extra','very','large','small','fine']
					var stl = tags.indexOf(F[f].type)
					if (stl >= 0) {
						var tag = tags[stl]
						style[F[f].type] = !style[F[f].type]
						if (style[F[f].type]) text += '<'+tag+'>'
						else text += '</'+tag+'>'
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
var parseFile=function(fn) {
	var fs=require("fs");
	var str=fs.readFileSync(fn,'binary');
	return TibetDocParse(str);
}
var convertFile=function(input) {
	var fs=require("fs");
	var str=fs.readFileSync(input,'binary');
	var data=TibetDocParse(str);
	html = TibetDocJSONToHTML(data);
	fs.writeFileSync(input+".html",html,"utf8");
}
if (typeof module!=="undefined") {
	module.exports={JSONToHTML:TibetDocJSONToHTML, parse:TibetDocParse, parseFile:parseFile};

	if (typeof process!=="undefined" && process.argv.length>2)	 {
		convertFile(process.argv[2]);
	}
	
} else {
	window.TibetDoc={Parse:TibetDocParse,JSONToHTML:TibetDocJSONToHTML};
}