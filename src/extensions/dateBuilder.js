(function(global, factory) {
    /// DateBuilder
    'use strict';

    var molar;

    if (typeof module === 'object' && module.exports) molar = module.exports;
    else molar = global.molar = global.molar || {};

    factory(molar);
})(window, function(molar) {
    molar.DateBuilder = DateBuilder;

    //Can revisit how we set defaults.
    function DateBuilder(year, month, date, hours, minutes) { 
        this._date = [
            minutes || null,
            hours || null,
            date || 1,
            month || 0,
            year || new Date().getFullYear()
        ]; 
    }
    
    DateBuilder.prototype.minutes = function(minutes) {
        this._date[0] = minutes;
    };
    
    DateBuilder.prototype.hours = function(hours) {
        this._date[1] = hours;
    };
    
    DateBuilder.prototype.date = function(date) {
        this._date[2] = date;
    };
    
    DateBuilder.prototype.month = function(month) {
        this._date[3] = month;
    };
    
    DateBuilder.prototype.year = function(year) {
        this._date[4] = year;
    };

    DateBuilder.prototype.set = function(index, value) {
        molar.array.elementAt(this._date, index, value);
    };

    DateBuilder.prototype.getMinutes = function() {
        return this._date[0];
    };

    DateBuilder.prototype.getHours = function() {
        return this._date[1];
    };

    DateBuilder.prototype.getDate = function() {
        return this._date[2];
    };

    DateBuilder.prototype.getMonth = function() {
        return this._date[3];
    };

    DateBuilder.prototype.getYear = function() {
        return this._date[4];
    };
    
    DateBuilder.prototype.build = function() {
        return (function(minutes, hours, date, month, year) {
            return new Date(year, month, date, hours, minutes);
        }).apply(null, this._date);
    };
});
