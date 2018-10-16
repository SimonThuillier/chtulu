/**
 * @package HDate.js
 * @doc common.js : HDate class definition
 * @requires hb.util.cmn,hb.util.date,hb.util.trans
 */

let util = hb.util;
let hd = hb.util.date;
let trans = hb.util.trans;

let timeZoneOffset = new Date().getTimezoneOffset();
//console.log("timeZoneOffset : " + timeZoneOffset);

let _availableTypes = ["1","2","3","4","5","6","7","8"];

let _formatters = {
    "1":hd.getFormatterFromPattern(trans.FORMAT_STRS["1"]),
    "2":hd.getFormatterFromPattern(trans.FORMAT_STRS["2"]),
    "3":hd.getFormatterFromPattern(trans.FORMAT_STRS["3"]),
    "4":hd.getFormatterFromPattern(trans.FORMAT_STRS["4"]),
    "5":hd.getFormatterFromPattern(trans.FORMAT_STRS["5"]),
    "6":hd.getFormatterFromPattern(trans.FORMAT_STRS["6"]),
    "7":hd.getFormatterFromPattern(trans.FORMAT_STRS["7"]),
    "8":hd.getFormatterFromPattern(trans.FORMAT_STRS["8"])
};

let _intervalFormatter = hd.getFormatterFromPattern(trans.FORMAT_INTERVAL_STR);
let _canonicalFormatters = {
    "1":hd.getFormatterFromPattern(trans.FORMAT_CANONICAL_STRS["1"]),
    "2":hd.getFormatterFromPattern(trans.FORMAT_CANONICAL_STRS["2"]),
    "3":hd.getFormatterFromPattern(trans.FORMAT_CANONICAL_STRS["3"]),
    "4":hd.getFormatterFromPattern(trans.FORMAT_CANONICAL_STRS["4"]),
    "5":hd.getFormatterFromPattern(trans.FORMAT_CANONICAL_STRS["5"]),
    "6":hd.getFormatterFromPattern(trans.FORMAT_CANONICAL_STRS["6"]),
    "7":hd.getFormatterFromPattern(trans.FORMAT_CANONICAL_STRS["7"]),
    "8":hd.getFormatterFromPattern(trans.FORMAT_CANONICAL_STRS["8"])
};
/**
 * @doc HDate object constructor
 * @class hb.util.HDate
 * @param {string|number} type : "1" - "8"
 * @param {Date} date
 * @param {Date|null} endDate
 * @return {hb.util.HDate}
 */
let HDate = function(type,date,endDate = null)
{
    if(Number.isInteger(type)){type=type.toString();}
    if (_availableTypes.indexOf(type) === -1){throw "invalid type for HDate";}
    this.beginDate = new Date(date.getTime() - timeZoneOffset * 60 * 1000);
    this.endDate = (endDate !== null)?new Date(endDate.getTime() - timeZoneOffset * 60 * 1000):null;
    this.setType(type);
    return this;
};

