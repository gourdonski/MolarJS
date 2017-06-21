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
