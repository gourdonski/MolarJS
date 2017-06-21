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

(function(global, factory) {
    /// Mapper
    /// Provides a self-documenting way to map objects onto each other.
    'use strict';

    var molar;

    if (typeof module === 'object' && module.exports) molar = module.exports;
    else molar = global.molar = global.molar || {};

    factory(molar);
})(window, function(molar) {
    molar.Mapper = Mapper;

    function Mapper() {
        this.definitions = [];
    }

    Mapper.prototype.register = function(mapperDefinition) {
        this.definitions.push(mapperDefinition);

        return this;
    };

    Mapper.prototype.map = function(source, definitionName) {
        var def = molar.array.first(this.definitions, function(def) {
            return def.name === definitionName;
        });

        if (def === null || molar.helpers.isUndefined(def))
            return null;

        var target = {};

        if (molar.helpers.isArray(def.maps))
            for (var i = 0; i < def.maps.length; i++) {
                var map = def.maps[i];

                if (molar.helpers.isUndefined(map.condition) ||
                    (molar.helpers.isFunction(map.condition) && map.condition(source[map.source]))) {
                    var transform = molar.helpers.isFunction(map.transform) ? map.transform : molar.helpers.through;

                    target[map.target] = transform(source[map.source]);
                }
            }

        //Effectively creates a shallow clone if no maps defined and auto map set to true.
        if (def.autoMap === true)
            for (var property in source)
                //Make sure target property hasn't already been set by a mapping.
                if (source.hasOwnProperty(property) && molar.helpers.isUndefined(target[property]))
                    target[property] = source[property];

        return target;
    };
});

(function(global, factory) {
    /// MapperDef
    /// Definition object for Mapper.
    'use strict';

    var molar;

    if (typeof module === 'object' && module.exports) molar = module.exports;
    else molar = global.molar = global.molar || {};

    molar.MapperDef = factory();
})(window, function() {
    function MapperDef(name, autoMap) { 
        this.name = name; 
        this.autoMap = autoMap; 
        this.maps = []; 
    }

    MapperDef.prototype.define = function(definition) { 
        this.definition = definition; 
        
        return this; 
    };

    MapperDef.prototype.addMap = function(sourceProperty, targetProperty, transform, mapCondition) {
        this.maps.push({
            source: sourceProperty, 
            target: targetProperty, 
            transform: transform, 
            condition: mapCondition 
        });

        return this;
    };

    return MapperDef;
});

(function(global, factory) {
    /// Mutant (basic implementation)
    'use strict';

    var molar;

    if (typeof module === 'object' && module.exports) molar = module.exports;
    else molar = global.molar = global.molar || {};

    factory(molar);
})(window, function(molar) {
    molar.Mutant = Mutant;

    function Mutant(obj) {
        molar.helpers.mixin(obj, this);

        this.prototype = obj.prototype;

        var hash = hashCode(obj);

        this._originalHashCode = function() {
            return hash;
        };
    }

    Mutant.prototype.mutated = function() {
        return hashCode(this) != this._originalHashCode();
    };

    //Do we want to support tracking versions when rebasing?
    Mutant.prototype.rebase = function() {
        var rebased = hashCode(this);

        this._originalHashCode = function() {
            return rebased;
        };
    };

    //Static function for comparing hashcodes for any type of argument.
    Mutant.compare = function(source, target) {
        if (source === target)
            return true;

        return hashCode(source) === hashCode(target);
    };

    function hashCode(obj) {
        return molar.helpers.hash(molar.helpers.stringify(obj));
    }
});

