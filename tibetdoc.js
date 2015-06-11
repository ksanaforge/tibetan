/* originally written by exebook@gmail.com */
/* 
	paragraph alignment logic
	1) center+ will not center current line, even if at line start
		a) but will center the remaining characters in this line
	2) center+ will center the line after LN
	3) center- will start new line without LN
	4) LN will carry out the formatting
	5) rules 1-2-3 applt ro right+/- (true even for 1.a)
	6) center+ is ignored between right+ and right-
		a) right inside center will screw the text, and let it out of page
	7) center+/right+ will modify next line of the same paragraph (word wrap)
		this is not possible to mimic in json/html
	1-7 were tested in reveal mode, but look different in normal mode
--
	8) fjust- will not start new line
	9) fjust+ will justify current line
*/

var state = {}, hash = {}

var states = {
	bold: 98,italic: 105,underline: 117,strike: 111,
	redline: 82,hilite1: 49,hilite2: 50,extra: 120,
	very: 118,large: 108,small: 115,fine: 102,
	left: 122,center: 101,right: 114,justify: 106,
}

var aligns = { 
	center: 1, right: 1, left:1, justify: 1
}

for (var i in states) state[i] = false, hash[states[i]] = i


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
			if (AnsiTibetan[a]) {
				var R = AnsiTibetan[a][b]
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
//			if (['left','center','right','justify'].indexOf(x.type) >= 0) {
//				if (R[R.length - 1].para.align == x.type) R.push(empty())
//				else R[R.length - 1].para.align = x.type
//			}
			if (aligns[x.type]) {
				R[R.length - 1].para.align = x.type
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
			} else if (c == 25 && s.charCodeAt(i + 1) == 70) {
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
		
		if (encoding == 'AnsiTibetan') mode = 16
		if (encoding == 'TibetanAnsi') mode = 17
		if (mode == 0) return 'Unknown encoding'
		for (var i = 0; i < s.length; i++) {
			var fontChanged = false
			var c = s.charCodeAt(i)
			if (c == 9) add_data({type:'tab'})
			else if (c == 12){ add_data({type:'pagebreak'}) }
			else if (c == 11) R.push(empty())
			else if (c < 16) console.log('unknown prefix:', c)
			else if (c <= 23) add_text(lookup(c, s.charCodeAt(++i)))
			else if (c == 32) add_text(' ')
			else if (c < 32) { processFormat() }
			else add_text(lookup(mode, c))
		}
		return R
	}
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
	require('./tohtml')
	AnsiTibetan = eval('x='+require('fs')
		.readFileSync('ansitable.js').toString())
	
	module.exports = {
		JSONToHTML:TibetDocJSONToHTML,
		parse:TibetDocParse,
		parseFile:parseFile
	};

	if (typeof process!=="undefined" && process.argv.length>2)	 {
		convertFile(process.argv[2]);
	}
	
} else {
	window.TibetDoc={Parse:TibetDocParse,JSONToHTML:TibetDocJSONToHTML};
}