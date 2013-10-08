# DCSS
## Simple dynamic CSS. Nothing else. Really.

SASS and LESS are great and all, but sometimes your find yourself using a wrench to
replace a lightbulb. Things get sloppy, and no body likes sloppily disorganized code.

DCSS creates 'scoped' styles that can easily be added, altered, or removed. By default,
DCSS creates a 'global' scope, whose `style` element is automatically appended to the
`head` element of the document. The biggest benefit (and the real reason for the creation
of DCSS) is the ability to set style properties to functions, whose return value will
be the property value. As an example:

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


```JavaScript
DCSS.scope(); // returns all scopes
DCSS.scope('global'); // returns the global scope
DCSS.scope('new', {div: { width: '100%' }}); // creates the scope 'new' with a 'div' rule
```