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