(function(global, factory) {
    /// Ready Constants
    'use strict';

    var molar;

    if (typeof module === 'object' && module.exports) molar = module.exports;
    else molar = global.molar = global.molar || {};

    (molar.ready = molar.ready || {}).constants = factory();
})(window, function() {
    var constants = {};

    constants.EXPRESSION_TYPE = {
        STANDARD: 'standard',
        MINUTES: 'minutes'
    };
    
    constants.FIELD_TYPE = {
        RANGE: 'Range', 
        LIST: 'List', 
        SINGLE: 'Single', 
        WILD_CARD: '*' 
    };
    
    constants.FIELD_NAME = {
        MINUTES: 'minutes', 
        HOURS: 'hours', 
        MINUTES_OF_DAY: 'minutesOfDay',
        DAY_OF_MONTH: 'dayOfMonth', 
        MONTH: 'month', 
        DAY_OF_WEEK: 'dayOfWeek', 
        YEAR: 'year'
    };

    constants.FIELD_NAMES = {};
    constants.FIELD_NAMES[constants.EXPRESSION_TYPE.STANDARD] = [
        constants.FIELD_NAME.MINUTES,
        constants.FIELD_NAME.HOURS,
        constants.FIELD_NAME.DAY_OF_MONTH,
        constants.FIELD_NAME.MONTH,
        constants.FIELD_NAME.DAY_OF_WEEK,
        constants.FIELD_NAME.YEAR
    ];
    constants.FIELD_NAMES[constants.EXPRESSION_TYPE.MINUTES] = [
        constants.FIELD_NAME.MINUTES_OF_DAY,
        constants.FIELD_NAME.DAY_OF_MONTH,
        constants.FIELD_NAME.MONTH,
        constants.FIELD_NAME.DAY_OF_WEEK,
        constants.FIELD_NAME.YEAR
    ];

    constants.MONTH = {
        JAN: '1', 
        FEB: '2', 
        MAR: '3', 
        APR: '4', 
        MAY: '5', 
        JUN: '6', 
        JUL: '7', 
        AUG: '8', 
        SEP: '9', 
        OCT: '10', 
        NOV: '11', 
        DEC: '12' 
    };

    constants.DAY_OF_WEEK = {
        SUN: '0', 
        MON: '1', 
        TUE: '2', 
        WED: '3', 
        THU: '4', 
        FRI: '5', 
        SAT: '6' 
    };

    constants.END_OF_MONTH = [ 31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31 ];

    constants.MIN_DATE = new Date(1970, 0, 1, 0, 0);

    constants.MAX_DATE = new Date(9999, 11, 31, 23, 59);

    //Can re-define these.
    constants.FIELD_RANGE = {
        minutes: { min: 0, max: 59 }, 
        hours: { min: 0, max: 23 },
        minutesOfDay: { min: 0, max: 1439 },
        dayOfMonth: { min: 1, max: 31 }, 
        month: { min: 1, max: 12 }, 
        dayOfWeek: { min: 0, max: 6}, 
        year: {
            min: constants.MIN_DATE.getFullYear(),
            max: constants.MAX_DATE.getFullYear()
        }
    };

    return constants;
});

