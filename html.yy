css ∆ 'body {font-size:200%;font-family:"microsoft himalaya";margin-left:100px;margin-right:100px}\n'
+ '\tbold { font-weight: bold }\n'
+ '\titalic { font-style:italic }\n'
+ '\tunderline { text-decoration:underline }\n'
+ '\textra { font-size: 180% }\n'
+ '\tvery { font-size: 150% }\n'
+ '\tlarge { font-size: 120% }\n'
+ '\tsmall { font-size: 80% }\n'
+ '\tfine { font-size: 60% }\n'
+ '\tredline { text-decoration: none; border-bottom: 1px solid red; }\n'
+ '\thilite1 { color: "red" }\n'
+ '\thilite2 { color: "green" }\n'
+ '\tp { text-indent: 0px }\n'
+ '\n'
+ ''

toHTML = ➮ {
	html ∆ []
	pairTags ∆ { 
		bold:1, italic:1, underline:1, small:1, large:1,
		very:1, extra:1, fine:1, hilite1:1, hilite2:1, strike:1, redline:1 }
	i ⬌ a.doc {
		para = a.docⁱ
		flow ∆ para.flow
		⌥ (para.align ≟ 'full')
			html ⬊ ('<p style="text-align:justify;">')
		⎇
			html ⬊ ('<p align=' + para.align + '>')
		f ⬌ flow {
			⌥ (⬤(flowᶠ) ≟ 'string')
				html ⬊ (flowᶠ)
			⎇ {
				tag ∆ flowᶠ
				s ∆ ''
				⌥ (pairTags[tag.type]) {
					⌥ (tag.type ≟ 'bold') s = 'b'
					⥹ (tag.type ≟ 'underline') s = 'u'
					⥹ (tag.type ≟ 'italic') s = 'i'
					⎇ s = tag.type
					⌥ (!tag.open) s = '/' + s
					html ⬊ ('<' + s + '>')
				}
				⥹ (tag.type == 'font') {
					⌥ (tag.begin) html ⬊ ('<font face="'+a.fontList[tag.id]+'">')
					⎇ html ⬊ '</font>'
				}
				⥹ (tag.type == 'size') {
					⌥ (tag.begin) html ⬊ ('<font style="font-size:'+tag.size+'pt">')
					⎇ html ⬊ '</font>'
				}
				⥹ (tag.type ≟ 'color') {
					C ∆ ★(tag.color) ≂(16)
					⧖ (C↥ < 6) C = '0' + C
					Z ∆ C⩪(4,5) + C⩪(2,2) + C⩪(0,2)
					html ⬊ ('<color style="color: #'+Z+'">')
				}
				⥹ (tag.type ≟ 'tab') {
					html ⬊ '<code>&nbsp;&nbsp;</code>'
				}
				⥹ (tag.type ≟ 'pagebreak') {
					html ⬊ '<hr style="page-break-after:always;margin-top:100px;margin-bottom:100px">'
				}
			}
		}
	}
	$ '<html><meta charset="utf8"><style>' + css + '</style>\n<body>' + html⫴''
}

