var DCSS = (function() {
	var scopes = {};

	createScope('global');

	function createRules(styles, scope) {
		var scopes 	= [],
			rules 	= [];

		for(var s in styles) {
			if(/object/.test(styles[s].toString())) {
				scopes.push([styles[s], (scope||'') + ' ' + s]);
				delete styles[s];
			}
		}

		if(scope) {
			var ruleText 	= ['{'],
				name  		= '';

			for(var s in styles) {
				name = s.replace(/[A-Z]/g, '-$&').toLowerCase();
				if(typeof styles[s] === 'function') styles[s] = styles[s]();
				ruleText.push(['\t', name, ': ', styles[s], ';', '\n'].join(''));
			}

			rules.push([scope, ruleText.join('\n') + '}']);
		}

		for(var s in scopes) {
			rules = rules.concat(createRules.apply(this, scopes[s]));
		}

		return rules;
	}

	function createScope(name, styles) {
		if(!name) return scopes;

		var el = document.createElement('style');
		el.setAttribute('data-scope', name);
		el.setAttribute('rel', 'stylesheet');
		document.querySelector('head').appendChild(el);

		scopes[name] = el;
		if(styles) add(styles, name);
		return scopes[name]
	}

	function add(styles, root) {
		if(root && !scopes[root]) createScope(root);

		var sheet = scopes[root] || scopes.global,
			rules = createRules(styles, root || undefined);

		rules.forEach(function(rule) {
			sheet.appendChild(document.createTextNode(rule.join(' ').replace(',', ';')));
		});
		console.log(scopes)
	}

	function clear(scopeName) {
		scopes[scopeName].innerHTML = '';
	}

	return {
		add 	: add,
		clear 	: clear,
		scope 	: createScope
	};
})();