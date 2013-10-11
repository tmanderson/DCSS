# DCSS
## Simple dynamic CSS. Nothing else. Really.

SASS and LESS are great and all, but sometimes your find yourself using a wrench to
replace a lightbulb. Things get sloppy, and no body likes sloppily disorganized code.
Out of the box, DCSS adds **style scopes**, **dynamic values** and an interface to add
**custom selectors**.

### Style Scopes
DCSS creates 'scoped' styles that can easily be added, altered, or removed. By default,
DCSS creates a 'global' scope, whose `style` element is automatically appended to the
`head` element of the document.

### Dynamic Values
Dynamic values are just plain CSS attributes whose values are a JavaScript function that
when executed, returns the value to be assigned. As an example:

```JavaScript
DCSS.add({
	h2: {
		width: function() {
			return document.body.offsetWidth + 'px';
		}
	}
});
```

The above would add the following output to the already created 'global' stylesheet:

```JavaScript
h2 {
	width: 1820px;
}
```

assuming that the body's offsetWidth is 1820px.

### Custom Attributes
Custom attributes enable the ability to add custom attributes to your DCSS declarations.
When a custom attribute is encountered by the DCSS parser, it will call the associated
function along with it. Custom attributes enable you to do a lot of things, since the
associated function is passed its selectors context, the full selector, as well as the
styles associated with it. As an example:

```JavaScript
DCSS.selector('<~', function(leftSelector, rightSelector, fullSelector, styles) {
	var sibs = document.querySelectorAll(rightSelector),
		output = {};

	output.isPreviousSiblingOf = styles;

	for(var i = 0; i < sibs.length; i++) {
		if(sibs[i].previousElementSibling.webkitMatchesSelector(leftSelector)) {
			sibs[i].previousElementSibling.className += ' isPreviousSiblingOf';
		}
	}

	return output;
});
```

This would enable a `previousSibling` CSS selector, which means that a style such as
`h2 <~ h3` would style all `h2` elements whose next sibling is an `h3` element.

### API
#### `add(styles, [scope])`
Add a new set of styles to a pre-existing set (via the `scope` argument). Styles are
given as an object, where keys are selectors and values can be numbers, strings, or
functions that will be evaluated (and the return value used) when added.

```JavaScript
DCSS.add({
	html: {
		padding: 0,
		margin: '0 auto',

		body: {
			padding: 0,
			marginTop: '10px'
		},

		div: {
			width: function() {
				//	any divs that are within the html element will be the width
				//	of the document
				return document.body.offsetWidth + 'px';
			}
		}
	}
});
```

#### `clear(scope)`
Remove all styles from within a created scope.

```JavaScript
DCSS.clear('global');
```

#### `scope([scope, styles])`
Create, or retrieve a scope. `scope` is basically a flipped alternative to `add`
where the only difference is it returns a reference to the scope.

#### `selector(sel, function)`
Create a custom selector by providing the selector as a string (e.g. `<~`) and a
function that will be called whenever the selector is encountered. The supplied
function is given a total of four arguments, `leftSelector`, `rightSelector`, `fullSelector`,
and `styles`. Your function should return a set of styles that will be assigned to their
specified scope.

```JavaScript
DCSS.scope(); // returns all scopes
DCSS.scope('global'); // returns the global scope
DCSS.scope('new', {div: { width: '100%' }}); // creates the scope 'new' with a 'div' rule
```