(function(global, factory) {
    /// Ready Expression
    'use strict';

    var molar;

    if (typeof module === 'object' && module.exports) molar = module.exports;
    else molar = global.molar = global.molar || {};

    molar.ready = molar.ready || {};

    factory(molar);
})(window, function(molar) {
    var ready = molar.ready;

    ready.Expression = Expression;

    function Expression(expression) {
        var fields = expression.split(' ');

        if (fields.length < 5 || fields.length > 6)
            throw 'Expression contains invalid number of fields';

        this.expression = expression;

        this.type = fields.length === 5 ?
            ready.constants.EXPRESSION_TYPE.MINUTES : ready.constants.EXPRESSION_TYPE.STANDARD;

        var isWildCard = true,
            invalidFields = [],
            fieldNames = ready.constants.FIELD_NAMES[this.type];

        for (var i = 0; i < fields.length; i++) {
            var fieldName = fieldNames[i],
                field = ready.helpers.parseField(fields[i], fieldName);

            if (field == null || !ready.helpers.validateField(field))
                invalidFields.push(fieldName);
            
            isWildCard &= field.type === ready.constants.FIELD_TYPE.WILD_CARD;

            this[fieldName] = field;
        }

        if (invalidFields.length > 0) 
            throw 'Expression \'' + invalidFields.join(', ') + '\' format error';
        
        //If expression is '* * * * * *' then flag as such.
        if (isWildCard) 
            this.isWildCardExpression = true;
    }
    
    //Ignoring day of week for now.
    Expression.prototype.getIterator = function() {
        var expressionIterator = molar.helpers.iterator(ready.helpers.getFieldsByPrecision(this)),
            interval = {
                startDate: new molar.DateBuilder(),
                endDate: new molar.DateBuilder()
            },
            currentField,
            wildPartIndex = 0;

        //Build wild card parts of interval first, going from left to right and stopping when we hit our first non-wild part.
        while (!molar.helpers.isUndefined(currentField = expressionIterator.next())) {
            if (currentField.type === ready.constants.FIELD_TYPE.WILD_CARD) {
                var range = ready.constants.FIELD_RANGE[currentField.name];

                //Shouldn't happen.
                if (range == null) 
                    throw 'Range was null for field \'' + currentField.name + '\'';

                interval.startDate.set(wildPartIndex, range.min);
                interval.endDate.set(wildPartIndex, range.max);

                wildPartIndex++;
            }
            else break;
        }

        //Return if entire expression is wild card.
        if (currentField == null) 
            return { 
                startDate: interval.startDate.build(), 
                endDate: interval.endDate.build() 
            };

        //Iterate non-wild parts of interval from this point forward.
        var partIterators = [];

        //If the first non-wild card field is a list, then we want to use a list iterator, otherwise just iterate values.
        if (currentField.type === ready.constants.FIELD_TYPE.LIST) {
            var listIterator = currentField.getFieldIterator();
            listIterator.isBlockIterator = true;

            partIterators.push(listIterator);
        }
        else
            partIterators.push(currentField.getIterator());

        //Iterate values for all subsequent fields.
        while (!molar.helpers.isUndefined(currentField = expressionIterator.next()))
            partIterators.push(currentField.getIterator());

        //Reverse iterators to start with lowest precision when incrementing, so behavior is like a clock.
        partIterators.reverse();

        var current,
            done = false;

        //Todo: make this have same return type as molar.helpers.iterator().
        return {
            current: function() {
                return current;
            },
            next: function() {
                //If we previously reached the end or if this is the end, then return null.
                if (done === true || (done = ready.helpers.incrementIteratorClock(partIterators) === false))
                    return null;

                var iterator,
                    currentValue,
                    startValue,
                    endValue;

                //Build out intervals and return.
                for (var i = 0, part = -1; i < partIterators.length; i++, part--) {
                    iterator = partIterators[i];
                    currentValue = iterator.current();

                    //Blocks treat range as a single yield with start and end dates instead of iterating each value.
                    if (iterator.isBlockIterator === true) {
                        if (currentValue.type === ready.constants.FIELD_TYPE.SINGLE)
                            startValue = endValue = currentValue.value;
                        else if (currentValue.type === ready.constants.FIELD_TYPE.RANGE) {
                            startValue = currentValue.minValue;
                            endValue = currentValue.maxValue;
                        }
                    }
                    else
                        startValue = endValue = currentValue;

                    setDateBuilder(interval.startDate, iterator.field, startValue);
                    setDateBuilder(interval.endDate, iterator.field, endValue);
                }

                current = {
                    start: interval.startDate.build(),
                    end: interval.endDate.build()
                };
                
                return current;
            }
        };

        //Todo: add support for day of week.
        function setDateBuilder(dateBuilder, field, value) {
            switch (field) {
                case ready.constants.FIELD_NAME.MINUTES:
                    dateBulder.minutes(value);
                    break;
                case ready.constants.FIELD_NAME.HOURS:
                    dateBuilder.hours(value);
                    break;
                case ready.constants.FIELD_NAME.MINUTES_OF_DAY:
                    var conversion = value / 60,
                        minutes = Math.round((conversion % 1) * 60),
                        hours = Math.floor(conversion);

                        dateBuilder.minutes(minutes);
                        dateBuilder.hours(hours);
                    break;
                case ready.constants.FIELD_NAME.DAY_OF_MONTH:
                    dateBuilder.date(ready.helpers.scrubDayOfMonth(value, dateBuilder.getMonth(), dateBuilder.getYear()));
                    break;
                case ready.constants.FIELD_NAME.MONTH:
                    dateBuilder.month(value - 1); //Shift month field by 1.
                    break;
                case ready.constants.FIELD_NAME.YEAR:
                    dateBuilder.year(value);
                    break;
                default:
                    throw 'Field \'' + field + '\' is invalid';
            }
        }
    };
});

