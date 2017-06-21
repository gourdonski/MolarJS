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
