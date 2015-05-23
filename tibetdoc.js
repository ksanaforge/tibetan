/* originally written by exebook@gmail.com */
var states = {
	bold: 98,italic: 105,underline: 117,strike: 111,
	redline: 82,hilite1: 49,hilite2: 50,extra: 120,
	very: 118,large: 108,small: 115,fine: 102,
	left: 122,center: 101,right: 114,justify: 106,
}

var state = {}, hash = []
for (var i in states) state[i] = false, hash[states[i]] = i

var TibetDocConversionTable = [,,,,,,,,,,,,,,,,[,,,,,,,,,,,,,,,,,,,,,,,
,,,,,,,,," ","!","\"","#","$","%","&","'","(",")","*","+",",","-",
".","/","0","1","2","3","4","5","6","7","8","9",":",";","{","=","}",
"?","@","A","B","C","D","E","F","G","H","I","J","K","L","M","N","O",
"P","Q","R","S","T","U","V","W","X","Y","Z","[","\\","]","^","_","`",
"a","b","c","d","e","f","g","h","i","j","k","l","m","n","o","p","q",
"r","s","t","u","v","w","x","y","z","{","|","}","~","","€","?","‚",
"ƒ","„","…","†","‡","ˆ","‰","Š","‹","Œ","?","Ž","?","?","‘","’","“",
"”","•","–","—","˜","™","š","›","œ","?","ž","Ÿ"," ","¡","¢","£","¤",
"¥","¦","§","¨","©","ª","«","¬","­","®","¯","°","±","²","³","´","µ","¶",
"·","¸","¹","º","»","¼","½","¾","¿","À","Á","Â","Ã","Ä","Å","Æ","Ç","È",
"É","Ê","Ë","Ì","Í","Î","Ï","Ð","Ñ","Ò","Ó","Ô","Õ","Ö","×","Ø","Ù","Ú",
"Û","Ü","Ý","Þ","ß","à","á","â","ã","ä","å","æ","ç","è","é","ê","ë","ì",
"í","î","ï","ð","ñ","ò","ó","ô","õ","ö","÷","ø","ù","ú","û","ü","ý","þ",
"ÿ"],[,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,"ཀ","ཁ","ག","ང","ཅ","ཆ","ཇ","ཉ","ཏ",
"ཐ","ད","ན","་","ཕ","བ","མ","ཙ","ཚ","ཛ","ཝ","ཞ","ཟ","འ","ཡ","ར","ལ","ཤ","ས",
"ཧ","ཨ","རྐ","རྒ","རྔ","རྗ","རྙ","རྟ","རྡ","རྣ","རྦ","རྨ","རྩ","རྫ","ལྐ","ལྒ",
"ལྔ","ལྕ","ལྗ","ལྟ","ལྡ","ལྤ","ལྦ","ལྷ","སྐ","སྒ","སྔ","སྙ","སྟ","སྡ","སྣ","སྤ",
"སྦ","སྨ","སྩ","ཀྱ","ཁྱ","གྱ","པྱ","ཕྱ","བྱ","མྱ","ཀྲ","ཁྲ","གྲ","ཏྲ","ཐྲ","དྲ",
"པྲ","ཕྲ","བྲ","མྲ","ཤྲ","སྲ","ཧྲ","ཀླ","གླ","བླ","ཟླ","རླ","སླ","རྐྱ","རྒྱ","རྨྱ",
"རྒྭ","རྩྭ",,"སྒྱ","སྤྱ","སྦྱ","སྨྱ","སྐྲ","སྒྲ","སྣྲ","སྤྲ","སྦྲ","སྨྲ","ཀྭ","ཁྭ",
"གྭ","ཅྭ",,"ཏྭ","དྭ","ཙྭ","ཚྭ","ཞྭ","ཟྭ","རྭ","ཤྭ","སྭ","ཧྭ","གྲྭ","དྲྭ","ཕྱྭ","ཧ",
"ཉྭ",,"ྭ"," ","ཱ","ཱ","ཱ","ཱ","ུ",,"ུ","ུ","ུ","ཊ","ཋ","ཌ","ཎ","ཥ","ཀྵ","ུ","ུ",
"ུ","ུ","ཀ","ག","ཉ","ཏ","ད","ན","ཞ","ཤ","ཧ","རྟ","༠","༡","༢","༣","༤","༥","༦","༧",
"༨","༩","༅","༄༅","།","༑","༈","༌","༔",
//"ྎ",
"༴",
"༼","༽","༄","ཱ","ཱ","ཱུ","ཱུ","ཱུ","ཱུ","ཱུ",
"ཱུ","ཱུ","ི","ི","ྀ","ུ","ུ","ུ","ུ","ུ","ུ","ུ","ུ","ུ","ེ","ེ","ཻ","ོ","ོ","ཽ",
"ཾ","ཿ","ཾ","ྃ","ྂ","ིཾ","ིཾ","ྀཾ","ེཾ","ེཾ","ཻཾ","ོཾ","ོཾ","ཽཾ","྄","པ","སྐྱ"],
[,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,"ཀྐ","ཀྑ","ཀྔ","ཀྩ","ཀྟ","ཀྟྱ","ཀྟྲ","ཀྟྲྱ",
"ཀྟྭ","ཀྠ","ཀྠྱ","ཀྞ","་","ཀྣྱ","ཀྥ","ཀྨ","ཀྨྱ","ཀྲྱ","ཀྴ","ཀྶ","ཀྶྣ","ཀྶྨ","ཀྶྱ",
"ཀྶྭ","ྈྐ","ྈྑ","ཁྑ","ཁྣ","ཁླ","གྒ","གྒྷ","གྙ","གྡ","གྡྷ","གྡྷྱ","གྡྷྭ","གྣ","གྣྱ",
"གྤ","གྦྷ","གྦྷྱ","གྨ","གྨྱ","གྲྱ","གྷ","གྷྒྷ","གྷྙ","གྷྣ","གྷྣྱ","གྷྨ","གྷླ","གྷྱ",
"གྷྲ","གྷྭ","ངྐ","ངྐྟ","ངྐྟྱ","ངྐྱ","ངྑ","ངྑྱ","ངྒ","ངྒྲ","ངྒྱ","ངྒྷ","ངྒྷྱ","ངྒྷྲ",
"ངྔ","ངྟ","ངྣ","ངྨ","ངྱ","ངླ","ངྴ","ངྷ","ངྐྵ","ངྐྵྭ","ངྐྵྱ","ཙྩ","ཙྪ","ཙྪྭ","ཙྪྲ",
"ཙྙ","ཙྣྱ","ཙྨ","ཙྱ","ཙྲ","ཙླ","ཙྷྱ","ཚྠ","ཚྪ","ཚྱ","ཚྲ","ཚླ","ཛྫ",,"ཛྫྭ","ཛྫྷ",
"ཛྷྫྷ","ཛྙ","ཛྙྱ","ཛྣ","ཛྣྭ","ཛྨ","ཛྱ","ཛྲ","ཛྭ","ཛྷ","ཛྷྱ","ཛྷྲ",,"ཛྷྭ","ཉྩ","ཉྩྨ",
"ཉྩྱ","ཉྪ","ཉྫ","ཉྫྱ","ཉྫྷ","ཉྙ","ཉྤ","ཉྥ","ཉྱ","ཉྲ","ཉླ","ཉྴ",,"ཊྚ"," ","ཊྤ","ཊྨ",
"ཊྱ","ཊྭ","ཊྶ",,"ཋྲ","ཌྒ","ཌྒྱ","ཌྒྷ","ཌྒྷྲ","ཌྜ","ཌྜྷ","ཌྜྷྱ","ཌྣ","ཌྨ","ཌྱ","ཌྲ",
"ཌྭ","ཌྷ","ཌྷྜྷ","ཌྷྨ","ཌྷྱ","ཌྷྲ","ཌྷྭ","ཎྚ","ཎྛ","ཎྜ","ཎྜྻ","ཎྜྼྱ","ཎྜྷ","ཎྞ","ཎྡྲ",
"ཎྨ","ཎྱ","ཎྭ","ཏྐ","ཏྐྲ","ཏྐྶ","ཱ","ཱ","ཱ","ཱ","ཱ","ཱ","ཱ","ཱ",,,"ཱུ","ཱུ","ཱུ","ཱུ",
"ཱུ","ཱུ","ཱུ","ཱུ",,,,,,"ུ","ུ","ུ","ུ","ུ","ུ","ུ","ུ",,,,,,,,,,,,,,,,,,,"ཛྷླ",
"ཊྐ","ཋྱ","ཀྣ","ཛྫྙ","ཊྚྷ"],[,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,"ཏྐྭ","ཏྙ","ཏྛ",
"ཏྟ","ཏྟྱ","ཏྟྲ","ཏྟྭ","ཏྠ","ཏྠྱ","ཏྣ","ཏྣྱ","ཏྤ","་","ཏྥ","ཏྨ","ཏྨྱ","ཏྱ","ཏྼྣ",
"ཏྶ","ཏྶྠ","ཏྶྣ","ཏྶྣྱ","ཏྶྨ","ཏྶྨྱ","ཏྶྱ","ཏྶྲ","ཏྶྭ","ཏྲྱ","ཏྭྱ","ཏྐྵ","ཐྱ","ཐྭ",
"དྒ","དྒྱ","དྒྲ","དྒྷ","དྒྷྲ","དྫ","དྡ","དྡྱ","དྡྲ","དྡྭ","དྡྷ","དྡྷྣ","དྡྷྱ","དྡྷྲ",
"དྡྷྭ","དྣ","དྦ","དྦྲ","དྦྷ","དྦྷྱ","དྦྷྲ","དྨ","དྱ","དྲྱ","དྭྱ","དྷ","དྷྣ","དྷྣྱ",
"དྷྨ","དྷྱ","དྷྲ","དྷྲྱ","དྷྭ","ནྐ","ནྐྷ",,"ནྒྷ","ནྔ","ནྫ","ནྫྱ","ནྜ","ནྟ","ནྟྱ",
"ནྟྲ","ནྟྲྱ","ནྟྭ","ནྟྶ","ནྠ","ནྡ","ནྡྡ","ནྡྡྲ","ནྡྱ","ནྡྲ","ནྡྷ","ནྡྷྲ","ནྡྷྱ","ནྣ",,
"ནྣྱ","ནྤ","ནྤྲ","ནྥ",,"ནྦྷྱ","ནྩ","ནྱ","ནྲ","ནྭ","ནྭྱ","ནྶ","ནྶྱ","ནྷ","ནྷྲ","པྟ",
"པྟྱ","པྟྲྱ","པྣ",,"པྤ","པྨ","པླ","པྭ","པྶ","པྶྣྱ","པྶྭ","པྶྱ","བྒྷ","བྫ","བྡ","བྡྫ",
"བྡྷ","བྡྷྭ","བྟ",,"བྦ"," ","བྦྷྱ","བྨ","བྷ","བྷྞ","བྷྣ",,"བྷྱ","བྷྲ","བྷྭ","མྙ","མྞ",
"མྣ","མྣྱ","མྤ","མྤྲ","མྥ","མྦ","མྦྷ","མྦྷྱ","མྨ","མླ","མྭ","མྶ","མྷ","ཡྻ","ཡྲ","ཡྭ",
"ཡྶ","རྑ","རྒྷ","རྒྷྱ","རྩྱ","རྪ","རྫྙ","རྫྱ","རྚ","རྛ","རྜ","རྞ","ཱ","ཱ","ཱ","ཱ",
"ཱ","ཱ","ཱ","ཱ",,,"ཱུ","ཱུ","ཱུ","ཱུ","ཱུ","ཱུ","ཱུ","ཱུ",,,,,,"ུ","ུ","ུ","ུ","ུ","ུ",
"ུ","ུ",,,,,,,,,,,,,,,,,,,"པྣྱ","བྣ","བྷྨ","ཏྤྲ","ནྨ","བྦྷ"],
[,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,"རྟྭ","རྟྟ","རྟྶ","རྟྶྣ","རྟྶྣྱ","རྠ","རྠྱ",
"རྡྡྷ","རྡྡྷྱ","རྡྱ","རྡྷ","རྡྷྨ","་","རྡྷྲ","རྤ","རྦྤ","རྦྦ","རྦྷ","རྨྨ","རྻ","རྴ",
"རྴྱ","རྵ","རྵྞ","རྵྞྱ","རྵྨ","རྵྱ","རྶ","རྷ","རྐྵ","ལྒྭ","ལྦྱ","ལྨ","ལྱ","ལྭ","ལླ",
"ཝྱ","ཝྲ","ཤྩ","ཤྩྱ","ཤྪ","ཤྞ","ཤྣ","ཤྤ","ཤྦྱ","ཤྨ","ཤྱ","ཤྲྱ","ཤླ","ཤྭྒ","ཤྭྱ","ཤྴ",
"ཥྐ","ཥྐྲ","ཥྚ","ཥྚྱ","ཥྚྲ","ཥྚྲྱ","ཥྚྭ","ཥྛ","ཥྛྱ","ཥྞ","ཥྞྱ","ཥྜ","ཥྤ","ཥྤྲ","ཥྨ",
"ཥྱ","ཥྭ","ཥྵ","སྐྶ","སྑ","སྩྱ","སྚ","སྛ","སཏྱ","སཏྲ","སཏྭ","སྡྱ","སྡྱ","སྣྱ","སྣྭ",
"སྥ","སྥྱ","སྱ","སྲྭ","སྶ","སྶྭ","སྷ","སྭྱ","ཧྙ","ཧྞ","ཧྟ","ཧྣ",,"ཧྤ","ཧྥ","ཧྨ","ཧྱ",
"ཧླ","ཧྶ","ཧྶྭ","ཧྭྱ","ཀྵྞ","ཀྵྨ","ཀྵྨྱ","ཀྵྱ","ཀྵྼ","ཀྵླ",,"ཨྱ","ཨྲ","ཨྲྱ"
,,,,,,,,,,,,,,,,,,,,,,,,,,,,"ར","༹","ྱ","ྲ","྅","ྈ","༁","ྀཨཚི",,,,,,,,
"ཊྣ","ཏྒ","པྡ","ཥྠ","ཀྭྱ","ཎྜྲ","ཝྺ","ཝྣ","རྺ","ལྷྭ",,,"ཱ","ཱ","ཱ","ཱ","ཱ",
"ཱ","ཱ","ཱ",,,"ཱུ","ཱུ","ཱུ","ཱུ","ཱུ","ཱུ","ཱུ","ཱུ",,,,,,"ུ","ུ","ུ","ུ","ུ",
"ུ","ུ","ུ",,,,,,,,,,,,,,,,,,,"ཀྵྭ",,,"རྡྷྱ","ཧྣྱ"]];



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
			L = L.slice(2)
			var R = []
			for (var i = 0; i < L.length; i++) 
			R.push(decode(L[i]))
			return R
		}
	}

	function lookup(a, b) {
		try {
			var R = TibetDocConversionTable[a][b]
			if (R == undefined) console.log('encoding error: ', a, b)
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
			else if (c == 0xB) R.push(empty())
			else if (c < 0x10) console.log('unknown prefix:', c)
			else if (c <= 0x15) add_text(lookup(c, s.charCodeAt(++i)))
			else if (c == 0x20) add_text(' ')
			else if (c < 0x21) processFormat()
			else add_text(lookup(mode, c))
		}
		return R
	}
}

