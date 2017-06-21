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
