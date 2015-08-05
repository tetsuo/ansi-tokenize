# ansi-tokenize

transform stream to parse ansi art into control codes.

# example

```js
var tokenize = require('ansi-tokenize'),
    fs = require('fs');

var t = tokenize();
t.on('data', function (data) {
  console.log(data);
});

fs.createReadStream(__dirname + '/acid.ans', { encoding: 'binary' })
  .pipe(t);
```

generates:

```
[ 'command', 'sgr', [ 40 ] ]
[ 'command', 'ed', [ 2 ] ]
[ 'literal', 'hello' ]
[ 'command', 'sgr', [ 0, 33 ] ]
[ 'command', 'sc', [ NaN ] ]
[ 'command', 'rc', [ NaN ] ]
...
```

# api

```js
var tokenize = require('ansi-tokenize')
```

## var t = tokenize()

Returns a transform stream `t` that takes some old-school ansi art and produces rows of output.

The output rows are of the form:

* `[ type, text|action [, params] ]`

Row `type` can be either `command` or `literal`.

Supported [actions](http://www.vt100.net/docs/vt510-rm/contents) are:

* cursor up (`cuu`)
* cursor down (`cud`)
* cursor forward (`cuf`)
* cursor backward (`cub`)
* cursor position (`cup`)
* select graphics rendition (`sgr`)
* save cursor position (`sc`)
* restore cursor position (`rc`)
* erase in display (`ed`)

# license

mit