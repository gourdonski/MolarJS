(function(global, factory) {
    /// Helpers
    'use strict';

    var molar;

    if (typeof module === 'object' && module.exports) molar = module.exports;
    else molar = global.molar = global.molar || {};

    factory(molar);
})(window, function(molar) {
    var helpers = molar.helpers = {};

    helpers.isArray = function(val) {
        return val !== void 0 && val !== null && val instanceof Array;
    };

    helpers.isUndefined = function(val) {
        //Is the void 0 check necessary?
        return val === void 0 || typeof val == 'undefined';
    };

    helpers.isFunction = function(val) {
        return typeof val === 'function';
    };

    helpers.isString = function(val) {
        return typeof val === 'string' || val instanceof String;  
    };

    helpers.isInteger = function(val) {
        return typeof val === 'number' && val % 1 === 0;
    };

    helpers.isDate = function(val) {
        try {
            return val.constructor.toString().indexOf('Date') != -1;
        }
        catch (err) {
            return false;
        }
    };

    //Haven't fully tested this, yet.
    helpers.through = function() {
        if (arguments.length === 0)
            return undefined;

        if (arguments.length === 1)
            return arguments[0];

        //Using in-line to array to avoid arguments leaking and potential optimization issues.
        var args = new Array(arguments.length);

        for (var i = 0; i < args.length; i++)
            args[i] = arguments[i];

        return args;
    };

    helpers.mixin = function(source, target) {
        for (var property in source)
            if (source.hasOwnProperty(property))
                target[property] = source[property];

        return target;
    };

    helpers.stringify = function(obj) {
        //Todo: polyfill JSON.stringify()
        //https://bestiejs.github.io/json3/
        return JSON.stringify(obj);
    };

    //http://werxltd.com/wp/2010/05/13/javascript-implementation-of-javas-string-hashcode-method/
    helpers.hash = function(string) {
        if (!this.isString(string))
            return null;
        
        var hash = 0,
            chr;

        if (string.length === 0)
            return hash;

        for (var i = 0; i < string.length; i++) {
            chr   = string.charCodeAt(i);
            hash  = ((hash << 5) - hash) + chr;
            hash |= 0; //Convert to 32-bit integer.
        }

        return hash;
    };

    helpers.iterator = function iterator(values) {
        if (!(helpers.isArray(values) && molar.array.any(values)))
            return null;

        var index = -1;

        return {
            current: function() {
                return values[index];
            },
            next: function() {
                if (index >= values.length)
                    return null;

                return values[++index];
            },
            peek: function() {
                return values[index + 1];
            },
            seek: function(predicate) {
                while (++index <= values.length)
                    if (predicate(values[index]))
                        return values[index];

                return null;
            },
            reset: function() {
                index = -1;
            }
        };
    };

    return helpers;
});
