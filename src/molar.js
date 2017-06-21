(function(global, factory) {
    /// Polyfill
    /// Straight outta MDN.
    'use strict';

    if (global != null) global.molar = global.molar || {};

    factory();
})(window, function() {
    if (!Object.keys)
        Object.keys = (function() {
            var hasOwnProperty = Object.prototype.hasOwnProperty,
                hasDontEnumBug = !({ toString: null }).propertyIsEnumerable('toString'),
                dontEnums = [
                    'toString',
                    'toLocaleString',
                    'valueOf',
                    'hasOwnProperty',
                    'isPrototypeOf',
                    'propertyIsEnumerable',
                    'constructor'
                ],
                dontEnumsLength = dontEnums.length;

            return function(obj) {
                if (typeof obj !== 'object' && (typeof obj !== 'function' || obj === null))
                    throw new TypeError('Object.keys called on non-object');

                var result = [], prop, i;

                for (prop in obj)
                    if (hasOwnProperty.call(obj, prop))
                        result.push(prop);

                if (hasDontEnumBug)
                    for (i = 0; i < dontEnumsLength; i++)
                        if (hasOwnProperty.call(obj, dontEnums[i]))
                            result.push(dontEnums[i]);

                return result;
            };
        }());

    if (!Array.prototype.filter)
        Array.prototype.filter = function(fn) {
            if (this === void 0 || this === null)
                throw new TypeError();

            var t = Object(this);
            var len = t.length >>> 0;

            if (typeof fn !== 'function')
                throw new TypeError();

            var results = [];

            var thisArg = arguments.length >= 2 ? arguments[1] : void 0;

            for (var i = 0; i < len; i++)
                if (i in t) {
                    var val = t[i];

                    if (fn.call(thisArg, val, i, t))
                        results.push(val);
                }

            return results;
        };

    if (!Array.prototype.indexOf)
        Array.prototype.indexOf = function(searchElement, fromIndex) {
            var k;

            if (this == null)
                throw new TypeError('"this" is null or not defined');

            var O = Object(this);
            var len = O.length >>> 0;

            if (len === 0)
                return -1;

            var n = +fromIndex || 0;

            if (Math.abs(n) === Infinity)
                n = 0;

            if (n >= len)
                return -1;

            k = Math.max(n >= 0 ? n : len - Math.abs(n), 0);

            while (k < len) {
                if (k in O && O[k] === searchElement)
                    return k;

                k++;
            }

            return -1;
        };

    if (!Array.prototype.map)
        Array.prototype.map = function(callback, thisArg) {
            var T, A, k;

            if (this == null)
                throw new TypeError('"this" is null or not defined');

            var O = Object(this);
            var len = O.length >>> 0;

            if (typeof callback !== 'function')
                throw new TypeError(callback + ' is not a function');

            if (arguments.length > 1)
                T = thisArg;

            A = new Array(len);
            k = 0;

            while (k < len) {
                var kValue, mappedValue;

                if (k in O) {
                    kValue = O[k];
                    mappedValue = callback.call(T, kValue, k, O);
                    A[k] = mappedValue;
                }

                k++;
            }

            return A;
        };

    if (!Array.prototype.some) {
        Array.prototype.some = function(fun) {
            if (this == null)
                throw new TypeError('Array.prototype.some called on null or undefined');

            if (typeof fun !== 'function')
                throw new TypeError();

            var t = Object(this);
            var len = t.length >>> 0;

            var thisArg = arguments.length >= 2 ? arguments[1] : void 0;
            
            for (var i = 0; i < len; i++)
                if (i in t && fun.call(thisArg, t[i], i, t))
                    return true;

            return false;
        };
    }

    if (!Array.prototype.every) {
        Array.prototype.every = function(callback, thisArg) {
            var T, k;

            if (this == null)
                throw new TypeError('this is null or not defined');

            var O = Object(this);

            var len = O.length >>> 0;

            if (typeof callback !== 'function')
                throw new TypeError();

            if (arguments.length > 1)
                T = thisArg;

            k = 0;

            while (k < len) {
                var kValue;

                if (k in O) {
                    var testResult = callback.call(T, kValue, k, O);

                    if (!testResult)
                        return false;
                }
                k++;
            }
            return true;
        };
    }

    if (!Array.prototype.forEach) {
        Array.prototype.forEach = function(callback, thisArg) {
            var T, k;

            if (this == null)
                throw new TypeError(' this is null or not defined');

            var O = Object(this),
                len = O.length >>> 0;
            
            if (typeof callback !== "function") 
                throw new TypeError(callback + ' is not a function');
            
            if (arguments.length > 1) 
                T = thisArg;
            
            k = 0;
            
            while (k < len) {
                var kValue;

                if (k in O) {
                    kValue = O[k];
                    
                    callback.call(T, kValue, k, O);
                }

                k++;
            }
        };
    }
});
