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
