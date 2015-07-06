var inFileName = 'Sambhota character.docx'
var outFileName = 'firstConverted.txt'


fs=require('fs')
var jszip=require('../jszip.min.js')
var sambotha=require('../sambotha.js')

var bin = fs.readFileSync(inFileName,'binary')

console.log('-', '"'+inFileName+'"', bin.length, 'bytes.')

var zip = new jszip(bin);
var xml = zip.file("word/document.xml").asText()

console.log('- unzip', xml.length, 'characters.')

var doc = sambotha.parse(xml)

console.log('-', doc.fonts.length, 'fonts,', doc.text.length, 'paragraphs.')

var uni = sambotha.convert(doc)
fs.writeFileSync(outFileName, uni)

console.log('- writing', '"'+outFileName+'"', uni.length, 'characters.')

