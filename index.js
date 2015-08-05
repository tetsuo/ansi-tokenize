var through = require('through2'),
    split = require('split'),
    combine = require('stream-combiner2');

var commands = { // http://www.vt100.net/docs/vt510-rm/chapter5
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

module.exports = function () {

  return combine(split(), tokenize());

  function tokenize () {
    var re = /(?:\x1b\x5b)([\?=;0-9]*?)([ABCDfHsumJ])/g;

    return through.obj(function (row, enc, cb) {
      var i = 0, m, params,
          row = row.toString();

      row = row.split(String.fromCharCode(0x1a), 1)[0];

      do {
        i = re.lastIndex;
        m = re.exec(row);

        if (m !== null) {
          if (m.index > i)
            this.push([ 'literal', row.slice(i, m.index) ]);
          if (commands.hasOwnProperty(m[2]))
            this.push([ 'command', commands[m[2]], m[1].split(';').map(toint) ]);
        }
      } while (re.lastIndex !== 0);

      if (i < row.length)
        this.push([ 'literal', row.slice(i) ]);

      cb();
    });
  }
};

function toint (s) { return parseInt(s, 10) }