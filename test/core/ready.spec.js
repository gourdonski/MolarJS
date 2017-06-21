describe('Ready', function() {
    it('creates valid expression', function () {
        var ready = new molar.Ready('0-59 0,12 1,4,5,6,7,10 1,2,3 SUN,MON,TUE,THU,FRI,SAT 2016'),
            expression = ready.expression;

        expect(expression.minutes.type).toBe('*');

        expect(expression.hours.type).toBe('List');

        expect(expression.dayOfMonth.values.length).toBe(3);

        expect(expression.month.type).toBe('Range');

        expect(expression.dayOfWeek.values.length).toBe(2);

        expect(expression.dayOfWeek.rawValues.length).toBe(6);

        expect(expression.year.type).toBe('Single');

        //Test all wild card expression.
        ready = new molar.Ready('* * * * * *');

        expect(ready.expression.isWildCardExpression).toBe(true);

        //Test invalide expression.
        expect(function() { new molar.Ready('60 * * * * *'); }).toThrow();
    });

    it('returns valid intersection', function() {
        //Test valid intersection.
        var ready = new molar.Ready('* 0,12 * * 0-6 *'),
            time = new Date(1970, 0, 1, 12, 0),
            intersects = ready.intersects(time);
        
        expect(intersects).not.toBeNull();

        //Test no intersection.
        time = new Date(1970, 0, 1, 13, 0);
        intersects = ready.intersects(time);

        expect(intersects).toBeNull();
    });

    it('returns valid end date for current interval', function() {
        var MINUTE = 60000,
            HOUR = 3600000,
            DAY = 86400000,
            //Test minutes.
            ready = new molar.Ready('0-15 * * * * *'),
            time = new Date(new Date().setMinutes(8)),
            ends = ready.intersects(time);

        expect(ends - time).toBe(7 * MINUTE);

        //Test minutes with other fields specified.
        ready = new molar.Ready('0-15 0-12 1-15 * THU,FRI,SAT *');
        time = new Date(new Date(1970, 0, 1, 0, 0));
        ends = ready.intersects(time);

        expect(ends - time).toBe(15 * MINUTE);

        //Test hours.
        ready = new molar.Ready('* 0-12 * * * *');
        time = new Date(9999, 11, 31, 2, 0);
        ends = ready.intersects(time);

        expect(ends - time).toBe((10 * HOUR) + (59 * MINUTE));

        //Test day of week.
        ready = new molar.Ready('* * * * THU,FRI,SAT *');
        time = new Date(1970, 0, 1);
        ends = ready.intersects(time);

        expect(ends - time).toBe((DAY * 2) + (23 * HOUR) + (59 * MINUTE));

        //Test day of month.
        ready = new molar.Ready('* * 1-15 * * *');
        time = new Date(1970, 0, 1);
        ends = ready.intersects(time);

        expect(ends - time).toBe((DAY * 14) + (23 * HOUR) + (59 * MINUTE));

        //Test day of month later than day of week.
        ready = new molar.Ready('* * 1-15 * THU,FRI,SAT *');
        time = new Date(1970, 0, 1);
        ends = ready.intersects(time);

        expect(ends - time).toBe((DAY * 14) + (23 * HOUR) + (59 * MINUTE));

        //Test day of week later than day of month.
        ready = new molar.Ready('* * 1-2 * THU,FRI,SAT *');
        time = new Date(1970, 0, 1);
        ends = ready.intersects(time);

        expect(ends - time).toBe((DAY * 2) + (23 * HOUR) + (59 * MINUTE));

        //Test day of week and day of month no overlap.
        ready = new molar.Ready('* * 15-31 * THU,FRI,SAT *');
        time = new Date(1970, 0, 1);
        ends = ready.intersects(time);

        expect(ends - time).toBe((DAY * 2) + (23 * HOUR) + (59 * MINUTE));

        ready = new molar.Ready('* * 1-15 * MON-WED *');
        time = new Date(1970, 0, 1);
        ends = ready.intersects(time);

        expect(ends - time).toBe((DAY * 14) + (23 * HOUR) + (59 * MINUTE));

        //Test month.
        ready = new molar.Ready('* * * 2,3,4,7,8,10 * *');
        time = new Date(1970, 6, 1);
        ends = ready.intersects(time);

        expect(ends - time).toBe((DAY * 61) + (23 * HOUR) + (59 * MINUTE));

        //Test year.
        ready = new molar.Ready('* * * * * 1970-1971');
        time = new Date(1970, 0, 1);
        ends = ready.intersects(time);

        expect(ends - time).toBe((DAY * 729) + (23 * HOUR) + (59 * MINUTE));

        //Test wild card.
        ready = new molar.Ready('* * * * * *');
        time = new Date(9999, 11, 31, 23, 58);
        ends = ready.intersects(time);

        expect(ends - time).toBe(MINUTE);

        //Test day of month boundary case.
        ready = new molar.Ready('* * * 2 * *');
        time = new Date(1971, 1, 27, 23, 59);
        ends = ready.intersects(time);

        expect(ends - time).toBe(DAY);

        //Test day of month boundary case for leap year.
        ready = new molar.Ready('* * * 2 * *');
        time = new Date(1972, 1, 27, 23, 59);
        ends = ready.intersects(time);

        expect(ends - time).toBe(DAY * 2);

        //Test out of interval.
        ready = new molar.Ready('0-1 * * * * *');
        time = new Date(1970, 0, 1, 0, 2);
        ends = ready.intersects(time);

        expect(ends).toBe(null);
    });

    it('returns a valid field iterator', function() {
        var ready = new molar.Ready('10,11,12,15 * 1 * * 1970'),
            expression = ready.expression,
            iterator,
            listIterator,
            current,
            count = 0;

        iterator = expression.minutes.getIterator();

        //We should only be getting back integers from the iterator.
        while (!molar.helpers.isUndefined(current = iterator.next()))
            expect(molar.helpers.isInteger(current)).toBe(true);

        iterator = expression.hours.getIterator();

        while (!molar.helpers.isUndefined(current = iterator.next()))
            count++;

        //Should have 24 values for hours wild card.
        expect(count).toBe(24);

        iterator = expression.dayOfMonth.getIterator();

        count = 0;

        //Should be able to iterate single values.
        while (!molar.helpers.isUndefined(current = iterator.next())) {
            expect(molar.helpers.isInteger(current)).toBe(true);

            count++;
        }

        //Should only get a single value when iterating single values.
        expect(count).toBe(1);

        //Test field iterator.
        iterator = expression.month.getIterator();

        //Should iterate to final month.
        current = iterator.seek(function(value) { return value === 12; });

        expect(current).toBe(12);

        //Shouldn't have any values after 12.
        expect(iterator.next()).not.toBeDefined();

        //Should be a List type, so expect a getFieldIterator function.
        expect(expression.minutes.getFieldIterator).toBeDefined();

        //Test list iterator.
        listIterator = expression.minutes.getFieldIterator();

        expect(listIterator.next().type).toBe('Range');

        expect(listIterator.next().value).toBe(15);

        //Test resetting iterator.
        listIterator.reset();
        
        expect(listIterator.next().minValue).toBe(10);

        expect(listIterator.peek().value).toBe(15);

        expect(listIterator.current().minValue).toBe(10);

        expect(listIterator.next().value).toBe(15);
    });

    it ('returns a valid expression iterator', function() {
        var ready = new molar.Ready('* 1,2,3,15 1-5 2,6 * 1970'),
            expressionIterator = ready.expression.getIterator(),
            current;

        while (expressionIterator.next() != null)
            current = expressionIterator.current();

        expect(current.start.getTime()).toBe(new Date(1970, 5, 5, 15, 0).getTime());
    });

    it ('returns a valid minutes of day expression', function() {
       var ready = new molar.Ready('870-930 * * * *');

        expect(ready.expression.minutesOfDay).toBeDefined();

        var expressionIterator = ready.expression.getIterator(),
            current = expressionIterator.next();

        expect(current.start.getMinutes()).toBe(30);

        expect(current.start.getHours()).toBe(14);

        expect(current.end.getMinutes()).toBe(30);

        expect(current.end.getHours()).toBe(15);
    });
});