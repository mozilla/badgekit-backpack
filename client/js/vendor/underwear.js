(function() {
  if (!Object.defineProperty || !(function () { try { Object.defineProperty({}, 'x', {}); return true; } catch (e) { return false; } } ())) {
    var orig = Object.defineProperty;
    Object.defineProperty = function (o, prop, desc) {
      if (orig) {
        try { return orig(o, prop, desc); } catch (e) {}
      }
      if (o !== Object(o)) { throw new Error("Object.defineProperty called on non-object"); }
      if (Object.prototype.__defineGetter__ && ('get' in desc)) {
        Object.prototype.__defineGetter__.call(o, prop, desc.get);
      }
      if (Object.prototype.__defineSetter__ && ('set' in desc)) {
        Object.prototype.__defineSetter__.call(o, prop, desc.set);
      }
      if ('value' in desc) {
        o[prop] = desc.value;
      }
      return o;
    };
  }

  this.uw = {
    defineMethod: function(prototype, method, func) {
      if (!prototype[method]) {
        Object.defineProperty(prototype, method, {
          writeable: false,
          configurable: false,
          enumerable: false,
          value: func
        });
      }
    },

    defineAlias: function(prototype, method, alias) {
      if (prototype[method]) {
        Object.defineProperty(prototype, alias, {
          writeable: false,
          configurable: false,
          enumerable: false,
          value: prototype[method]
        });
      }
    },

    requiresUnderscore: function(method) {
      if (typeof _ === 'undefined') {
        throw new Error(method + ' requires underscore.js');
      }
    }
  };
})();


function isTypeof(constructor, suspect) {
  return suspect.constructor == constructor;
}

function isNotTypeof(constructor, suspect) {
  return suspect.constructor != constructor;
}

isEqual = _.isEqual;

isArguments = _.isArguments;

isObject = _.isObject;

isArray = _.isArray;

isString = _.isString;

isNumber = _.isNumber;

isBoolean = _.isBoolean;

isFunction = _.isFunction;

isDate = _.isDate;

isRegExp = _.isRegExp;

isNaN = _.isNaN;

isNull = _.isNull;

isElement = _.isElement;

isUndefined = _.isUndefined;

isUndefined = _.isUndefined;

sequence = _.uniqueId;

function uid() {
  function S4() {
    return ((( 1 + Math.random()) * 0x10000) | 0).toString(16).substring(1);
  }
  return S4() + S4() + "-" + S4() + "-" + S4() + "-" + S4() + "-" + S4() + S4() + S4();
}

