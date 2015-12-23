var inFileName = 'Sambhota character.docx'
var outFileName = 'Output.html'


fs=require('fs')
var jszip=require('../jszip.min.js')
var sambotha=require('../sambotha.js')

var bin = fs.readFileSync(inFileName,'binary')

console.log('-', '"'+inFileName+'"', bin.length, 'bytes.')

var zip = new jszip(bin);
var xml = zip.file("word/document.xml").asText()

console.log('- unzip', xml.length, 'characters.')

var doc = sambotha.docxToJson(xml)
sambotha.toUnicode(doc)
var htm = sambotha.jsonToHtml(doc)

console.log('-', doc.fonts.length, 'fonts,', doc.text.length, 'text runs.')

fs.writeFileSync(outFileName, htm)

console.log('- writing', '"'+outFileName+'"', htm.length, 'characters.')

