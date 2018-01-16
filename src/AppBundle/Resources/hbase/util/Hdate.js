/**
 * @package HDate.js
 * @doc common.js : HDate class definition
 */
var hb = (function (hb) {
    "use strict";
    var _moduleName = "util:HDate/HDate.js";
    if(((typeof hb.getLoadedModules==="function"?hb.getLoadedModules():[])).includes(_moduleName)) {
        console.log(_moduleName + " already loaded, skipping");
        return hb;
    }
    hb.util = (function (util) {
        var _requiredModules = ["util:date/date.js","util:trans/translation.js"];
        let hd = hb.util.date;
        let trans = hb.util.trans;

        /**
         * @doc HDate object constructor
         * @class hb.util.HDate
         * @param {string|number} type : "1" - "8"
         * @param {Date} date
         * @param {Date|null} endDate
         * @return {hb.util.HDate}
         */
        util.HDate = function(type,date,endDate = null)
        {
            if(Number.isInteger(type)){type=type.toString();}
            if (this.types.indexOf(type) === -1){throw "invalid type for HDate";}
            this.beginDate = date;
            this.endDate = endDate;
            this.type = type;
            return this;
        };

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
        let _intervalFormatter = hd.getFormatterFromPattern(trans.FORMAT_INTERVAL_STR["1"]);

        let _prototype = {
            /**
             * @doc HDate prototype clone function
             * @returns {HDate}
             */
            clone : function() {
                return new HDate(this.type,hd.clone(this.beginDate),hd.clone(this.endDate));
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
                if (bound === 0){
                    return this.beginDate;
                }
                else if(bound === 1){
                    return this.endDate;
                }
                else{
                    return null;
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
             * @doc type setter for HDate
             * @param {string|number} type : "1" - "8"
             */
            set type(type) {
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
            get type() {
                return this.type;
            },
            /**
             * @doc : return display label for this HDate
             * @returns {string}
             */
            get label() {
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
                    pieces[trans.DAY_INDEX] = pieces[trans.DAY_INDEX] + trans.FORMAT_DAY_NUMBER_SUFFIX(pieces[trans.DAY_INDEX]);
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
                else if(this.type === this.MILLENIA){
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



    }

        Object.extend(util.HDate.prototype,_prototype);





        util.cmn = {
            /**
             * @doc capitalizes a string
             * @param {string} str
             * @return {string}
             */
            capitalize: function (str) {
                return str.charAt(0).toUpperCase() + this.slice(1);
            },
            /**
             * @doc converts an integer (arabic 10 base) to the corresponding roman number
             * @param number
             * @returns {string}
             */
            convertArabicToRoman: function (number) {
                number = Number(number);
                let remainder = number;
                let characters = ["M","D","C","L","X","V","I"];
                let values = [1000,500,100,50,10,5,1];
                let nos = [0,0,0,0,0,0,0];
                let romanNo ="";

                for (let index = 0; index < 7; index++) {
                    remainder -= (nos[index] = Math.floor(remainder / values[index])) * values[index];

                    if(index=== 6 && nos[index]=== 4){
                        if(nos[index-1]>0){romanNo = romanNo.substr(0,romanNo.length-1) + "IX";}
                        else{romanNo +="IV";}
                    }
                    else if(index=== 4 && nos[index]=== 4){
                        if(nos[index-1]>0){romanNo = romanNo.substr(0,romanNo.length-1) + "XC";}
                        else{romanNo +="XL";}
                    }
                    else if(index=== 2 && nos[index]=== 4){
                        if(nos[index-1]>0){romanNo = romanNo.substr(0,romanNo.length-1) + "CM";}
                        else{romanNo +="CD";}
                    }
                    else{
                        for(let index2=0;index2<nos[index];index2++){
                            romanNo += characters[index];
                        }
                    }
                }
                return romanNo;
            },
            /**
             * @doc returns and idGenerator function which returns at each call an id increased of 1 from 0
             * @returns {Function}
             */
            getIdGenerator : function () {
                let id = 0;
                return function () {
                    return ++id;
                };
            },
            /**
             * @doc replace a set of different old text in a String with replacement values and return its
             * @param {string} oldText
             * @param {*} replacements : an object with pairs "<VALUE TO REPLACE>" => REPLACEMENT
             * @returns {String}
             */
            multiReplace : function (oldText,replacements) {
                Object.keys(replacements).forEach(function(key,index) {
                    oldText = oldText.replace(key,replacements[key]);
                });
                return oldText;
            },
            /**
             * @doc returns the name of the module
             * @return {string}
             */
            getModuleName : function() {
                return _moduleName;
            },
            /**
             * @doc returns list of required modules and libraries for this module
             * @return {Array}
             */
            getRequiredModules : function () {
                return _requiredModules;
            }
        };
        console.log(_moduleName + " loaded");
        return util;
    }(hb.util || {}));

    let _loadedModules = ((typeof hb.getLoadedModules==="function")?hb.getLoadedModules():[]);
    _loadedModules.push(_moduleName);
    hb.getLoadedModules = function() {
        return _loadedModules;
    }
    return hb;
}(hb || {}));
