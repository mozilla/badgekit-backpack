module.exports = function checkWhitelist(list, needle) {
  for (var i = 0, pattern; i < list.length; i++) {
    pattern = list[i];
    if (typeof pattern === 'string') {
      if (pattern === needle) {
        return true;
      }
    }

    if (pattern instanceof RegExp) {
      if (pattern.test(needle)) {
        return true;
      }
    }
  }
  return false;
}
