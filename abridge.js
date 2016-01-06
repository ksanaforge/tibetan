var middle=function(text,opts){
	opts=opts||{};
	opts.sep=opts.sep||"...";
	opts.left=opts.left||3;
	opts.right=opts.right||opts.left;
	
	left_syl=opts.left;
	right_syl=opts.right;

	var terminator=/[་࿒།༎༏༐༑༒]/;
	var tokens=[],last=0;
	text.replace(/[༠-ྼ]+/g,function(e,idx){
		tokens.push(text.substring(last,idx));
		last=idx;
	});
	tokens.push(text.substring(last));
	tokens.shift();

	if (tokens.length<left_syl+right_syl) return tokens.join("");
	return tokens.slice(0,left_syl).join("")+opts.sep+tokens.slice(tokens.length-right_syl).join("");
} 
module.exports={middle:middle};