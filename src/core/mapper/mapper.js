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
