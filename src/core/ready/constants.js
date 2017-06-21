(function(global, factory) {
    /// Ready Constants
    'use strict';

    var molar;

    if (typeof module === 'object' && module.exports) molar = module.exports;
    else molar = global.molar = global.molar || {};

    (molar.ready = molar.ready || {}).constants = factory();
})(window, function() {
    var constants = {};

    constants.EXPRESSION_TYPE = {
        STANDARD: 'standard',
        MINUTES: 'minutes'
    };
    
    constants.FIELD_TYPE = {
        RANGE: 'Range', 
        LIST: 'List', 
        SINGLE: 'Single', 
        WILD_CARD: '*' 
    };
    
    constants.FIELD_NAME = {
        MINUTES: 'minutes', 
        HOURS: 'hours', 
        MINUTES_OF_DAY: 'minutesOfDay',
        DAY_OF_MONTH: 'dayOfMonth', 
        MONTH: 'month', 
        DAY_OF_WEEK: 'dayOfWeek', 
        YEAR: 'year'
    };

    constants.FIELD_NAMES = {};
    constants.FIELD_NAMES[constants.EXPRESSION_TYPE.STANDARD] = [
        constants.FIELD_NAME.MINUTES,
        constants.FIELD_NAME.HOURS,
        constants.FIELD_NAME.DAY_OF_MONTH,
        constants.FIELD_NAME.MONTH,
        constants.FIELD_NAME.DAY_OF_WEEK,
        constants.FIELD_NAME.YEAR
    ];
    constants.FIELD_NAMES[constants.EXPRESSION_TYPE.MINUTES] = [
        constants.FIELD_NAME.MINUTES_OF_DAY,
        constants.FIELD_NAME.DAY_OF_MONTH,
        constants.FIELD_NAME.MONTH,
        constants.FIELD_NAME.DAY_OF_WEEK,
        constants.FIELD_NAME.YEAR
    ];

    constants.MONTH = {
        JAN: '1', 
        FEB: '2', 
        MAR: '3', 
        APR: '4', 
        MAY: '5', 
        JUN: '6', 
        JUL: '7', 
        AUG: '8', 
        SEP: '9', 
        OCT: '10', 
        NOV: '11', 
        DEC: '12' 
    };

    constants.DAY_OF_WEEK = {
        SUN: '0', 
        MON: '1', 
        TUE: '2', 
        WED: '3', 
        THU: '4', 
        FRI: '5', 
        SAT: '6' 
    };

    constants.END_OF_MONTH = [ 31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31 ];

    constants.MIN_DATE = new Date(1970, 0, 1, 0, 0);

    constants.MAX_DATE = new Date(9999, 11, 31, 23, 59);

    //Can re-define these.
    constants.FIELD_RANGE = {
        minutes: { min: 0, max: 59 }, 
        hours: { min: 0, max: 23 },
        minutesOfDay: { min: 0, max: 1439 },
        dayOfMonth: { min: 1, max: 31 }, 
        month: { min: 1, max: 12 }, 
        dayOfWeek: { min: 0, max: 6}, 
        year: {
            min: constants.MIN_DATE.getFullYear(),
            max: constants.MAX_DATE.getFullYear()
        }
    };

    return constants;
});
