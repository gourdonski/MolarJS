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
