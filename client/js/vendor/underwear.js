
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

function uid () {

    function S4() {
       return ( ( ( 1 + Math.random() ) * 0x10000 ) | 0 ).toString(16).substring(1);
    }

    return S4() + S4() + "-" + S4() + "-" + S4() + "-" + S4() + "-" + S4() + S4() + S4();

}

var isDefined = function(suspect) {
    return !_.isUndefined(suspect);
}

if (typeof String.prototype.isEmpty === "undefined") {
    String.prototype.isEmpty = function() {
        return _.isEmpty(this);
    };
}

if (typeof String.prototype.escape === "undefined") {
    String.prototype.escape = function() {
        return _.escape.apply(this, [this].concat(_.toArray(arguments)));
    };
}
(function() {

  var methods = [
    'each',
    'keys',
    'values',
    'pairs',
    'invert',
    'functions',
    'pick',
    'omit',
    'defaults'
  ];

  _.each(methods, function(method) {
    if (Object.prototype[method]) { return; }
    Object.defineProperty(Object.prototype, method, {
      writeable: false,
      configurable: false,
      enumerable: false,
      value: function() {
        return _[method].apply(this, [this].concat(_.toArray(arguments)));
      }
    });
  });

  var aliases = {
    extend: 'mixin',
    clone: 'dup',
    has: 'defines'
  };

  _.each(aliases, function(alias, method) {
    if (Object.prototype[alias]) { return; }
    Object.defineProperty(Object.prototype, alias, {
      writeable: false,
      configurable: false,
      enumerable: false,
      value: function() {
        return _[method].apply(this, [this].concat(_.toArray(arguments)));
      }
    });
  });

})();
(function() {
  var methods = [
    "all",
    "any",
    "collect",
    "compact",
    "contains",
    "countBy",
    "detect",
    "difference",
    "every",
    "filter",
    "find",
    "first",
    "flatten",
    "foldr",
    "groupBy",
    "include",
    "indexOf",
    "initial",
    "inject",
    "intersection",
    "invoke",
    "isEmpty",
    "last",
    "lastIndexOf",
    "map",
    "max",
    "min",
    "pluck",
    "reduce",
    "reduceRight",
    "reject",
    "rest",
    "select",
    "shuffle",
    "size",
    "some",
    "sortBy",
    "sortedIndex",
    "tail",
    "take",
    "toArray",
    "union",
    "uniq",
    "without",
    "zip"
  ];

  var deferredNativeMethods = [
    "every",
    "filter",
    "indexOf",
    "lastIndexOf",
    "map",
    "reduce",
    "reduceRight",
    "some"
  ];

  _.each(methods, function(method) {
    if (Array.prototype[method]) {
      if (_(deferredNativeMethods).contains(method)) return;
      console.warn("Array.prototype." + method + " is being overwritten by underwear.js");
    }

    Object.defineProperty(Array.prototype, method, {
      writeable: false,
      configurable: false,
      enumerable: false,
      value: function() {
        return _[method].apply(_, [this].concat(_.toArray(arguments)));
      }
    });
  });

  if (!Array.prototype.sum) {
    Object.defineProperty(Array.prototype, 'sum', {
      writeable: false,
      configurable: false,
      enumerable: false,
      value: function() {
        return _.reduce(this, function(memo, num) {
          return memo + num;
        }, 0);
      }
    });
  }

  if (!Array.range) {
    Object.defineProperty(Array, 'range', {
      writeable: false,
      configurable: false,
      enumerable: false,
      value: function() {
        return _.range.apply([], arguments);
      }
    });
  }

  var nativeMethods = [{
    func: Array.prototype.forEach,
    alias: 'each'
  }];

  _.each(nativeMethods, function(nativeMethod) {
    if (nativeMethod.func) {
      Object.defineProperty(Array.prototype, nativeMethod.alias, {
        writeable: false,
        configurable: false,
        enumerable: false,
        value: nativeMethod.func
      });
    }
  });


  if (typeof Array.prototype.isEmpty === "undefined") {
    Object.defineProperty(Array.prototype, 'isEmpty', {
      writeable: false,
      configurable: false,
      enumerable: false,
      value: _.isEmpty.call(this, this)
    });
  }

  if (typeof Array.prototype.isNotEmpty === "undefined") {
    Object.defineProperty(Array.prototype, 'isNotEmpty', {
      writeable: false,
      configurable: false,
      enumerable: false,
      value: function() {
        return !_.isEmpty.call(this, this);
      }
    });
  }

})();
(function() {

  var methods = [
    'bind',
    'compose',
    'debounce',
    'defer',
    'delay',
    'memoize',
    'once',
    'throttle',
    'wrap'
  ];

  _.each(methods, function(method) {
    if (!Function.prototype[method]) {
      Object.defineProperty(Function.prototype, method, {
        writeable: false,
        configurable: false,
        enumerable: false,
        value: function() {
          return _[method].apply(this, [this].concat(_.toArray(arguments)));
        }
      });
    }
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
