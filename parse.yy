/*
	KOUL - Ksana Open Unicode Layout - the Javascript or JSON representation 
	of a document created from TibetDoc.
*/

tags = {
	49: 'hilite1', 50: 'hilite2', 82: 'redline', 98: 'bold',
	102: 'fine', 105: 'italic', 108: 'large', 111: 'strike',
	115: 'small', 117: 'underline', 118: 'very', 120: 'extra'
}

aligns ∆ {
	center: 1, right: 1, left:1, full: 1,
	122: 'left', 101: 'center', 114: 'right', 106: 'full'
}

➮ fillTags {
	state ∆ {}
	
	states ∆ {
		bold: 98,italic: 105,underline: 117,strike: 111,
		redline: 82,hilite1: 49,hilite2: 50,extra: 120,
		very: 118,large: 108,small: 115,fine: 102,
	}
	
	⧗ (∇ i in states) stateⁱ = ⦾, state[statesⁱ] = i
	$ state
}

➮ empty align { ⌥ (!align) align = 'left'⦙$ { align: align, flow: [] } }

➮ parseBlocks dct flowDecoder {

	ロ'File size:', dct ↥, 'bytes.'

	dct = dct⌶'\r\n'

	ロ'Blocks found:', dct ↥ + '.'
	
	koul ∆ { encoding:'', dct: dct, fontList: [], doc:[ empty('left') ] }
	i ⬌ dct {
		L ∆ dctⁱ⌶(∼◬9)
		⌥ (i ≟ 1) koul.encoding = L⁶, ロ 'Encoding:', koul.encoding
		⌥ (i > 1 && L⁰ ≟ 'hdr' && L¹ ≟ 'desiredfont') {
			koul.fontList ⬊(L²)

			ロ'Font #'+koul.fontList ↥+':', L²
		}
		⌥ (★(L⁰) > 0 && L¹ ≟ '!') {
			num ∆ L⁰
			L = L⋃2⫴'\t'

			ロ'Text block #' + num + ':', L ↥, 'bytes.'

			flowDecoder(L, koul)
		}
	}
	$ koul
}

➮ lookup { // code page, char code
	⌥ (a == 21 || a == 22) $ '?2x'
	∇ R
	⌥ (AnsiTibetanᵃ) R = AnsiTibetanᵃᵇ
	⌥ (R ≟ ∅ || R↥ ≟ 0) $ '?'+a+'-'+b
	$ R
}

➮ add_data koul X {
	para ∆ koul.docꕉ
	para.flow ⬊ X
}

➮ add_text koul t {
	para ∆ koul.docꕉ
	tail ∆ para.flowꕉ
	⌥ (tail && ⬤ tail ≟ 'string') 
		para.flowꕉ += t
	⎇ para.flow ⬊ t
}

➮ decoder str koul {
	codepage ∆ 0
	align ∆ []
	➮ effectiveAlign { // this is just a guess, TibetDoc is probably more crzy.
		a ∆ align⁰
		⌥ (a ≟ ∅) $ 'left'
		⌥ (a ≟ 'right') $ 'right'
		⌥ (a ≟ 'center') $ 'center'
		⌥ (align↥ > 1) $ align¹
		$ a
	}
	tagState ∆ {}
	⌥ (koul.encoding ≟ 'AnsiTibetan') codepage = 16
	⌥ (koul.encoding ≟ 'TibetanAnsi') codepage = 17
	i ∆ 0
	⧖ (i < str↥) {
		code ∆ str ◬ i
		⌥ (code ≟ 25) {
			i++
			subcode ∆ str ◬ i
			args ∆ ''
			⧖ (str ◬(i+1) ≟ 27) {
				i += 2
				args += '' + strⁱ
			}
			ali ∆ aligns[subcode]
			tag ∆ tags[subcode]
			⌥ (tag) {
				⌥ (tagState[tag]) ⏀ tagState[tag]
				⎇ tagState[tag] = 1
				O ∆ { type: tag }
				⌥ (tagState[tag]) O.open = ⦿
				add_data(koul, O)
			}
			⥹ (ali) {
				⌥ (ali ≟ 'left') {
					koul.doc.push(empty('left'))
					align = []
				} ⎇ {
					io ∆ align ≀ ali
					⌥ (io >= 0) { // Close align
						align ⨄ (io, 1)
						⌥ (ali ≟ 'right' || ali ≟ 'center') {
							koul.doc.push(empty(effectiveAlign()))
						}
					} ⎇ {
						align ⬊ ali
					}
					newAlign = 'left'
					⌥ (align↥ > 0) {
						para ∆ koul.docꕉ
						para.align = effectiveAlign()
					}
				}
			}
			⥹ (subcode ≟ 99) {
				add_data(koul, {type:'color', color:★(args, 10)})
			}
			⥹ (subcode ≟ 116) {
				add_data(koul, { type: 'tab' })
			}
			⥹ (subcode ≟ 70) {
				n ∆ args
				⌥ (n⁰ ≟ '0') add_data(koul, {
					type: 'font',
					id: ★(n ⩪ (6, 3)) - 1, 
					begin: n² ≟ '0'
				});
				⌥ (n⁰ ≟ '1') add_data(koul, {
					type: 'size',
					size: ★(n ⩪ (5, 3)),
					begin: n² == '0'
				});
			}
		}
		⥹ (code ≟  9) add_data(koul, { type: 'tab' })
		⥹ (code ≟ 12) {
			koul.doc.push(empty(effectiveAlign()))
			add_data(koul, { type: 'pagebreak' })
			koul.doc.push(empty(effectiveAlign()))
		}
		⥹ (code ≟ 11) koul.doc.push(empty(effectiveAlign()))
		⥹ (code < 16) ロ 'unknown prefix:', code
		⥹ (code <=23) add_text(koul, lookup(code, str◬(++i)))
		⥹ (code ≟ 32) add_text(koul, ' ')
		⎇ add_text(koul, lookup(codepage, code))
		i++
	}
	⏀ koul.encoding
	$ koul
}

➮ dctToJson binaryBlob {
	H ∆ parseBlocks(binaryBlob, decoder)
	$ H
}

⌥ (⬤module ≠ '∅') {
	fs ∆ ≣'fs'
	try { ≣'./html' } catch(e) { ≣ 'html.yy' }
	AnsiTibetan = eval('x='+⛁(__dirname+'/ansitable.js')≂)

	➮ parseFile fname {
		$ dctToJson(⛁(fname, 'binary')≂)
	}
	
	convertFile ∆ ➮ (input) {
		json ∆ parseFile(input)
		html ∆ toHTML(json)
		⛃ (input + '.html', html, 'utf8')
	}

	module.exports = {
		JSONToHTML:toHTML,
		parse:dctToJson,
		parseFile:parseFile
	}
	
	⌥ (⬤ process != '∅' && process.argv↥ > 2) convertFile(process.argv²)
	
} else {
	window.TibetDoc = { Parse:dctToJson, JSONToHTML:toHTML };
}