(function(global, factory) {
    /// Ready Field
    'use strict';

    var molar;

    if (typeof module === 'object' && module.exports) molar = module.exports;
    else molar = global.molar = global.molar || {};

    molar.ready = molar.ready || {};

    factory(molar);
})(window, function(molar) {
    var ready = molar.ready;
    
    ready.RangeField = RangeField;
    ready.ListField = ListField;
    ready.SingleField = SingleField;
    ready.WildCardField = WildCardField;

    //Base class.
    function Field(name, type, isBlockField) { 
        this.name = name; 
        this.type = type; 
        this.isBlockField = isBlockField || false;
    }
    
    Field.prototype.getIterator = function() {
        var values = this.isBlockField === true ? [ this ] : ready.helpers.getIteratorValues(this),
            iterator = molar.helpers.iterator(values);

        iterator.field = this.name;
        iterator.isBlockIterator = this.isBlockField === true;
        
        return iterator;
    };

    var fieldBase = Field.prototype;

    function RangeField(name, minValue, maxValue, isBlockField) {
        Field.call(this, name, ready.constants.FIELD_TYPE.RANGE, isBlockField);

        this.minValue = +minValue;
        this.maxValue = +maxValue;
    }

    RangeField.prototype = Object.create(fieldBase);

    function ListField(name, values, isBlockField) {
        Field.call(this, name, ready.constants.FIELD_TYPE.LIST, isBlockField);

        this.rawValues = values;
        this.values = ready.helpers.decomposeList(name, values);
    }

    ListField.prototype = Object.create(fieldBase);

    //Iterate fields so we can deal with blocks instead of just single values.
    ListField.prototype.getFieldIterator = function() {
        var iterator = molar.helpers.iterator(this.values);

        iterator.field = this.name;
        iterator.isBlockIterator = this.isBlockField === true;

        return iterator;
    };

    function SingleField(name, value, isBlockField) {
        Field.call(this, name, ready.constants.FIELD_TYPE.SINGLE, isBlockField);

        this.value = +value;
    }

    SingleField.prototype = Object.create(fieldBase);
    
    function WildCardField(name) { 
        Field.call(this, name, ready.constants.FIELD_TYPE.WILD_CARD);
    }

    WildCardField.prototype = Object.create(fieldBase);

    WildCardField.parse = function(field) {
        var range = ready.constants.FIELD_RANGE[field.name];

        if (field.type === ready.constants.FIELD_TYPE.WILD_CARD)
            return field;
        
        if (ready.helpers.isInterval(field, range.min, range.max))
            return new ready.WildCardField(field.name);
        
        return null;
    };
});