var css =
"\tbold { font-weight: bold }\n"
+"\titalic { font-style:italic }\n"
+"\tunderline { text-decoration:underline }\n"
+"\textra { font-size: 24pt }\n"
+"\tvery { font-size: 18pt }\n"
+"\tlarge { font-size: 14pt }\n"
+"\tsmall { font-size: 10pt }\n"
+"\tfine { font-size: 8pt }\n"
+"\tredline { text-decoration: none; border-bottom: 1px solid red; }\n"
+"\thilite1 { color: 'red' }\n"
+"\thilite2 { color: \"green\" }\n"
+"\n"
+""

formatHeader = function() {
	return '<html><meta charset="utf8"><style>' + css + '</style>\n<body>'
}
function TibetDocJSONToHTML(J) {
	return formatHeader()+J.map(TibetDocJSONToHTML_page).join("\n")+"</body></html>";
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
					var stl = tags
						.indexOf(F[f].type)
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
			R.push('<p align="' + align + '">' + text)
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
	fs.writeFileSync(input+".html",html.join("\n"),"utf8");
}
if (typeof module!="undefined") {
	module.exports={JSONToHTML:TibetDocJSONToHTML, parse:TibetDocParse, parseFile:parseFile};
	if (process.argv.length>2)	 {
		convertFile(process.argv[2]);
	}

} else {
	window.TibetDoc={Parse:TibetDocParse,JSONToHTML:TibetDocJSONToHTML};
}