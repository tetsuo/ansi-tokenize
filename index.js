var through = require('through2');

// http://www.vt100.net/docs/vt510-rm/chapter5
var actions = {
  'A': 'cuu',    // cursor up
  'B': 'cud',    // cursor down
  'C': 'cuf',    // cursor forward
  'D': 'cub',    // cursor backward
  'f': 'cup',    // cursor position
  'H': 'cup',    // cursor position
  's': 'sc',     // save cursor position
  'u': 'rc',     // restore cursor position
  'm': 'sgr',    // select graphics rendition
  'J': 'ed'      // erase in display
};

module.exports = tokenize;

function tokenize () {
  var re = /(?:\x1b\x5b)([\?=;0-9]*?)([ABCDfHsumJ])/g,
      buf = '';

  return through.obj(write, flush);

  function write (row, enc, cb) {
    var m, i, args;

    buf += Buffer.isBuffer(row) ? row.toString('binary') : row;

    do {
      i = re.lastIndex;
      m = re.exec(buf);

      if (m !== null) {
        if (m.index > i) {
          args = buf.slice(i, m.index);
          this.push([ 'text', args ]);
          this.emit('text', args);
        }

        if (actions.hasOwnProperty(m[2])) {
          args = m[1].split(';').map(int);
          this.push([ 'code', m[2], args ]);
          this.emit(actions[m[2]], args);
        }
      }
    } while (re.lastIndex !== 0);

    buf = buf.slice(i);
    cb();
  }

  function flush (cb) {
    if (buf.length)
      this.push([ 'text', buf ]);
    cb();
  };
};

function int (s) { return parseInt(s, 10) }