var test = require('tape'),
    tokenize = require('./');

test('unchunked', function (t) {
  var i = -1;
  var expected = [
    [ 'code', 'm', [ 31 ] ],
    [ 'text', 'hello' ],
    [ 'code', 'm', [ 39 ] ],
    [ 'code', 'm', [ 22 ] ],
    [ 'text', 'world' ],
  ];
  t.plan(expected.length);
  tokenize()
    .on('data', function (data) {
      t.deepEqual(data, expected[++i]);
    })
    .end('\x1b[31mhello\x1b[39m\x1b[22mworld');
});

test('chunked', function (t) {
  var i = -1, s = tokenize();
  var expected = [
    [ 'code', 'm', [ 31, 5 ] ],
    [ 'text', 'hello' ],
    [ 'code', 'm', [ 39 ] ],
    [ 'code', 'm', [ 22 ] ],
    [ 'text', 'world' ],
  ];
  t.plan(expected.length);
  s.on('data', function (data) {
    t.deepEqual(data, expected[++i]);
  });
  s.write('\x1b');
  s.write('[');
  s.write('31;5mhe');
  s.write('llo');
  s.write('\x1b');
  s.write('[39m\x1b[2');
  s.write('2mw');
  s.write('o');
  s.end('rld');
});

test('events', function (t) {
  t.plan(1);
  var expected = [ 1, 2, 3 ];
  var s = tokenize();
  s.on('sgr', function (data) {
    t.deepEqual(data, expected);
  });
  s.end('\x1b[1;2;3m');
});
