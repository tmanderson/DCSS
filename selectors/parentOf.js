DCSS.selector('<-', function(a, b, fullSelector, styles) {
	var id 			= (a.match(/\#([\w_-][\d\w_-]+)/) || [])[1],
		classes 	= (a.match(/\.([\w_-][\d\w_-]+)/g) || []).slice(1),
		tag 		= (a.match(/^([\w_-]+)/) || [])[1],
		children 	= document.querySelectorAll(b),
		selector 	= '.isParentOf_' + b.replace(/\.\#/, ''),
		output 		= {};

	function isParentMatch(el) {
		if(id && el.id !== id) return false;
		for(var c in classes) if(!~el.className.indexOf(classes[c])) return false;
		if(tag && el.nodeName.toLowerCase() !== tag) return false;
		return true;
	}

	output[a + selector] = styles;

	for(var i = 0; i < children.length; i++) {
		if(isParentMatch(children[i].parentNode)) {
			children[i].parentNode.className += selector.replace('.', ' ');
		}
	}

	return output;
});