(function(global, factory) {
    /// Ready Helpers
    'use strict';

    var molar;

    if (typeof module === 'object' && module.exports) molar = module.exports;
    else molar = global.molar = global.molar || {};

    molar.ready = molar.ready || {};

    factory(molar);
})(window, function(molar) {
    var ready = molar.ready,
        helpers = ready.helpers = {},
        rangeRegex  = /^(\w+)-(\w+)$/,
        //Todo: add support for single and range values in a list??
        listRegex = /^(\w+,)+\w+$/,
        singleRegex = /^(\d{1,4}|[A-Za-z]{3})$/;

    //Todo: add day of week expression in here.
    helpers.getFieldsByPrecision = function(expression) {
        var fields;

        switch (expression.type) {
            case ready.constants.EXPRESSION_TYPE.MINUTES:
                fields = [
                    expression.minutesOfDay,
                    expression.dayOfMonth,
                    expression.month,
                    expression.year
                ];
                break;
            case null:
            case ready.constants.EXPRESSION_TYPE.STANDARD:
                fields = [
                    expression.minutes,
                    expression.hours,
                    expression.dayOfMonth,
                    expression.month,
                    expression.year
                ];
                break;
            default:
                throw 'Expression type \'' + expression.type + '\' is invalid';
        }

        return fields;
    };

    helpers.parseField = function(field, fieldName) {
        var isBlockField = this.isBlockField(fieldName),
            match = field.match(rangeRegex),
            parsed,
            map;

        if (match) {
            var min = match[1],
                max = match[2];

            map = helpers.getMap(fieldName);

            if (map) {
                min = map[min] || min;
                max = map[max] || max;
            }

            if (isBlockField)
                parsed = new ready.RangeField(fieldName, min, max, true);
            else {
                var range = new ready.RangeField(fieldName, min, max);

                parsed = ready.WildCardField.parse(range, fieldName) || range;
            }

            return parsed;
        }

        match = field.match(listRegex);

        if (match) {
            var values = field.split(',');

            map = helpers.getMap(fieldName);

            if (map)
                values = values.map(function(value) {
                    return map[value] || value;
                });

            parsed = new ready.ListField(fieldName, values, isBlockField);

            var list = parsed.values;

            //If list got consolidated into a single range, then set parsed to that.
            if (molar.helpers.isArray(list) && list.length === 1 && list[0].type === ready.constants.FIELD_TYPE.RANGE)
                parsed = list[0];

            return ready.WildCardField.parse(parsed, fieldName) || parsed;
        }

        match = field.match(singleRegex);

        if (match) {
            var value = field;

            if (fieldName === ready.constants.FIELD_NAME.MONTH)
                value = ready.constants.MONTH[value] || value;
            else if (fieldName === ready.constants.FIELD_NAME.DAY_OF_WEEK)
                value = ready.constants.DAY_OF_WEEK[value] || value;

            return new ready.SingleField(fieldName, value, isBlockField);
        }

        if (field.trim() === '*')
            return new ready.WildCardField(fieldName);

        throw 'Failed to parse field \'' + fieldName + '\' with value \'' + field + '\'';
    };

    helpers.validateField = function(field) {
        var range = ready.constants.FIELD_RANGE[field.name];

        if (field.type === ready.constants.FIELD_TYPE.WILD_CARD)
            return true;
        
        if (field.type === ready.constants.FIELD_TYPE.SINGLE)
            return field.value >= range.min && field.value <= range.max;
        
        if (field.type === ready.constants.FIELD_TYPE.RANGE)
            return field.minValue >= range.min && field.maxValue <= range.max;
        
        if (field.type === ready.constants.FIELD_TYPE.LIST)
            return field.values.every(function(val) { return helpers.validateField(val, field.name); });
        
        return false;
    };

    helpers.intersectField = function(field, value) {
        value = +value;

        if (field.type === ready.constants.FIELD_TYPE.WILD_CARD)
            return ready.constants.FIELD_RANGE[field.name].max;
        
        if (field.type === ready.constants.FIELD_TYPE.SINGLE && value == field.value)
            return field.value;
        
        if (field.type === ready.constants.FIELD_TYPE.RANGE && value >= field.minValue && value <= field.maxValue)
            return field.maxValue;
        
        if (field.type === ready.constants.FIELD_TYPE.LIST)
            for (var i = 0; i < field.values.length; i++) {
                var val = helpers.intersectField(field.values[i], value);

                if (val) return val;
            }
        
        return null;
    };

    helpers.isBlockField = function(fieldName) {
        return fieldName === ready.constants.FIELD_NAME.MINUTES_OF_DAY;
    };

    helpers.isInterval = function(field, minValue, maxValue) {
        //Start with a silly case.
        if (field.type === ready.constants.FIELD_TYPE.SINGLE)
            return field.value == minValue && field.value == maxValue;
        
        if (field.type === ready.constants.FIELD_TYPE.RANGE)
            return field.minValue == minValue && field.maxValue == maxValue;
        
        if (field.type === ready.constants.FIELD_TYPE.LIST) {
            //If there is more than one consolidated value, then interval is fragmented.
            if (field.values.length !== 1) 
                return false;
            
            return helpers.isInterval(field.values[0], minValue, maxValue);
        }
        
        return false;
    };

    helpers.decomposeList = function(fieldName, values, i, start, run) {
        i = i || 0; 
        run = run || [];

        var current = +values[i], 
            isEnd = i === values.length;

        //If we're at the end, current is null so don't throw in that case.
        if (!(isEnd || molar.helpers.isInteger(current)))
            throw 'Value \'' + current + '\' is not a valid integer';

        //If first pass.
        if (start == null) 
            start = current;
        //If this isn't our first rodeo.
        else if (i > 0) {
            var previous = +values[i - 1];

            if (previous + 1 !== current) {
                //Single value not in a range.
                if (previous === start) 
                    run.push(new ready.SingleField(fieldName, start));
                //Range of values.
                else 
                    run.push(new ready.RangeField(fieldName, start, previous));

                start = current;
            }
        }

        //Hit our base or reduction case.
        return isEnd ? run : helpers.decomposeList(fieldName, values, ++i, start, run);
    };

    helpers.getValueList = function(minValue, maxValue) {
        if (!(molar.helpers.isInteger(minValue) && molar.helpers.isInteger(maxValue)))
            return null;
        
        if (minValue > maxValue) 
            return null;
        
        if (minValue === maxValue) 
            return minValue;

        var values = [];

        for (var i = minValue; i <= maxValue; i++) 
            values.push(i);

        return values;
    };

    helpers.getMap = function(fieldName) {
        if (fieldName === ready.constants.FIELD_NAME.MONTH)
            return ready.constants.MONTH;
        else if (fieldName === ready.constants.FIELD_NAME.DAY_OF_WEEK)
            return ready.constants.DAY_OF_WEEK;
    };

    helpers.getDayOffset = function(expression, time, dayOfMonth, dayOfWeek) {
        var isWeekWildCard = expression.dayOfWeek.type === ready.constants.FIELD_TYPE.WILD_CARD,
            isMonthWildCard = expression.dayOfMonth.type === ready.constants.FIELD_TYPE.WILD_CARD;

        //If all wildcard, return the absolute max offset, which is most easily calculated with last day of month.
        if (isWeekWildCard && isMonthWildCard) 
            return ready.constants.FIELD_RANGE[expression.dayOfMonth.name].max - time.getDate();

        //Ignore wildcards when getting max offset.  Want to return the strictest interpretation.
        var monthOffset = !isMonthWildCard && dayOfMonth != null ? dayOfMonth - time.getDate() : null,
            weekOffset = !isWeekWildCard && dayOfWeek != null ? dayOfWeek - time.getDay() : null;

        if (monthOffset == null && weekOffset == null) 
            return null;
        
        if (monthOffset == null) 
            return weekOffset;
        
        if (weekOffset == null) 
            return monthOffset;
        
        return monthOffset >= weekOffset ? monthOffset : weekOffset;
    };

    //If day of month is greater than number of days in a given month, return max for that month, accounting for leap years.
    //This is based on the Date object range of 0-11.
    helpers.scrubDayOfMonth = function(dayOfMonth, month, year) {
        if (dayOfMonth == null) 
            return null;

        var endOfMonth = ready.constants.END_OF_MONTH[month];

        if (dayOfMonth < endOfMonth)
            return dayOfMonth;
        
        //Account for leap years and set last day of month to correct value for given month.
        return month === 1 && year % 4 === 0 ? 29 : endOfMonth;
    };

    helpers.getIteratorValues = function(field) {
        if (field.type === ready.constants.FIELD_TYPE.WILD_CARD) {
            var range = ready.constants.FIELD_RANGE[field.name];

            //Shouldn't be null, but just in case.
            if (range == null) 
                return null;

            return helpers.getValueList(range.min, range.max);
        }
        if (field.type === ready.constants.FIELD_TYPE.SINGLE)
            return [field.value];
        
        if (field.type === ready.constants.FIELD_TYPE.RANGE)
            return helpers.getValueList(field.minValue, field.maxValue);
        
        if (field.type === ready.constants.FIELD_TYPE.LIST) {
            if (!molar.helpers.isArray(field.values))
                return null;

            var values = [];

            for (var i = 0; i < field.values.length; i++) {
                var value = field.values[i];

                if (value.type === ready.constants.FIELD_TYPE.SINGLE || value.type === ready.constants.FIELD_TYPE.RANGE)
                    values = values.concat(helpers.getIteratorValues(value));
                //If we get an unexpected field type, just return null.
                else return null;
            }

            return values;
        }
        
        return null;
    };

    helpers.incrementIteratorClock = function(iterators, i) {
        var iterator = iterators[i = i || 0];

        if (iterator == null) 
            return false;
        
        if (!helpers.incrementIteratorClock(iterators, i + 1) && iterator.next() == null) {
            //If top-level iterator exhausted, then reset all.  Feels a little crude doing it this way.
            if (i == 0) 
                iterators.forEach(function(it) { 
                    it.reset(); 
                });
            else {
                //Re-initialize
                iterator.reset();
                iterator.next();
            }

            return false;
        }
        //Initialize
        else if (iterator.current() == null) 
            iterator.next();

        return true;
    };
});

