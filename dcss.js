var DCSS = (function() {
	var scopes  	= {},
		selectors 	= [],
		psuedos 	= [];

	createScope('global');

	function processSelectors(styles) {
		var getSelectors 	= /([\#\.\w]*)\s*([^#\.\s]+)\s*([\w\#\.]+)$/,
			output 			= {},
			sel, tokens, result;

		for(var p in styles) {
			result = null;
			selector = p;

			if(typeof styles[p] !== 'string') {
				for(var s in selectors) {
					tokens = (selector.match(getSelectors) || []).slice(1);
					if(tokens.length) {
						sel = tokens.splice(1,1)[0].replace(/^\s+|\s+$/g, '');
						if(selectors[s].value === sel) {
							result = selectors[s].process.apply(this, tokens.concat([selector, styles[p]]));
							if(/object/.test(result.toString())) {
								for(var p in result) output[p] = result[p];
							}
						}
					}
				}
			}

			if(!result) output[selector] = styles[selector];
		}

		return output;
	}

	function createRules(styles, scope) {
		var scopes 		= [],
			rules 		= [],
			styles 		= processSelectors(styles);

		for(var s in styles) {
			if(/object/.test(styles[s].toString())) {
				scopes.push([styles[s], (scope||'') + ' ' + s]);
				delete styles[s];
			}
		}

		if(scope) {
			var ruleText 	= ['{'],
				name  		= '';

			for(s in styles) {
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
		return scopes[name];
	}

	function add(styles, root) {
		if(root && !scopes[root]) createScope(root);

		var sheet = scopes[root] || scopes.global,
			rules = createRules(styles, root || undefined);

		rules.forEach(function(rule) {
			sheet.appendChild(document.createTextNode(rule.join(' ').replace(',', ';')));
		});
	}

	function clear(scopeName) {
		scopes[scopeName].innerHTML = '';
	}

	function createSelector(selector, fn) {
		selectors.push({
			value 	: selector,
			process : fn
		});
	}

	return {
		add 	: add,
		clear 	: clear,
		scope 	: createScope,
		selector: createSelector
	};
})();