function isDefined(suspect) {
  return !_.isUndefined(suspect);
}
(function() {
  var methods = [
    'each', 'keys', 'values', 'pairs', 'invert',
    'functions', 'pick', 'omit', 'defaults', 'map'
  ];

  _.each(methods, function(method) {
    uw.defineMethod(Object.prototype, method, function() {
      return _[method].apply(this, [this].concat(_.toArray(arguments)));
    });
  });

  var aliases = { extend: 'mixin', clone: 'dup', has: 'defines' };

  _.each(aliases, function(alias, method) {
    uw.defineMethod(Object.prototype, alias, function() {
      return _[method].apply(this, [this].concat(_.toArray(arguments)));
    });
  });





  uw.defineMethod(Object.prototype, "bindAll", function() {
    var context = this;
    _.functions(this).each(function(func) {
      var original = context[func];
      context[func] = function() {
        return original.apply(context, arguments);
      };
    });
  });
})();
(function() {
  var methods = [
    "all", "any", "collect", "compact", "contains", "countBy",
    "detect", "difference", "every", "filter", "find", "findWhere", "first",
    "flatten", "foldr", "groupBy", "include", "indexOf", "initial",
    "inject", "intersection", "invoke", "isEmpty", "last", "lastIndexOf",
    "map", "max", "min", "pluck", "reduce", "reduceRight", "reject",
    "rest", "select", "shuffle", "size", "some", "sortBy", "sortedIndex",
    "tail", "take", "toArray", "union", "uniq", "without", "zip"
  ];

  _.each(methods, function(method) {
    uw.defineMethod(Array.prototype, method, function() {
      return _[method].apply(_, [this].concat(_.toArray(arguments)));
    });
  });

  uw.defineMethod(Array.prototype, 'sum', function() {
    return _.reduce(this, function(memo, num) {
      return memo + num;
    }, 0);
  });

  uw.defineMethod(Array.prototype, 'second', function() {
    return this[1];
  });

  uw.defineMethod(Array.prototype, 'third', function() {
    return this[2];
  });

  uw.defineMethod(Array.prototype, 'isEmpty', function() {
    return _.isEmpty.call(this, this);
  });

  uw.defineMethod(Array.prototype, 'isNotEmpty', function() {
    return !_.isEmpty.call(this, this);
  });

  uw.defineMethod(Array, 'range', function() {
    return _.range.apply([], arguments);
  });

})();
var Template = (function() {

  function Template(src) {
    if (src.match(/^#/)) {
      this.src = document.getElementById(src.replace(/^#/, '')).innerHTML;
    }
    else {
      this.src = src;
    }
  }

  Template.prototype.render = function(data, settings) {
    return _.template(this.src, data, settings);
  };

  return Template;
})();
(function() {
  uw.defineMethod(String.prototype, "capitalize", function() {
    uw.requiresUnderscore("capitalize");
    return this.charAt(0).toUpperCase() + this.slice(1);
  });

  uw.defineMethod(String.prototype, "trim", function() {
    return this.replace(/^\s+(.+)\s+$/, "$1");
  });

  uw.defineMethod(String.prototype, "ltrim", function() {
    return this.replace(/^\s+/, "");
  });

  uw.defineMethod(String.prototype, "rtrim", function() {
    return this.replace(/\s+$/, "");
  });

  uw.defineMethod(String.prototype, "compact", function() {
    return this.replace(/\s/g, "");
  });

  uw.defineMethod(String.prototype, "singleSpace", function() {
    return this.trim().replace(/\s{1,}/g, " ");
  });

  uw.defineMethod(String.prototype, "titleize", function() {
    uw.requiresUnderscore("titleize");
    return _(this.replace(/([A-Z])/g, " $1").replace(/-|_/g, " ").split(/\s/)).map(function(s) {
      return s.capitalize();
    }).join(" ");
  });

  uw.defineAlias(String.prototype, "titleize", "titleCase");

  uw.defineMethod(String.prototype, "dasherize", function() {
    return this.replace(/_/g, '-').toLowerCase();
  });

  uw.defineMethod(String.prototype, "humanize", function() {
    return this.replace(/_/g, ' ').replace(/^\s?/, "").toLowerCase().capitalize();
  });

  uw.defineMethod(String.prototype, "hyphenate", function() {
    return this.replace(/([A-Z])/g, " $1").toLowerCase().replace(/\s|_/g, '-').toLowerCase();
  });

  uw.defineMethod(String.prototype, "isBlank", function() {
    return (/^(\s?)+$/).test(this);
  });

  uw.defineMethod(String.prototype, "isPresent", function() {
    return this.length > 0 && !this.isBlank();
  });

  uw.defineMethod(String.prototype, "truncate", function(length) {
    return (this.length > length) ? this.substring(0, length) + '...' : this;
  });

  uw.defineMethod(String.prototype, "toNumber", function() {
    return this * 1 || 0;
  });

  uw.defineMethod(String.prototype, "camelize", function() {
    uw.requiresUnderscore("camelize");
    return _(this.split(/_|-|\s/g)).map(function(part, i) {
      return (i > 0) ? part.capitalize() : part.toLowerCase();
    }).join('');
  });

  uw.defineMethod(String.prototype, "constantize", function() {
    return this.camelize().capitalize();
  });

  uw.defineMethod(String.prototype, "each", function(iterator) {
    uw.requiresUnderscore("each");
    return _.each.call(this, this.split(''), iterator);
  });

  uw.defineMethod(String.prototype, "underscore", function() {
    return this.replace(/([A-Z])/g, " $1").replace(/^\s?/, '').replace(/-|\s/g, "_").toLowerCase();
  });

  uw.defineMethod(String.prototype, "isEmpty", function() {
    return this.length === 0;
  });

  uw.defineMethod(String.prototype, "isNotEmpty", function() {
    return this.length > 0;
  });

  uw.defineMethod(String.prototype, "includes", function(string) {
    var s = new RegExp(string, 'g');
    return this.match(s) ? true : false;
  });

  uw.defineMethod(String.prototype, "chunk", function(chunkSize) {
    chunkSize = chunkSize ? chunkSize : this.length;
    return this.match(new RegExp('.{1,' + chunkSize + '}', 'g'));
  });

  uw.defineMethod(String.prototype, "swapCase", function() {
    return this.replace(/[A-Za-z]/g, function(s) {
      return (/[A-Z]/).test(s) ? s.toLowerCase() : s.toUpperCase();
    });
  });

  uw.defineMethod(String.prototype, "stripTags", function() {
    return this.replace(/<\w+(\s+("[^"]*"|'[^']*'|[^>])+)?>|<\/\w+>/gi, '');
  });

  uw.defineMethod(String.prototype, "wordCount", function(word) {
    uw.requiresUnderscore("wordCount");
    var matches;
    var string = this.stripTags();
    matches = (word) ? string.match(new RegExp(word, "g")) : string.match(/\b[A-Za-z_]+\b/g);
    return matches ? matches.length : 0;
  });

  uw.defineMethod(String.prototype, "wrap", function(wrapper) {
    return wrapper.concat(this, wrapper);
  });

  uw.defineMethod(String.prototype, "unwrap", function(wrapper) {
    return this.replace(new RegExp("^" + wrapper + "(.+)" + wrapper + "$"), "$1");
  });

  uw.defineMethod(String.prototype, "escape", function() {
    return _.escape.apply(this, [this].concat(_.toArray(arguments)));
  });

  uw.defineMethod(String.prototype, "unescape", function() {
    return _.unescape.apply(this, [this].concat(_.toArray(arguments)));
  });

  uw.defineMethod(String.prototype, "toBoolean", function() {
    var truthyStrings = ["true", "yes", "on", "y"];
    var falseyStrings = ["false", "no", "off", "n"];
    if (_(truthyStrings).contains(this.toLowerCase())) {
      return true;
    } else if (_(falseyStrings).contains(this.toLowerCase())) {
      return false;
    } else {
      return this.isNotEmpty() ? true : false;
    }
  });

  uw.defineAlias(String.prototype, "trim", "strip");
  uw.defineAlias(String.prototype, "ltrim", "lstrip");
  uw.defineAlias(String.prototype, "rtrim", "rstrip");

})();
