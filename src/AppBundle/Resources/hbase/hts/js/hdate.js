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
HDate.prototype.intervalFormatter = myFormatPatternDate('d/m/Y');

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



/**
 * @doc HDate prototype clone function
 * @returns {HDate}
 */
HDate.prototype.clone = function()
{
    return new HDate(this.type,this.beginDate.clone(),this.endDate.clone());
};

/**
 * @doc : determines if two HDates are equals (same types and dates)
 * @param {HDate} hDate
 * @returns {boolean}
 */
HDate.prototype.equals = function(hDate)
{
    if (this.type === hDate.type && this.beginDate === hDate.beginDate &&
        this.endDate === hDate.endDate){return true;}
    return false;
};




/**
 * @doc : return the requested bound date : beginDate if 0 and endDate if 1
 * @param {int} bound : 0 or 1
 * @returns {Date}
 */
HDate.prototype.getBoundDate = function(bound)
{
    if (bound === 0){
        return this.beginDate;
    }
    else if(bound === 1){
        return this.endDate;
    }
    else{
        return null;
    }
};
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
 * @doc returns display of the interval for control during user entry
 * @returns {string}
 */
HDate.prototype.getIntervalLabel= function()
{
    var formatter = this.intervalFormatter;
    return "[" + formatter(this.beginDate) + " ; " + formatter(this.endDate) + "]";
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

/**
 * @doc type setter for HDates : to use for every type setting
 * @param {string|number} type : "1" - "8"
 * @return {HDate}
 */
HDate.prototype.setType = function(type)
{
    if(Number.isInteger(type)){type=Number.toString(type);}
    switch(type){
        case this.PRECISE:
            this.endDate = this.beginDate.clone();
            break;
        case this.BOUNDED:
            this.endDate = (this.endDate !== null)?this.endDate:this.beginDate.clone();
            if(this.endDate.dayDiff(this.beginDate) === 0) this.endDate.addDay(1);
            break;
        case this.MONTH:
            this.beginDate.rewindToMonthFirst();
            this.endDate = this.beginDate.clone().switchToNextMonth(true).addDay(-1);
            break;
        case this.SEASON:
            this.beginDate = this.beginDate.rewindToSeasonFirst();
            this.endDate = this.beginDate.clone().switchToNextSeason(true).addDay(-1);
            break;
        case this.YEAR:
            this.beginDate.rewindToYearFirst();
            this.endDate = this.beginDate.clone().switchToNextYear(true).addDay(-1);
            break;
        case this.DECADE:
            this.beginDate.rewindToDecadeFirst();
            this.endDate = this.beginDate.clone().switchToNextDecade(true).addDay(-1);
            break;
        case this.CENTURY:
            this.beginDate.rewindToCenturyFirst();
            this.endDate = this.beginDate.clone().switchToNextCentury(true).addDay(-1);
            break;
        case this.MILLENIA:
            this.beginDate.rewindToMilleniaFirst();
            this.endDate = this.beginDate.clone().switchToNextMillenia(true).addDay(-1);
            break;
        default:break;
    }
    this.type = type;
    return this;
};


/**
 * @doc : get the number of days between HDate begin date and end date
 * @returns {int}
 */
HDate.prototype.getIntervalSize = function ()
{
    return this.endDate.dayDiff(this.beginDate);
};
/**
 * @doc : return display label for this HDate
 * @returns {string}
 */
HDate.prototype.getLabel= function()
{
    var formatter = this.formatters[this.type];
    var pieces=[];
    var label = formatter(this.beginDate,pieces);
    var BC;

    // specific code for rendering
    if(this.type === this.BOUNDED) {
        var endPieces=[];
        formatter(this.endDate,endPieces);
        var totalLabel="";
        for (var index=4;index>-1;index--){
            if(pieces[index] === endPieces[index]){
                totalLabel = pieces[index] + totalLabel;
            }
            else{index++;break;}
        }
        var preBeginLabel = "",preEndLabel = "";
        for(var index2=0;index2<index;index2++){
            preBeginLabel+= pieces[index2];
            preEndLabel+= endPieces[index2];
        }
        if(preBeginLabel !== ""){totalLabel = preBeginLabel + "~" + preEndLabel + totalLabel;}
        label = totalLabel;
    }
    else if(this.type === this.PRECISE && pieces[0] === "1") {
        pieces[0] = "1er";
        label = pieces.join("");
    }
    else if(this.type === this.SEASON && (pieces[0]).toUpperCase() === "HIVER"){
        pieces[pieces.length-1] = pieces[pieces.length-1] +
            ((Number(pieces[pieces.length-1])>=-1)?"-":"")  +
            (Number(pieces[pieces.length-1]) + 1);
        label = pieces.join("");
    }
    else if(this.type === this.DECADE){
        label = "Années " + label;
    }
    else if(this.type === this.CENTURY){
        var century = Math.floor(Number(label)/100);
        BC = century < 0;
        var absoluteCentury = BC?Math.abs(century):(century + 1);

        label = arabicToRomanNumber(absoluteCentury) +
            ((absoluteCentury === 1)?"er":"e") +
            " siècle" +
            (BC?" Av. JC":"");
    }
    else if(this.type === this.MILLENIA){
        var millenia = Math.floor(Number(label)/1000);
        BC = millenia < 0;
        var absoluteMillenia = BC?Math.abs(millenia):(millenia + 1);

        label = arabicToRomanNumber(absoluteMillenia) +
            ((absoluteMillenia === 1)?"er":"e") +
            " millénaire" +
            (BC?" Av. JC":"");
    }
    return label;
};
/**
 * @doc : determine if the HDate is exact ie its begin and endDate are the same (same day)
 * @returns {boolean}
 */
HDate.prototype.isExact = function()
{
    if(this.beginDate === null || this.endDate === null ||
        typeof this.beginDate === "undefined" || typeof this.endDate === "undefined"){return true;}
    return (this.endDate.dayDiff(this.beginDate) === 0);
};












