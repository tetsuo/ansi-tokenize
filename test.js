var test = require('tap').test;
var tokenize = require('./');

test(function (t) {
  t.plan(1);

  var expected = [
    [ 'command', 'sgr', [ '31' ] ],
    [ 'literal', 'hello' ],
    [ 'command', 'sgr', [ '39' ] ],
    [ 'command', 'sgr', [ '22' ] ],
    [ 'literal', ' world' ]
  ];

  var s = tokenize(), actual = [];

  s.on('data', function (data) {
    actual.push(data);
  });

  s.on('end', t.deepEqual.bind(t, expected, actual));
  s.end('\x1b[31mhello\x1b[39m\x1b[22m world');
});

