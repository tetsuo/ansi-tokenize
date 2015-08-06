# ansi-tokenize

transform stream to tokenize ansi into escape codes and literals.

# example

```js
var tokenize = require('ansi-tokenize');
tokenize()
  .on('data', function (data) {
    console.log(data);
  })
  .on('sgr', function (args) {
    console.log(args);
  })
  .end('\x1b[31mso ansi\x1b[1;2;3mLsD\x1b[22m1993');
```

generates this output:

```
[ 'code', 'm', [ 31 ] ]
[ 31 ]
[ 'text', 'so ansi' ]
[ 'code', 'm', [ 1, 2, 3 ] ]
[ 1, 2, 3 ]
[ 'text', 'LsD' ]
[ 'code', 'm', [ 22 ] ]
[ 22 ]
[ 'text', '1993' ]
```

# api

```js
var tokenize = require('ansi-tokenize')
```

## var t = tokenize()

Returns a transform stream `t` that takes ANSI encoded string and produces rows of output.

The output rows are of the form:

* `[ type, text|name [, params] ]`

Row `type` can be either `code` or `text`.

# events

Following [control functions](http://www.vt100.net/docs/vt510-rm/chapter5) are also emitted:

* cursor up                 (`cuu`)
* cursor down               (`cud`)
* cursor forward            (`cuf`)
* cursor backward           (`cub`)
* cursor position           (`cup`)
* select graphics rendition (`sgr`)
* save cursor position      (`sc`)
* restore cursor position   (`rc`)
* erase in display          (`ed`)

# license

mit