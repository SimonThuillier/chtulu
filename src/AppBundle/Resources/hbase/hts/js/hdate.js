"use strict";





//functions of formatting
HDate.prototype.formatters = {
    "1":myFormatPatternDate('j F Y'),
    "2":myFormatPatternDate('j F Y'),
    "3":myFormatPatternDate('F Y'),
    "4":myFormatPatternDate('S Y'),
    "5":myFormatPatternDate('Y'),
    "6":myFormatPatternDate('Y'),
    "7":myFormatPatternDate('Y'),
    "8":myFormatPatternDate('Y')
};
HDate.prototype.canonicalInputFormatters = {
    "1":myFormatPatternDate('d/m/Y'),
    "2":myFormatPatternDate('d/m/Y'),
    "3":myFormatPatternDate('m/Y'),
    "4":myFormatPatternDate('s/Y'),
    "5":myFormatPatternDate('Y'),
    "6":myFormatPatternDate('Y'),
    "7":myFormatPatternDate('Y'),
    "8":myFormatPatternDate('Y')
};

/**
 * @doc HDate object constructor
 * @param {string|number} type : "1" - "8"
 * @param {Date} date
 * @param {Date|null} endDate
 * @return {HDate}
 */
function HDate(type,date,endDate = null)
{
    if(Number.isInteger(type)){type=Number.toString(type);}
    if (this.types.indexOf(type) === -1){throw "invalid type for HDate";}
    this.beginDate = date;
    this.endDate = endDate;
    this.setType(type);
    return this;
}

HDate.prototype = {
    PRECISE:"1",
    BOUNDED:"2",
    MONTH:"3",
    SEASON:"4",
    YEAR:"5",
    DECADE:"6",
    CENTURY:"7",
    MILLENIA:"8",
    availableTypes:["1","2","3","4","5","6","7","8"],


}




//return the canonical input for the HDate
HDate.prototype.getCanonicalInput = function()
{
    var formatter = this.canonicalInputFormatters[this.type];

    if(this.type === this.BOUNDED){
        return (formatter(this.beginDate) + ";" + formatter(this.endDate));
    }
    else if(this.type === this.SEASON){
        return formatter(this.beginDate.clone().switchToNextMonth(true));
    }
    else{
        return formatter(this.beginDate);
    }
};

/**
 * @doc HDate parser function : returns the HDate generated from its JSON representation
 * @param {string} jsonStr
 * @returns {HDate}
 */
HDate.prototype.parse = function(jsonStr)
{
    var jsonObj = JSON.parse(jsonStr);
    jsonObj.beginDate = new Date(Date.parse(jsonObj.beginDate));
    jsonObj.endDate = new Date(Date.parse(jsonObj.endDate));
    return new HDate(jsonObj.type,jsonObj.beginDate,jsonObj.endDate);
};