let _prototype = {
    /**
     * @doc HDate prototype clone function
     * @returns {HDate}
     */
    clone : function() {
        return new util.HDate(this.type,hd.clone(this.beginDate),hd.clone(this.endDate));
    },
    /**
     * @doc : determines if two HDates are equals (same types and dates)
     * @param {HDate} hDate
     * @returns {boolean}
     */
    equals : function(hDate) {
        return (this.type === hDate.type && this.beginDate === hDate.beginDate &&
            this.endDate === hDate.endDate);
    },
    /**
     * @doc : returns the requested bound date : beginDate if 0 and endDate if 1
     * @param {int} bound : 0 or 1
     * @returns {Date}
     */
    getBoundDate : function(bound) {
        if (bound === 0){return this.beginDate;}
        else if(bound === 1){return this.endDate;}
        else{return null;}
    },
    /**
     * @doc : returns the canonical input for this HDate, eg the input to enter to reparse it
     * @returns {string}
     */
    getCanonicalInput : function()
    {
        let formatter = _canonicalFormatters[this.type];

        if(this.type === "2"){
            return (formatter(this.beginDate) + ";" + formatter(this.endDate));
        }
        else if(this.type === "4"){
            return formatter(hd.switchToNextMonth(hd.clone(this.beginDate)));
        }
        else{
            return formatter(this.beginDate);
        }
    },
    /**
     * @doc : gets the number of days between HDate begin date and end date
     * @returns {int}
     */
    getIntervalSize : function () {
        return hd.dayDiff(this.endDate,this.beginDate);
    },
    /**
     * @doc returns display of the interval for control during user entry
     * @returns {string}
     */
    getIntervalLabel:function() {
        return "[" + _intervalFormatter(this.beginDate) + " ; " + _intervalFormatter(this.endDate) + "]";
    },
    /**
     * @doc : determine if the HDate is exact ie its begin and endDate are the same (same day)
     * @returns {boolean}
     */
    isExact : function() {
        if(this.beginDate === null || this.endDate === null ||
            typeof this.beginDate === "undefined" || typeof this.endDate === "undefined"){return true;}
        return (hd.dayDiff(this.endDate,this.beginDate) === 0);
    },
    /**
     * @doc HDate json parser/creator function : returns the HDate generated from its JSON representation
     * @param {string} jsonStr
     * @returns {HDate}
     */
    parseFromJson : function(jsonStr)
    {
        let jsonObj = JSON.parse(jsonStr);
        /*console.log("date avant parsage : " + jsonObj.beginDate);
        console.log(jsonObj.beginDate.substring(0,1));
        console.log(jsonObj.beginDate.substring(0,1) === "-");
        console.log(jsonObj.beginDate.substring(1));*/
        if(jsonObj.beginDate !== null && jsonObj.beginDate.substring(0,1) === "-"){
            jsonObj.beginDate = jsonObj.beginDate.substring(1);
            while(jsonObj.beginDate.substring(0,1) === "0"){jsonObj.beginDate = jsonObj.beginDate.substring(1);}
            //console.log(jsonObj.beginDate.indexOf("-"));
            while(jsonObj.beginDate.indexOf("-") < 4){jsonObj.beginDate = "0" + jsonObj.beginDate;}
            //console.log(jsonObj.beginDate);
            jsonObj.beginDate = new Date(Date.parse(jsonObj.beginDate));
            //console.log(jsonObj.beginDate);
            jsonObj.beginDate.setFullYear(-jsonObj.beginDate.getFullYear());
            //console.log(-jsonObj.beginDate.getFullYear());
        }
        else{
            jsonObj.beginDate = new Date(Date.parse(jsonObj.beginDate));
        }
        if(jsonObj.endDate !== null && jsonObj.endDate.substring(0,1) === "-"){
            jsonObj.endDate = jsonObj.endDate.substring(1);
            while(jsonObj.endDate.substring(0,1) === "0"){jsonObj.endDate = jsonObj.endDate.substring(1);}
            while(jsonObj.endDate.indexOf("-") < 4){jsonObj.endDate = "0" + jsonObj.endDate;}
            jsonObj.endDate = new Date(Date.parse(jsonObj.endDate));
            jsonObj.endDate.setFullYear(-jsonObj.endDate.getFullYear());
        }
        else{
            jsonObj.endDate = new Date(Date.parse(jsonObj.endDate));
        }

        //console.log("date parsée : " + jsonObj.beginDate);
        return new util.HDate(jsonObj.type,jsonObj.beginDate,jsonObj.endDate);
    },
    /**
     * @doc type setter for HDate
     * @param {string|number} type : "1" - "8"
     */
    setType(type) {
        if(Number.isInteger(type)){type=type.toString();}
        switch(type){
            case "1":
                this.endDate = hb.util.date.clone(this.beginDate);
                break;
            case "2":
                this.endDate = (this.endDate !== null)?this.endDate:hd.clone(this.beginDate);
                if(hd.dayDiff(this.endDate,this.beginDate) === 0) hd.addDay(this.endDate,1);
                break;
            case "3":
                hd.rewindToMonthFirst(this.beginDate);
                this.endDate = hd.addDay(hd.switchToNextMonth(hd.clone(this.beginDate),true),-1);
                break;
            case "4":
                hd.rewindToSeasonFirst(this.beginDate);
                this.endDate = hd.addDay(hd.switchToNextSeason(hd.clone(this.beginDate),true),-1);
                break;
            case "5":
                hd.rewindToYearFirst(this.beginDate);
                this.endDate = hd.addDay(hd.switchToNextYear(hd.clone(this.beginDate),true),-1);
                break;
            case "6":
                hd.rewindToDecadeFirst(this.beginDate);
                this.endDate = hd.addDay(hd.switchToNextDecade(hd.clone(this.beginDate),true),-1);
                break;
            case "7":
                hd.rewindToCenturyFirst(this.beginDate);
                this.endDate = hd.addDay(hd.switchToNextCentury(hd.clone(this.beginDate),true),-1);
                break;
            case "8":
                hd.rewindToMillenniumFirst(this.beginDate);
                this.endDate = hd.addDay(hd.switchToNextMillennium(hd.clone(this.beginDate),true),-1);
                break;
            default:break;
        }
        this.type = type;
    },
    /**
     * @doc : return display label for this HDate
     * @returns {string}
     */
    getLabel() {
        let formatter = _formatters[this.type];
        let pieces=[];
        let label = formatter(this.beginDate,pieces);
        let BC;

        // specific code for rendering
        if(this.type === "2") {
            let endPieces=[];
            formatter(this.endDate,endPieces);
            let totalLabel="";
            for (var index=4;index>-1;index--){
                if(pieces[index] === endPieces[index]){
                    totalLabel = pieces[index] + totalLabel;
                }
                else{index++;break;}
            }
            let preBeginLabel = "",preEndLabel = "";
            for(let index2=0;index2<index;index2++){
                preBeginLabel+= pieces[index2];
                preEndLabel+= endPieces[index2];
            }
            if(preBeginLabel !== ""){totalLabel = preBeginLabel + "~" + preEndLabel + totalLabel;}
            label = totalLabel;
        }
        else if(this.type === "1") {
            pieces[trans.PARSING_PLACEMENT["1"].DAY-1] +=trans.FORMAT_DAY_NUMBER_SUFFIX(trans.PARSING_PLACEMENT["1"].DAY-1);
            label = pieces.join("");
        }
        else if(this.type === "4" && (pieces[0]).toUpperCase() === trans.SEASON_NAMES[0]){
            pieces[pieces.length-1] = pieces[pieces.length-1] +
                ((Number(pieces[pieces.length-1])>=-1)?"-":"")  +
                (Number(pieces[pieces.length-1]) + 1);
            label = pieces.join("");
        }
        else if(this.type === "6"){
            label = trans.FORMAT_DECADE_LABEL + " " + label;
        }
        else if(this.type === "7"){
            let century = Math.floor(Number(label)/100);
            BC = century < 0;
            let absoluteCentury = BC?Math.abs(century):(century + 1);
            label = util.cmn.convertArabicToRoman(absoluteCentury) +
                trans.FORMAT_CENTURY_NUMBER_SUFFIX(absoluteCentury +"") + " " +
                trans.FORMAT_CENTURY_LABEL +
                (BC?(" " + trans.FORMAT_BC_LABEL):"");
        }
        else if(this.type === "8"){
            let millennium = Math.floor(Number(label)/1000);
            BC = millennium < 0;
            let absoluteMillennium = BC?Math.abs(millennium):(millennium + 1);
            label = util.cmn.convertArabicToRoman(absoluteMillennium) +
                trans.FORMAT_CENTURY_NUMBER_SUFFIX(absoluteMillennium +"") + " " +
                trans.FORMAT_MILLENNIUM_LABEL +
                (BC?(" " + trans.FORMAT_BC_LABEL):"");
        }
        return label;
    }
};

Object.assign(HDate.prototype,_prototype);

module.exports = HDate;