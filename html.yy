css ∆ 'body {font-size:200%;font-family:"microsoft himalaya";'
+ 'margin-left:100px;margin-right:100px}\n'
+ '\tp { text-indent: 0px }\n'
+ '\n'
+ ''

styleTag ∆ {
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

toHTML = ➮ {
	html ∆ []
	pairTags ∆ { 
		bold:1, italic:1, underline:1, small:1, large:1,
		very:1, extra:1, fine:1, hilite1:1, hilite2:1, strike:1, redline:1 }

	style ∆ {}  span ∆ ⦾

	➮ endSpan {
		⌥ (span) html ⬊ '</span>'
		span = ⦾
	}

	➮ newSpan {
		s ∆ ''
		⧗ (∇ i in style) s += styleTagⁱ
		⌥ (s↥ > 0) {
			html ⬊ ('<span style="'+ s +'">')
			span = ⦿
		}
	}

//	html ⬊ ('<span style="color:black">')
	i ⬌ a.doc {
		para = a.docⁱ
		flow ∆ para.flow
		endSpan()
	
		⌥ (para.align ≟ 'full')
			html ⬊ ('<p align=justify>')
		⎇
			html ⬊ ('<p align=' + para.align + '>')
		newSpan()
		f ⬌ flow {
			⌥ (⬤(flowᶠ) ≟ 'string')
				html ⬊ (flowᶠ)
			⎇ {
				tag ∆ flowᶠ
				s ∆ ''
				⌥ (pairTags[tag.type]) {
					⌥ (tag.open) style[tag.type] = ⦿
					⎇ ⏀ style[tag.type]
					endSpan()
					newSpan()
				}
				⥹ (tag.type == 'font') {
					⌥ (tag.begin) html ⬊ ('<font face="'+a.fontList[tag.id]+'">')
					⎇ html ⬊ '</font>'
				}
				⥹ (tag.type == 'size') {//todo: check if can be open/close at all
					⌥ (tag.begin) html ⬊ ('<font style="font-size:'+tag.size+'pt">')
					⎇ html ⬊ '</font>'
				}
				⥹ (tag.type ≟ 'color') {
					C ∆ ★(tag.color) ≂(16)
					⧖ (C↥ < 6) C = '0' + C
					Z ∆ C⩪(4,5) + C⩪(2,2) + C⩪(0,2)
					html ⬊ ('<font color="#'+Z+'">')
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

