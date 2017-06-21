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

(function(global, factory) {
    /// Array extensions
    'use strict';

    var molar;

    if (typeof module === 'object' && module.exports) molar = module.exports;
    else molar = global.molar = global.molar || {};

    factory(molar);
})(window, function(molar) {
    molar.array = new ArrayHelper();
 
    function ArrayHelper() {}

    ArrayHelper.prototype.first = function(arr, predicate) {
        if (!molar.helpers.isArray(arr))
            throw new TypeError('Arg is not an array');
        
        if (!molar.helpers.isFunction(predicate))
            throw new TypeError('Callback is not a function');

        var match;

        arr.some(function(obj) { 
            return predicate(obj) ? (match = obj, true) : false; 
        });

        return match;
    };

    //Todo: add optional predicate.
    ArrayHelper.prototype.any = function(arr, predicate) {
        if (!molar.helpers.isArray(arr))
            throw new TypeError('Arg is not an array');

        if (molar.helpers.isFunction(predicate))
            return !molar.helpers.isUndefined(this.first(arr, predicate));
        
        var length = Object(arr).length >>> 0;

        return length > 0;
    };
    
    //Supports accessing elements by negative index.
    ArrayHelper.prototype.elementAt = function(arr, index, value) {
        if (!molar.helpers.isArray(arr))
            throw new TypeError('Arg is not an array');

        index = molar.helpers.isInteger(index) && index < 0 ? arr.length + index : index;

        if (value != null) 
            arr[index] = value;
        
        return arr[index];
    };
});

(function(global, factory) {
    /// DateBuilder
    'use strict';

    var molar;

    if (typeof module === 'object' && module.exports) molar = module.exports;
    else molar = global.molar = global.molar || {};

    factory(molar);
})(window, function(molar) {
    molar.DateBuilder = DateBuilder;

    //Can revisit how we set defaults.
    function DateBuilder(year, month, date, hours, minutes) { 
        this._date = [
            minutes || null,
            hours || null,
            date || 1,
            month || 0,
            year || new Date().getFullYear()
        ]; 
    }
    
    DateBuilder.prototype.minutes = function(minutes) {
        this._date[0] = minutes;
    };
    
    DateBuilder.prototype.hours = function(hours) {
        this._date[1] = hours;
    };
    
    DateBuilder.prototype.date = function(date) {
        this._date[2] = date;
    };
    
    DateBuilder.prototype.month = function(month) {
        this._date[3] = month;
    };
    
    DateBuilder.prototype.year = function(year) {
        this._date[4] = year;
    };

    DateBuilder.prototype.set = function(index, value) {
        molar.array.elementAt(this._date, index, value);
    };

    DateBuilder.prototype.getMinutes = function() {
        return this._date[0];
    };

    DateBuilder.prototype.getHours = function() {
        return this._date[1];
    };

    DateBuilder.prototype.getDate = function() {
        return this._date[2];
    };

    DateBuilder.prototype.getMonth = function() {
        return this._date[3];
    };

    DateBuilder.prototype.getYear = function() {
        return this._date[4];
    };
    
    DateBuilder.prototype.build = function() {
        return (function(minutes, hours, date, month, year) {
            return new Date(year, month, date, hours, minutes);
        }).apply(null, this._date);
    };
});

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

