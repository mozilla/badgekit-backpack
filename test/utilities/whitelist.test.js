const test = require('tap').test;
const checkWhitelist = require('../../lib/whitelist');

test('checkWhitelist ', function (t) {
  const list = [
    'ham',
    'eggs',
    'cheese',
    /^breads?$/,
  ];
  t.ok(checkWhitelist(list, 'ham'));
  t.ok(checkWhitelist(list, 'eggs'));
  t.ok(checkWhitelist(list, 'cheese'));
  t.ok(checkWhitelist(list, 'bread'));
  t.ok(checkWhitelist(list, 'breads'))

  t.notOk(checkWhitelist(list, 'breadss'));
  t.notOk(checkWhitelist(list, 'other stuff'));
  t.notOk(checkWhitelist(list, ' ham'));
  t.notOk(checkWhitelist(list, 'cheese    '));
  t.end();
})
