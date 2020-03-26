(function(){function r(e,n,t){function o(i,f){if(!n[i]){if(!e[i]){var c="function"==typeof require&&require;if(!f&&c)return c(i,!0);if(u)return u(i,!0);var a=new Error("Cannot find module '"+i+"'");throw a.code="MODULE_NOT_FOUND",a}var p=n[i]={exports:{}};e[i][0].call(p.exports,function(r){var n=e[i][1][r];return o(n||r)},p,p.exports,r,e,n,t)}return n[i].exports}for(var u="function"==typeof require&&require,i=0;i<t.length;i++)o(t[i]);return o}return r})()({1:[function(require,module,exports){
module.exports = require("core-js/library/fn/object/define-property");
},{"core-js/library/fn/object/define-property":5}],2:[function(require,module,exports){
function _classCallCheck(instance, Constructor) {
  if (!(instance instanceof Constructor)) {
    throw new TypeError("Cannot call a class as a function");
  }
}

module.exports = _classCallCheck;
},{}],3:[function(require,module,exports){
var _Object$defineProperty = require("../core-js/object/define-property");

function _defineProperties(target, props) {
  for (var i = 0; i < props.length; i++) {
    var descriptor = props[i];
    descriptor.enumerable = descriptor.enumerable || false;
    descriptor.configurable = true;
    if ("value" in descriptor) descriptor.writable = true;

    _Object$defineProperty(target, descriptor.key, descriptor);
  }
}

function _createClass(Constructor, protoProps, staticProps) {
  if (protoProps) _defineProperties(Constructor.prototype, protoProps);
  if (staticProps) _defineProperties(Constructor, staticProps);
  return Constructor;
}

module.exports = _createClass;
},{"../core-js/object/define-property":1}],4:[function(require,module,exports){
function _interopRequireDefault(obj) {
  return obj && obj.__esModule ? obj : {
    "default": obj
  };
}

module.exports = _interopRequireDefault;
},{}],5:[function(require,module,exports){
require('../../modules/es6.object.define-property');
var $Object = require('../../modules/_core').Object;
module.exports = function defineProperty(it, key, desc) {
  return $Object.defineProperty(it, key, desc);
};

},{"../../modules/_core":8,"../../modules/es6.object.define-property":22}],6:[function(require,module,exports){
module.exports = function (it) {
  if (typeof it != 'function') throw TypeError(it + ' is not a function!');
  return it;
};

},{}],7:[function(require,module,exports){
var isObject = require('./_is-object');
module.exports = function (it) {
  if (!isObject(it)) throw TypeError(it + ' is not an object!');
  return it;
};

},{"./_is-object":18}],8:[function(require,module,exports){
var core = module.exports = { version: '2.6.11' };
if (typeof __e == 'number') __e = core; // eslint-disable-line no-undef

},{}],9:[function(require,module,exports){
// optional / simple context binding
var aFunction = require('./_a-function');
module.exports = function (fn, that, length) {
  aFunction(fn);
  if (that === undefined) return fn;
  switch (length) {
    case 1: return function (a) {
      return fn.call(that, a);
    };
    case 2: return function (a, b) {
      return fn.call(that, a, b);
    };
    case 3: return function (a, b, c) {
      return fn.call(that, a, b, c);
    };
  }
  return function (/* ...args */) {
    return fn.apply(that, arguments);
  };
};

},{"./_a-function":6}],10:[function(require,module,exports){
// Thank's IE8 for his funny defineProperty
module.exports = !require('./_fails')(function () {
  return Object.defineProperty({}, 'a', { get: function () { return 7; } }).a != 7;
});

},{"./_fails":13}],11:[function(require,module,exports){
var isObject = require('./_is-object');
var document = require('./_global').document;
// typeof document.createElement is 'object' in old IE
var is = isObject(document) && isObject(document.createElement);
module.exports = function (it) {
  return is ? document.createElement(it) : {};
};

},{"./_global":14,"./_is-object":18}],12:[function(require,module,exports){
var global = require('./_global');
var core = require('./_core');
var ctx = require('./_ctx');
var hide = require('./_hide');
var has = require('./_has');
var PROTOTYPE = 'prototype';

var $export = function (type, name, source) {
  var IS_FORCED = type & $export.F;
  var IS_GLOBAL = type & $export.G;
  var IS_STATIC = type & $export.S;
  var IS_PROTO = type & $export.P;
  var IS_BIND = type & $export.B;
  var IS_WRAP = type & $export.W;
  var exports = IS_GLOBAL ? core : core[name] || (core[name] = {});
  var expProto = exports[PROTOTYPE];
  var target = IS_GLOBAL ? global : IS_STATIC ? global[name] : (global[name] || {})[PROTOTYPE];
  var key, own, out;
  if (IS_GLOBAL) source = name;
  for (key in source) {
    // contains in native
    own = !IS_FORCED && target && target[key] !== undefined;
    if (own && has(exports, key)) continue;
    // export native or passed
    out = own ? target[key] : source[key];
    // prevent global pollution for namespaces
    exports[key] = IS_GLOBAL && typeof target[key] != 'function' ? source[key]
    // bind timers to global for call from export context
    : IS_BIND && own ? ctx(out, global)
    // wrap global constructors for prevent change them in library
    : IS_WRAP && target[key] == out ? (function (C) {
      var F = function (a, b, c) {
        if (this instanceof C) {
          switch (arguments.length) {
            case 0: return new C();
            case 1: return new C(a);
            case 2: return new C(a, b);
          } return new C(a, b, c);
        } return C.apply(this, arguments);
      };
      F[PROTOTYPE] = C[PROTOTYPE];
      return F;
    // make static versions for prototype methods
    })(out) : IS_PROTO && typeof out == 'function' ? ctx(Function.call, out) : out;
    // export proto methods to core.%CONSTRUCTOR%.methods.%NAME%
    if (IS_PROTO) {
      (exports.virtual || (exports.virtual = {}))[key] = out;
      // export proto methods to core.%CONSTRUCTOR%.prototype.%NAME%
      if (type & $export.R && expProto && !expProto[key]) hide(expProto, key, out);
    }
  }
};
// type bitmap
$export.F = 1;   // forced
$export.G = 2;   // global
$export.S = 4;   // static
$export.P = 8;   // proto
$export.B = 16;  // bind
$export.W = 32;  // wrap
$export.U = 64;  // safe
$export.R = 128; // real proto method for `library`
module.exports = $export;

},{"./_core":8,"./_ctx":9,"./_global":14,"./_has":15,"./_hide":16}],13:[function(require,module,exports){
module.exports = function (exec) {
  try {
    return !!exec();
  } catch (e) {
    return true;
  }
};

},{}],14:[function(require,module,exports){
// https://github.com/zloirock/core-js/issues/86#issuecomment-115759028
var global = module.exports = typeof window != 'undefined' && window.Math == Math
  ? window : typeof self != 'undefined' && self.Math == Math ? self
  // eslint-disable-next-line no-new-func
  : Function('return this')();
if (typeof __g == 'number') __g = global; // eslint-disable-line no-undef

},{}],15:[function(require,module,exports){
var hasOwnProperty = {}.hasOwnProperty;
module.exports = function (it, key) {
  return hasOwnProperty.call(it, key);
};

},{}],16:[function(require,module,exports){
var dP = require('./_object-dp');
var createDesc = require('./_property-desc');
module.exports = require('./_descriptors') ? function (object, key, value) {
  return dP.f(object, key, createDesc(1, value));
} : function (object, key, value) {
  object[key] = value;
  return object;
};

},{"./_descriptors":10,"./_object-dp":19,"./_property-desc":20}],17:[function(require,module,exports){
module.exports = !require('./_descriptors') && !require('./_fails')(function () {
  return Object.defineProperty(require('./_dom-create')('div'), 'a', { get: function () { return 7; } }).a != 7;
});

},{"./_descriptors":10,"./_dom-create":11,"./_fails":13}],18:[function(require,module,exports){
module.exports = function (it) {
  return typeof it === 'object' ? it !== null : typeof it === 'function';
};

},{}],19:[function(require,module,exports){
var anObject = require('./_an-object');
var IE8_DOM_DEFINE = require('./_ie8-dom-define');
var toPrimitive = require('./_to-primitive');
var dP = Object.defineProperty;

exports.f = require('./_descriptors') ? Object.defineProperty : function defineProperty(O, P, Attributes) {
  anObject(O);
  P = toPrimitive(P, true);
  anObject(Attributes);
  if (IE8_DOM_DEFINE) try {
    return dP(O, P, Attributes);
  } catch (e) { /* empty */ }
  if ('get' in Attributes || 'set' in Attributes) throw TypeError('Accessors not supported!');
  if ('value' in Attributes) O[P] = Attributes.value;
  return O;
};

},{"./_an-object":7,"./_descriptors":10,"./_ie8-dom-define":17,"./_to-primitive":21}],20:[function(require,module,exports){
module.exports = function (bitmap, value) {
  return {
    enumerable: !(bitmap & 1),
    configurable: !(bitmap & 2),
    writable: !(bitmap & 4),
    value: value
  };
};

},{}],21:[function(require,module,exports){
// 7.1.1 ToPrimitive(input [, PreferredType])
var isObject = require('./_is-object');
// instead of the ES6 spec version, we didn't implement @@toPrimitive case
// and the second argument - flag - preferred type is a string
module.exports = function (it, S) {
  if (!isObject(it)) return it;
  var fn, val;
  if (S && typeof (fn = it.toString) == 'function' && !isObject(val = fn.call(it))) return val;
  if (typeof (fn = it.valueOf) == 'function' && !isObject(val = fn.call(it))) return val;
  if (!S && typeof (fn = it.toString) == 'function' && !isObject(val = fn.call(it))) return val;
  throw TypeError("Can't convert object to primitive value");
};

},{"./_is-object":18}],22:[function(require,module,exports){
var $export = require('./_export');
// 19.1.2.4 / 15.2.3.6 Object.defineProperty(O, P, Attributes)
$export($export.S + $export.F * !require('./_descriptors'), 'Object', { defineProperty: require('./_object-dp').f });

},{"./_descriptors":10,"./_export":12,"./_object-dp":19}],23:[function(require,module,exports){
"use strict";
/**
 * author: dmemory
 * desc: 本项目是利用 frida 获取 Jni RegisterNatives 动态注册的函数，并将其函数地址和对应的 so 打印出来
 */

var _interopRequireDefault = require("@babel/runtime-corejs2/helpers/interopRequireDefault");

var _defineProperty = _interopRequireDefault(require("@babel/runtime-corejs2/core-js/object/define-property"));

(0, _defineProperty["default"])(exports, "__esModule", {
  value: true
});

var dmlog_1 = require("./utils/dmlog");

var tag = 'fridaRegstNtv';

function getModuleInfoByPtr(fnPtr) {
  var modules = Process.enumerateModules();
  var modname = null,
      base = null;
  modules.forEach(function (mod) {
    if (mod.base <= fnPtr && fnPtr.toInt32() <= mod.base.toInt32() + mod.size) {
      modname = mod.name;
      base = mod.base;
      return false;
    }
  });
  return [modname, base];
}

function hook_registNatives() {
  var env = Java.vm.getEnv();
  var handlePointer = env.handle.readPointer();
  console.log("handle: " + handlePointer);
  var nativePointer = handlePointer.add(215 * Process.pointerSize).readPointer();
  console.log("register: " + nativePointer);
  /**
   typedef struct {
      const char* name;
      const char* signature;
      void* fnPtr;
   } JNINativeMethod;
   jint RegisterNatives(JNIEnv* env, jclass clazz, const JNINativeMethod* methods, jint nMethods)
   */

  Interceptor.attach(nativePointer, {
    onEnter: function onEnter(args) {
      var env = Java.vm.getEnv();
      var methods = args[2];
      var methodcount = args[3].toInt32();
      var name = env.getClassName(args[1]);
      console.log("==== class: " + name + " ====");
      console.log("==== methods: " + methods + " nMethods: " + methodcount + " ====");

      for (var i = 0; i < methodcount; i++) {
        var idx = i * 12;
        var fnPtr = methods.add(idx + 8).readPointer();
        var infoArr = getModuleInfoByPtr(fnPtr);
        var modulename = infoArr[0];
        var modulebase = infoArr[1];
        var logstr = "name: " + methods.add(idx).readPointer().readCString() + ", signature: " + methods.add(idx + 4).readPointer().readCString() + ", fnPtr: " + fnPtr + ", modulename: " + modulename + " -> base: " + modulebase;

        if (null != modulebase) {
          logstr += ", offset: " + fnPtr.sub(modulebase);
        }

        dmlog_1.DMLog.i(tag, logstr);
      }
    }
  });
}

function main() {
  dmlog_1.DMLog.i(tag, 'hello, i am loaded');
  hook_registNatives();
}

if (Java.available) {
  Java.perform(function () {
    main();
  });
}

},{"./utils/dmlog":24,"@babel/runtime-corejs2/core-js/object/define-property":1,"@babel/runtime-corejs2/helpers/interopRequireDefault":4}],24:[function(require,module,exports){
"use strict";

var _interopRequireDefault = require("@babel/runtime-corejs2/helpers/interopRequireDefault");

var _classCallCheck2 = _interopRequireDefault(require("@babel/runtime-corejs2/helpers/classCallCheck"));

var _createClass2 = _interopRequireDefault(require("@babel/runtime-corejs2/helpers/createClass"));

var _defineProperty = _interopRequireDefault(require("@babel/runtime-corejs2/core-js/object/define-property"));

(0, _defineProperty["default"])(exports, "__esModule", {
  value: true
});

var DMLog = /*#__PURE__*/function () {
  function DMLog() {
    (0, _classCallCheck2["default"])(this, DMLog);
  }

  (0, _createClass2["default"])(DMLog, null, [{
    key: "d",
    value: function d(tag, str) {
      DMLog.log_('DEBUG', tag, str);
    }
  }, {
    key: "i",
    value: function i(tag, str) {
      DMLog.log_('INFO', tag, str);
    }
  }, {
    key: "e",
    value: function e(tag, str) {
      DMLog.log_('ERROR', tag, str);
    }
  }, {
    key: "log_",
    value: function log_(leval, tag, str) {
      console.log('[' + leval + '][' + tag + ']: ' + str);
    }
  }]);
  return DMLog;
}();

exports.DMLog = DMLog;

},{"@babel/runtime-corejs2/core-js/object/define-property":1,"@babel/runtime-corejs2/helpers/classCallCheck":2,"@babel/runtime-corejs2/helpers/createClass":3,"@babel/runtime-corejs2/helpers/interopRequireDefault":4}]},{},[23])
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm5vZGVfbW9kdWxlcy9icm93c2VyLXBhY2svX3ByZWx1ZGUuanMiLCJub2RlX21vZHVsZXMvQGJhYmVsL3J1bnRpbWUtY29yZWpzMi9jb3JlLWpzL29iamVjdC9kZWZpbmUtcHJvcGVydHkuanMiLCJub2RlX21vZHVsZXMvQGJhYmVsL3J1bnRpbWUtY29yZWpzMi9oZWxwZXJzL2NsYXNzQ2FsbENoZWNrLmpzIiwibm9kZV9tb2R1bGVzL0BiYWJlbC9ydW50aW1lLWNvcmVqczIvaGVscGVycy9jcmVhdGVDbGFzcy5qcyIsIm5vZGVfbW9kdWxlcy9AYmFiZWwvcnVudGltZS1jb3JlanMyL2hlbHBlcnMvaW50ZXJvcFJlcXVpcmVEZWZhdWx0LmpzIiwibm9kZV9tb2R1bGVzL2NvcmUtanMvbGlicmFyeS9mbi9vYmplY3QvZGVmaW5lLXByb3BlcnR5LmpzIiwibm9kZV9tb2R1bGVzL2NvcmUtanMvbGlicmFyeS9tb2R1bGVzL19hLWZ1bmN0aW9uLmpzIiwibm9kZV9tb2R1bGVzL2NvcmUtanMvbGlicmFyeS9tb2R1bGVzL19hbi1vYmplY3QuanMiLCJub2RlX21vZHVsZXMvY29yZS1qcy9saWJyYXJ5L21vZHVsZXMvX2NvcmUuanMiLCJub2RlX21vZHVsZXMvY29yZS1qcy9saWJyYXJ5L21vZHVsZXMvX2N0eC5qcyIsIm5vZGVfbW9kdWxlcy9jb3JlLWpzL2xpYnJhcnkvbW9kdWxlcy9fZGVzY3JpcHRvcnMuanMiLCJub2RlX21vZHVsZXMvY29yZS1qcy9saWJyYXJ5L21vZHVsZXMvX2RvbS1jcmVhdGUuanMiLCJub2RlX21vZHVsZXMvY29yZS1qcy9saWJyYXJ5L21vZHVsZXMvX2V4cG9ydC5qcyIsIm5vZGVfbW9kdWxlcy9jb3JlLWpzL2xpYnJhcnkvbW9kdWxlcy9fZmFpbHMuanMiLCJub2RlX21vZHVsZXMvY29yZS1qcy9saWJyYXJ5L21vZHVsZXMvX2dsb2JhbC5qcyIsIm5vZGVfbW9kdWxlcy9jb3JlLWpzL2xpYnJhcnkvbW9kdWxlcy9faGFzLmpzIiwibm9kZV9tb2R1bGVzL2NvcmUtanMvbGlicmFyeS9tb2R1bGVzL19oaWRlLmpzIiwibm9kZV9tb2R1bGVzL2NvcmUtanMvbGlicmFyeS9tb2R1bGVzL19pZTgtZG9tLWRlZmluZS5qcyIsIm5vZGVfbW9kdWxlcy9jb3JlLWpzL2xpYnJhcnkvbW9kdWxlcy9faXMtb2JqZWN0LmpzIiwibm9kZV9tb2R1bGVzL2NvcmUtanMvbGlicmFyeS9tb2R1bGVzL19vYmplY3QtZHAuanMiLCJub2RlX21vZHVsZXMvY29yZS1qcy9saWJyYXJ5L21vZHVsZXMvX3Byb3BlcnR5LWRlc2MuanMiLCJub2RlX21vZHVsZXMvY29yZS1qcy9saWJyYXJ5L21vZHVsZXMvX3RvLXByaW1pdGl2ZS5qcyIsIm5vZGVfbW9kdWxlcy9jb3JlLWpzL2xpYnJhcnkvbW9kdWxlcy9lczYub2JqZWN0LmRlZmluZS1wcm9wZXJ0eS5qcyIsInNyYy9pbmRleC50cyIsInNyYy91dGlscy9kbWxvZy50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQTtBQ0FBOztBQ0FBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ05BO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDbkJBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ05BO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNMQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ0pBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNMQTtBQUNBO0FBQ0E7O0FDRkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ3BCQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ0pBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7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
