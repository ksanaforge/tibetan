// Transpiled from Elfu
/*
	KOUL - Ksana Open Unicode Layout - the Javascript or JSON representation 
	of a document created from TibetDoc.
*/

tags = {
	49: 'hilite1',
	50: 'hilite2',
	82: 'redline',
	98: 'bold',
	102: 'fine',
	105: 'italic',
	108: 'large',
	111: 'strike',
	115: 'small',
	117: 'underline',
	118: 'very',
	120: 'extra'
}

;
var aligns = {
	center: 1,
	right: 1,
	left: 1,
	full: 1,
	122: 'left',
	101: 'center',
	114: 'right',
	106: 'full'
}

function fillTags(a, b, c) {;
	var state = {}

	;
	var states = {
		bold: 98,
		italic: 105,
		underline: 117,
		strike: 111,
		redline: 82,
		hilite1: 49,
		hilite2: 50,
		extra: 120,
		very: 118,
		large: 108,
		small: 115,
		fine: 102,
	}

	for (var i in states) state[i] = false, state[states[i]] = i
	return state
}

function empty(align) {
	if (!align) align = 'left';
	return {
		align: align,
		flow: []
	}
}

function parseBlocks(dct, flowDecoder) {

	console.log('File size:', dct.length, 'bytes.')

	dct = dct.split('\r\n')

	console.log('Blocks found:', dct.length + '.')

	;
	var koul = {
		encoding: '',
		dct: dct,
		fontList: [],
		doc: [empty('left')]
	}
	for (var i = 0; i < dct.length; i++) {;
		var L = dct[i].split(String.fromCharCode(9))
		if (i == 1) koul.encoding = L[6], console.log('Encoding:', koul.encoding)
		if (i > 1 && L[0] == 'hdr' && L[1] == 'desiredfont') {
			koul.fontList.push(L[2])

			console.log('Font #' + koul.fontList.length + ':', L[2])
		}
		if (parseInt(L[0]) > 0 && L[1] == '!') {;
			var num = L[0]
			L = L.slice(2).join('\t')

			console.log('Text block #' + num + ':', L.length, 'bytes.')

			flowDecoder(L, koul)
		}
	}
	return koul
}

function lookup(a, b, c) { // code page, char code
	if (a == 21 || a == 22) return '?2x'
	var R
	if (AnsiTibetan[a]) R = AnsiTibetan[a][b]
	if (R == undefined || R.length == 0) return '?' + a + '-' + b
	return R
}

function add_data(koul, X) {;
	var para = koul.doc[koul.doc.length - 1]
	para.flow.push(X)
}

function add_text(koul, t) {;
	var para = koul.doc[koul.doc.length - 1];
	var tail = para.flow[para.flow.length - 1]
	if (tail && typeof (tail) == 'string')
		para.flow[para.flow.length - 1] += t
	else para.flow.push(t)
}

function decoder(str, koul) {;
	var codepage = 0;
	var align = []

	function effectiveAlign(a, b, c) { // this is just a guess, TibetDoc is probably more crzy.
		;
		var a = align[0]
		if (a == undefined) return 'left'
		if (a == 'right') return 'right'
		if (a == 'center') return 'center'
		if (align.length > 1) return align[1]
		return a
	};
	var tagState = {}
	if (koul.encoding == 'AnsiTibetan') codepage = 16
	if (koul.encoding == 'TibetanAnsi') codepage = 17;
	var i = 0
	while (i < str.length) {;
		var code = str.charCodeAt(i)
		if (code == 25) {
			i++;
			var subcode = str.charCodeAt(i);
			var args = ''
			while (str.charCodeAt(i + 1) == 27) {
				i += 2
				args += '' + str[i]
			};
			var ali = aligns[subcode];
			var tag = tags[subcode]
			if (tag) {
				if (tagState[tag]) delete tagState[tag]
				else tagState[tag] = 1;
				var O = {
					type: tag
				}
				if (tagState[tag]) O.open = true
				add_data(koul, O)
			}
			else if (ali) {
				if (ali == 'left') {
					koul.doc.push(empty('left'))
					align = []
				}
				else {;
					var io = align.indexOf(ali)
					if (io >= 0) { // Close align
						align.splice(io, 1)
						if (ali == 'right' || ali == 'center') {
							koul.doc.push(empty(effectiveAlign()))
						}
					}
					else {
						align.push(ali)
					}
					newAlign = 'left'
					if (align.length > 0) {;
						var para = koul.doc[koul.doc.length - 1]
						para.align = effectiveAlign()
					}
				}
			}
			else if (subcode == 99) {
				add_data(koul, {
					type: 'color',
					color: parseInt(args, 10)
				})
			}
			else if (subcode == 116) {
				add_data(koul, {
					type: 'tab'
				})
			}
			else if (subcode == 70) {;
				var n = args
				if (n[0] == '0') add_data(koul, {
					type: 'font',
					id: parseInt(n.substr(6, 3)) - 1,
					begin: n[2] == '0'
				});
				if (n[0] == '1') add_data(koul, {
					type: 'size',
					size: parseInt(n.substr(5, 3)),
					begin: n[2] == '0'
				});
			}
		}
		else if (code == 9) add_data(koul, {
			type: 'tab'
		})
		else if (code == 12) {
			koul.doc.push(empty(effectiveAlign()))
			add_data(koul, {
				type: 'pagebreak'
			})
			koul.doc.push(empty(effectiveAlign()))
		}
		else if (code == 11) koul.doc.push(empty(effectiveAlign()))
		else if (code < 16) console.log('unknown prefix:', code)
		else if (code <= 23) add_text(koul, lookup(code, str.charCodeAt(++i)))
		else if (code == 32) add_text(koul, ' ')
		else add_text(koul, lookup(codepage, code))
		i++
	}
	delete koul.encoding
	return koul
}

function dctToJson(binaryBlob) {;
	var H = parseBlocks(binaryBlob, decoder)
	return H
}

if (typeof (module) != 'undefined') {;
	var fs = require('fs')
	try {
		require('./html')
	}
	catch (e) {
		require('html.yy')
	}
	AnsiTibetan = eval('x=' + fs.readFileSync(__dirname +
		'/ansitable.js').toString())

	function parseFile(fname) {
		return dctToJson(fs.readFileSync(fname, 'binary').toString())
	}

	;
	var convertFile = function (input) {;
		var json = parseFile(input);
		var html = toHTML(json)
		fs.writeFileSync(input + '.html', html, 'utf8')
	}

	module.exports = {
		JSONToHTML: toHTML,
		parse: dctToJson,
		parseFile: parseFile
	}

	if (typeof (process) != 'undefined' && process.argv.length > 2)
		convertFile(process.argv[2])

}
else {
	window.TibetDoc = {
		Parse: dctToJson,
		JSONToHTML: toHTML
	};
}