(function(global, factory) {
    /// Ready
    'use strict';

    var molar;

    if (typeof module === 'object' && module.exports) molar = module.exports;
    else molar = global.molar = global.molar || {};

    molar.ready = molar.ready || {};

    factory(molar);
})(window, function(molar) {
    molar.Ready = Ready;

    var ready = molar.ready;

    //Todo: make min and max dates configurable.
    function Ready(expression) {
        this.expression = new ready.Expression(expression);
    }
    
    //Originally this didn't construct the end date, just returned true/false.  If there is a performance issue, could bring that logic back and have a separate function for getting end date of an interval...
    //Todo: convert this into interval so it returns start and end.
    Ready.prototype.intersects = function(time) {
        if (!molar.helpers.isDate(time))
            throw 'Argument is not a valid Date object';

        if (this.expression.isWildCardExpression)
            return ready.constants.MAX_DATE;

        //Don't want to alter the original time, so create local copy.
        var t = new Date(time), year = ready.helpers.intersectField(this.expression.year, t.getFullYear());

        if (year == null)
            return null;

        var month = ready.helpers.intersectField(this.expression.month, t.getMonth() + 1); //getMonth() returns 0-11 so add 1.

        if (month == null)
            return null;

        month = month - 1; //Convert back to Date() month.

        var dayOfMonth = ready.helpers.intersectField(this.expression.dayOfMonth, t.getDate()),
            dayOfWeek = ready.helpers.intersectField(this.expression.dayOfWeek, t.getDay());

        //Seems when both day of month and day of week specified in cron, it honors both, so doing that here for now.
        if (dayOfMonth == null && dayOfWeek == null)
            return null;

        var hours = ready.helpers.intersectField(this.expression.hours, t.getHours());

        if (hours == null)
            return null;

        var minutes = ready.helpers.intersectField(this.expression.minutes, t.getMinutes());

        if (minutes == null)
            return null;

        if (this.expression.minutes.type !== ready.constants.FIELD_TYPE.WILD_CARD)
            return new Date(t.setMinutes(minutes));

        if (this.expression.hours.type !== ready.constants.FIELD_TYPE.WILD_CARD)
            return new Date(t.getFullYear(), t.getMonth(), t.getDate(), hours, minutes);

        if (!(this.expression.dayOfWeek.type === ready.constants.FIELD_TYPE.WILD_CARD && this.expression.dayOfMonth.type === ready.constants.FIELD_TYPE.WILD_CARD)) {
            month = t.getMonth();
            year = t.getFullYear();
            //Account for leap years and variable number of days in month.
            dayOfMonth = ready.helpers.scrubDayOfMonth(dayOfMonth, month, year);

            //Need to get max offset from day of month and day of week to figure out the furthest out end date.
            var dayOffset = ready.helpers.getDayOffset(this.expression, t, dayOfMonth, dayOfWeek);

            return new Date(year, month, t.getDate() + dayOffset, hours, minutes);
        }
        
        if (this.expression.month.type !== ready.constants.FIELD_TYPE.WILD_CARD) {
            year = t.getFullYear();
            dayOfMonth = ready.helpers.scrubDayOfMonth(dayOfMonth, month, year);

            return new Date(year, month, dayOfMonth, hours, minutes);
        }

        //Todo: if max date becomes configurable, then will need to scrub day of month.
        return new Date(year, month, dayOfMonth, hours, minutes);
    };
});
