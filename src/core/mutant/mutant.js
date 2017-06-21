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