(function(global, factory) {
    /// Lookup
    /// Provides a convenient way to manage a key/value collection, including lifetime of entries.
    'use strict';

    var molar;

    if (typeof module === 'object' && module.exports) molar = module.exports;
    else molar = global.molar = global.molar || {};

    factory(molar);
})(window, function(molar) {
    molar.Lookup = Lookup;
    
    //Can make ttl support different units of time.
    function Lookup(allowDuplicate, ttlInMilliseconds) {
        this.allowDuplicate = allowDuplicate;
        this.ttl = ttlInMilliseconds;
        this._collection = []; //Can look into partitioning collection based on ttl if performance an issue.  Maybe make a separate collection for short-lived objects and trawl that first when removing expired items.
    }

    //Should look into grouping duplicates by key for faster retrieval.  Just need to handle expiration setting on groups of items.
    Lookup.prototype.add = function(key, value) {
        //Default behavior is to allow duplicates.
        if (this.allowDuplicate !== false || !this.contains(key)) {
            var timestamp = new Date(), expiration = null;

            if (this.ttl) { //Should check existence in a more thorough way.
                expiration = new Date(timestamp);
                expiration.setMilliseconds(expiration.getMilliseconds() + this.ttl);
            }

            this._collection.push(new LookupItem(key, value, timestamp, expiration));

            return true;
        }

        return false;
    };

    Lookup.prototype.load = function(data, key, transform) {
        transform = molar.helpers.isFunction(transform) ? transform : molar.helpers.through;

        var getKey = molar.helpers.isFunction(key) ? key : function(obj) { return obj[key]; };

        for (var i = 0; i < data.length; i++) {
            var obj = data[i];

            this.add(getKey(obj), transform(obj));
        }

        return this;
    };

    Lookup.prototype.clear = function() {
        this._collection = [];
    };
    
    Lookup.prototype.removeBy = function(predicate) {
        var _predicate = this.ttl ? ttlRemovePredicate(predicate) : predicate,
            matches = [],
            removed = 0,
            length = this._collection.length;

        for (var i = 0; i < length; i++)
            if (_predicate(this._collection[i]))
                matches.unshift(i); //FILO to not change index of adjacent matches as we remove current.

        for (var m = 0; m < matches.length; m++) {
            this._collection.splice(matches[m], 1);

            removed++;
        }

        return removed;
    };

    Lookup.prototype.removeFirst = function(predicate) {
        var _predicate = this.ttl ? ttlRemovePredicate(predicate) : predicate,
            length = this._collection.length;

        for (var i = 0; i < length; i++)
            if (_predicate(this._collection[i])) {
                this._collection.splice(i, 1);

                return true;
            }

        return false;
    };

    Lookup.prototype.remove = function(keys) {
        //Using in-line to array to avoid arguments leaking and potential optimization issues.
        var _keys = keys;

        if (arguments.length > 1) {
            _keys = new Array(arguments.length);

            for (var _i = 0; _i < _keys.length; _i++)
                _keys[_i] = arguments[_i];
        }
        else if (!molar.helpers.isArray(_keys))
            _keys = [_keys];

        var removed;

        if (this.allowDuplicate)
            removed = this.removeBy(isKeyIn(_keys));
        else {
            removed = 0;

            var self = this;

            for (var i = 0; i < _keys.length; i++)
                (function(_i) {
                    if (self.removeFirst(function(item) {
                            return item.key === _keys[_i];
                        }))

                        removed++;
                })(i);
        }

        return removed;
    };

    Lookup.prototype.findBy = function(predicate) {
        var length = this._collection.length,
            i,
            item,
            matches = [];

        if (this.ttl) {
            var expired = [];

            for (i = 0; i < length; i++) {
                item = this._collection[i];

                if (isExpired(item))
                    expired.push(i);
                else if (predicate(item))
                    matches.push(item.value);
            }

            for (i = 0; i < expired.length; i++)
                this._collection.splice(expired[i], 1);
        }
        else
            for (i = 0; i < length; i++) {
                item = this._collection[i];

                if (predicate(item))
                    matches.push(item.value);
            }

        return matches;
    };

    Lookup.prototype.findFirst = function(predicate) {
        var length = this._collection.length,
            i,
            item;

        if (this.ttl) {
            var match = null,
                expired = [];

            for (i = 0; i < length; i++) {
                item = this._collection[i];

                if (isExpired(item)) {
                    expired.push(i);

                    if (predicate(item))
                        break;
                }
                else if (predicate(item)) {
                    match = item.value;

                    break;
                }
            }

            for (i = 0; i < expired.length; i++)
                this._collection.splice(expired[i], 1);

            return match;
        }
        else
            for (i = 0; i < length; i++) {
                item = this._collection[i];

                if (predicate(item))
                    return item.value;
            }

        return null;
    };

    Lookup.prototype.find = function(keys) {
        //Using in-line to array to avoid arguments leaking and potential optimization issues.
        var _keys = keys;

        if (arguments.length > 1) {
            _keys = new Array(arguments.length);

            for (var _i = 0; _i < _keys.length; _i++)
                _keys[_i] = arguments[_i];
        }
        else if (!molar.helpers.isArray(_keys))
            _keys = [_keys];

        var matches;

        if (this.allowDuplicate)
            matches = this.findBy(isKeyIn(_keys));
        else {
            matches = [];

            var self = this;

            //If we aren't allowing duplicates, then the collection can only have unique keys, so return first occurrence of each key.
            //Todo: Look into passing collection of keys and eliminating keys from collection as we loop through main collection once.
            for (var i = 0; i < _keys.length; i++)
                (function(_i) {
                    matches.push(self.findFirst(function(item) {
                        return item.key === _keys[_i];
                    }));
                })(i);
        }
            
        return matches;
    };

    Lookup.prototype.contains = function(key) {
        return this.findFirst(function(obj) {
                return obj.key === key;
            }) != null;
    };

    Lookup.prototype.values = function() {
        if (this.ttl)
            return this.findBy(molar.helpers.through); //Short-cut to purge expired keys from collection as we get values.

        return this._collection.map(function(item) {
            return item.value;
        });
    };

    Lookup.prototype.count = function() {
        return this.values().length;
    };

    function LookupItem(key, value, timestamp, expiration) {
        this.key = key;
        this.value = value;
        this.timestamp = timestamp;
        this.expiration = expiration;
    }

    function isExpired(lookupItem) {
        return molar.helpers.isDate(lookupItem.expiration) && lookupItem.expiration < new Date();
    }

    function isKeyIn(keys) {
        return function(lookupItem) {
            return keys.some(function(key) {
                return key === lookupItem.key;
            });
        };
    }

    function ttlRemovePredicate(predicate) {
        return function(item) {
            return isExpired(item) || predicate(item);
        };
    }
});
