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
