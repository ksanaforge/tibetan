var abridge=require("../abridge");
var assert=require("assert");
describe("abridge",function(){
	it("abridgeCenter",function(){
		var c=abridge.middle("ཆུང་སྤངས་ཏེ་དང་པོ་རབ་འབྱུང་དཀའ། །རབ་བྱུང་ཐོབ་ནས་ཡུལ་སྤྱད་དག་གིས་དགའ་ཐོབ་དཀའ། །",{left:1,right:1,sep:"…"});
		assert.equal(c,"ཆུང་…དཀའ། །");
	});
	it("abridgeCenter",function(){
		var c=abridge.middle("ཆུང་སྤངས་ཏེ་དང་པོ་རབ་འབྱུང་དཀའ། །རབ་བྱུང་ཐོབ་ནས་ཡུལ་སྤྱད་དག་གིས་དགའ་ཐོབ་དཀའ། །");
		assert.equal(c,"ཆུང་སྤངས་ཏེ་...དགའ་ཐོབ་དཀའ། །");
	})
});