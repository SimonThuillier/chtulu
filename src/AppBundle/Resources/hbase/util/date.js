/**
 * @package hbase.js
 * @doc date.js : utilitary functions for date handling, parsing and formatting/rendering
 * @requires
 */
var hb = (function (hb) {
    "use strict";
    var _moduleName = "util:date/date.js";
    if(((typeof hb.getLoadedModules==="function"?hb.getLoadedModules():[])).includes(_moduleName)) {
        console.log(_moduleName + " already loaded, skipping");
        return hb;
    }
    hb.util = (function (util) {
        var _requiredModules = [];

        /**
         *
         * @doc declaration of private consts for formatting
         */
        const _formatCharacters = "([d|j|l|D|m|n|F|M|Y|c|y|z|S|s])";
        const _formatSeparators = "([/|_|:| ])";
        const _formatPatterns= ["^",
            _formatCharacters, _formatSeparators,"{0,1}",
            _formatCharacters, "*",_formatSeparators,"{0,1}",
            _formatCharacters, "*",_formatSeparators,"{0,1}",
            _formatCharacters, "*","$"].join('');
        const _formatRegex = new RegExp(_formatPatterns);
        const _formatYearRegex = new RegExp("(-*)(\\d+)");
        const _formatters = {
            /**
             * @doc returns day number with initial zero
             * @param {Date} date
             * @returns {string}
             */
            "d": function(date){return (date.getDate() < 10)?('0' + date.getDate()):date.getDate();},
            /**
             * @doc returns day number without initial zero
             * @param {Date} date
             * @returns {string}
             */
            "j": function(date){return (date.getDate()+"");},
            /**
             * @doc returns textual day
             * @param {Date} date
             * @returns {string}
             */
            "l": function(date){return DAY_NAMES[date.getDay()];},
            /**
             * @doc returns abridged textual day
             * @param {Date} date
             * @returns {string}
             */
            "D": function(date){return ABG_DAY_NAMES[date.getDay()];},
            /**
             * @doc returns month number with initial zero
             * @param {Date} date
             * @returns {string}
             */
            "m": function(date){return ((date.getMonth()+1) < 10)?('0' + (date.getMonth()+1)):(date.getMonth()+1);},
            /**
             * @doc returns month number without initial zero
             * @param {Date} date
             * @returns {string}
             */
            "n": function(date){return (date.getMonth()+1);},
            /**
             * @doc returns textual month
             * @param {Date} date
             * @returns {string}
             */
            "F": function(date){return MONTH_NAMES[date.getMonth()];},
            /**
             * @doc returns abridged textual month
             * @param {Date} date
             * @returns {string}
             */
            "M": function(date){return ABG_MONTH_NAMES[date.getMonth()];},
            /**
             * @doc returns textual season
             * @param {Date} date
             * @returns {string}
             */
            "S": function(date){return SEASON_NAMES[date.getSeason()];},
            /**
             * @doc returns season number (1 winter to 4 fall)
             * @param {Date} date
             * @returns {string}
             */
            "s": function(date){return (date.getSeason() +1 );},
            /**
             * @doc returns complete year number
             * @param {Date} date
             * @returns {string}
             */
            "Y": function(date){return (date.getFullYear()+"");},
            /**
             * @doc returns year number last two figures
             * @param {Date} date
             * @returns {string}
             */
            "y": function(date){
                let arrayDate = _formatYearRegex.exec(date.getFullYear() +"");
                if (arrayDate[2].length > 2){
                    return arrayDate[2].substring(arrayDate[2].length-2);
                }
                return arrayDate[1] + arrayDate[2];
            },
            /**
             * @doc returns last digit of year number
             * @param {Date} date
             * @returns {string}
             */
            "z": function(date){
                let arrayDate = _formatYearRegex.exec(date.getFullYear()+"");
                if (arrayDate[2].length > 1){
                    return arrayDate[2].substring(arrayDate[2].length-1);
                }
                return arrayDate[1] + arrayDate[2];
            },
            /**
             * @doc returns century of the year (3 digit or 0 if first gregorian year)
             * for negative years the "-" is displayed if the year is originally on the requested size
             * @param {Date} date
             * @returns {string}
             */
            "c": function(date){
                let arrayDate = _formatYearRegex.exec(date.getFullYear()+"");
                if (arrayDate[2].length > 3){
                    return arrayDate[2].substring(arrayDate[2].length-3);
                }
                return arrayDate[1] + arrayDate[2];
            }
        };


        /**
         * @module hb/util/date
         * @class hb.util.date
         */
        util.date = {
            /**
             * @doc add to a date a certain given number of day (accept negative number of day)
             * @param {Date} date
             * @param {int} nbDay
             * @returns {Date}
             */
            addDay: function(date,nbDay) {
                date.setDate(date.getDate() + nbDay);
                return date;
            },
            /**
             * @doc clone a date object and returns the clone
             * @param {Date} date
             * @returns {Date}
             */
            clone: function(date) {
                let copy = new Date();
                copy.setTime(date.getTime());
                copy.setHours(0,0,0,0);
                return copy;
            },
            /**
             * @doc corrects a date year to prevent incorrect interpretation with two figures dates (ex 63 ap JC)
             * @param {Date} date
             * @param {int} year
             * @returns {Date}
             */
            correctYear: function(date,year) {
                date.setFullYear(year);
                return date;
            },
            /**
             * @doc returns the entire number of days between two dates
             * @param {Date} endDate
             * @param {Date} beginDate
             * @returns {int}
             */
            dayDiff: function(endDate,beginDate) {
                return Math.round((endDate-beginDate)/(1000*60*60*24));
            },
            /**
             * @doc returns true if same day, false otherwise
             * @param {Date} date1
             * @param {Date} date2
             * @returns {boolean}
             */
            equals: function(date1,date2) {
                return (date1.dayDiff(date2) ===0);
            },
            /**
             * @doc returns the float number of days between two dates
             * @param {Date} endDate
             * @param {Date} beginDate
             * @returns {number}
             */
            floatDayDiff: function(endDate,beginDate) {
                return ((endDate-beginDate)/(1000*60*60*24));
            },
            /**
             * @doc returns french day numbering in week switched from sunday/0-saturday/6 to monday/0-sunday/6
             * @param {Date} date
             * @returns {int}
             */
            getFrenchDay: function(date) {
                return (date.getDay() + 6) % 7;
            },
            /**
             * @doc returns the simple html regex for dd/MM/yyyy dates
             * @returns {string}
             * @deprecated
             */
            getHtmlDateRegex: function() {
                return "^(0?[1-9]|[1-2][1-9]|3[0-1])/(0?[1-9]|1[0-2])/(-?[1-9][0-9]*)$";
            },
            /**
             * @doc returns season number of a date : 0 winter,1 spring, 2 summer, 3 fall
             * @param {Date} date
             * @returns {int}
             */
            getSeason: function(date) {
                let season = Math.floor(date.getMonth()/3);
                let isChangingMonth = ((date.getMonth()+1)%3) === 0;
                if (isChangingMonth && date.getDate() > 20 ) {season++;}
                return season%4;
            },
            /**
             * @doc returns the maximum date allowed, eg. now
             * @returns {Date}
             */
            getMaxDate: function() {
                return new Date();
            },
            /**
             * @doc returns the maximum year allowed, eg. current year
             * @returns {int}
             */
            getMaxYear: function() {
                return (new Date()).getFullYear();
            },
            /**
             * @doc sets the time of a date to 0 and returns it
             * @param {Date} date
             * @returns {Date}
             */
            stripHours: function(date) {
                date.setHours(0,0,0,0);
                return date;
            },
            /**
             * @doc rewind a date to the first day of its current month and returns it
             * @param {Date} date
             * @returns {Date}
             */
            rewindToMonthFirst: function(date) {
                date.setDate(1);
                return date;
            },
            /**
             * @doc rewinds a date to the first day of its current season and returns it
             * @param {Date} date
             * @returns {Date}
             */
            rewindToSeasonFirst: function(date) {
                let month;
                let isChangingYear = date.getMonth() === 11 && date.getDate() > 20;
                if (isChangingYear){
                    month = 11;
                }
                else{
                    let season = date.getSeason();
                    month = season*3 - 1;
                }
                date.setMonth(month);
                date.setDate(21);
                return date;
            },
            /**
             * @doc rewinds a date to the first day of its current year and returns it
             * @param {Date} date
             * @returns {Date}
             */
            rewindToYearFirst: function(date) {
                date.setDate(1);
                date.setMonth(0);
                return date;
            },
            /**
             * @doc rewinds a date to the first day of its current decade and returns it
             * @param {Date} date
             * @returns {Date}
             */
            rewindToDecadeFirst: function(date) {
                date.setDate(1);
                date.setMonth(0);
                date.setFullYear(Math.floor(date.getFullYear()/10)*10);
                return date;
            },
            /**
             * @doc rewinds a date to the first day of its current century and returns it
             * @param {Date} date
             * @returns {Date}
             */
            rewindToCenturyFirst: function(date) {
                date.setDate(1);
                date.setMonth(0);
                date.setFullYear(Math.floor(date.getFullYear()/100)*100);
                return date;
            },
            /**
             * @doc rewinds a date to the first day of its current millennium and returns it
             * @param {Date} date
             * @returns {Date}
             */
            rewindToMillenniumFirst: function(date) {
                date.setDate(1);
                date.setMonth(0);
                date.setFullYear(Math.floor(date.getFullYear()/1000)*1000);
                return date;
            },
            /**
             * @doc advances the date to next day (if force is true), then returns it
             * @param {Date} date
             * @param {boolean} force - if true increments of one day, else do nothing
             * @returns {Date}
             */
            switchToNextDay: function(date,force=false) {
                if (force===true) return this.addDay(date,1);
                return date;
            },
            /**
             * @doc advances the date to next Monday (default mode) ; if exact mode increment of exactly one week
             * if not force and date is already a monday nothing is done, exact to advance exactly of one week, then returns it
             * @param {Date} date
             * @param {boolean} force - if true increments even if the date is first day of week (monday), not if false
             * @param {boolean} exact - if true always increments the date of exactly one week
             * @returns {Date}
             */
            switchToNextWeek: function(date,force=false,exact=false) {
                if (exact) return date.addDay(7);
                let originDay = date.getFrenchDay();
                if(force || originDay  !== 0){
                    this.addDay(date,7 - originDay);
                }
                return date;
            },
            /**
             * @doc advances the date to first day of next month, then returns it
             * @param {Date} date
             * @param {boolean} force - if true increments even if the date is first day of month, not if false
             * @param {boolean} exact - if true always increments the date of exactly one month
             * @returns {Date}
             */
            switchToNextMonth: function(date,force=false,exact=false) {
                if (exact){
                    date.setMonth(date.getMonth()+1);
                    return date;
                }
                if(force || (date.getDate() !==1) ){
                    date.setMonth(date.getMonth()+1,1);
                }
                return date;
            },
            /**
             * @doc advances the date to first day of next season, then returns it
             * @param {Date} date
             * @param {boolean} force - if true increments even if the date is first day of season, not if false
             * @param {boolean} exact - if true always increments the date of exactly one season (3 months)
             * @returns {Date}
             */
            switchToNextSeason: function(date,force=false,exact=false) {
                if (exact){
                    date.setMonth(date.getMonth()+3);
                    return date;
                }
                let isChangingMonth = ((date.getMonth()+1)%3) === 0;
                let newMonth = date.getMonth()-((date.getMonth()+1)%3) + 3;

                date.setDate(21);
                if(force || ! (date.getDate() <22 && isChangingMonth) ){
                    date.setMonth(newMonth);
                }
                return date;
            },
            /**
             * @doc advances the date to first day of next year, then returns it
             * @param {Date} date
             * @param {boolean} force - if true increments even if the date is first day of year, not if false
             * @param {boolean} exact - if true always increments the date of exactly one year
             * @returns {Date}
             */
            switchToNextYear: function(date,force=false,exact=false) {
                if (exact){
                    date.setFullYear(date.getFullYear()+1);
                    return date;
                }
                if(force || (! (date.getMonth() === 0 && date.getDate() === 1)) ){
                    date.setFullYear(date.getFullYear()+1,0,1);
                }
                return date;
            },
            /**
             * @doc advances the date to first day of next decade, then returns it
             * @param {Date} date
             * @param {boolean} force - if true increments even if the date is first day of decade, not if false
             * @param {boolean} exact - if true always increments the date of exactly one decade
             * @returns {Date}
             */
            switchToNextDecade: function(date,force=false,exact=false) {
                if (exact){
                    date.setFullYear(date.getFullYear()+10);
                    return date;
                }
                let year = date.getFullYear();
                let decade = (Math.floor(year/10))*10;
                if(force || (! ( (year-decade)===0 && date.getMonth() === 0 && date.getDate() ===1)) ){
                    date.setFullYear(decade+10,0,1);
                }
                return date;
            },
            /**
             * @doc advances the date to first day of next century, then returns it
             * @param {Date} date
             * @param {boolean} force - if true increments even if the date is first day of century, not if false
             * @param {boolean} exact - if true always increments the date of exactly one century
             * @returns {Date}
             */
            switchToNextCentury: function(date,force=false,exact=false) {
                if (exact){
                    date.setFullYear(date.getFullYear()+100);
                    return date;
                }
                let year = date.getFullYear();
                let century = (Math.floor(year/100))*100;

                if(force ||  (! ( (year-century)===0 && date.getMonth() === 0 && date.getDate() ===1)) ){
                    date.setFullYear(century+100,0,1);
                }
                return date;
            },
            /**
             * @doc advances the date to first day of next millennium, then returns it
             * @param {Date} date
             * @param {boolean} force - if true increments even if the date is first day of millennium, not if false
             * @param {boolean} exact - if true always increments the date of exactly one millennium
             * @returns {Date}
             */
            switchToNextMillennium: function(date,force=false,exact=false) {
                if (exact){
                    date.setFullYear(date.getFullYear()+1000);
                    return date;
                }
                let year = date.getFullYear();
                let millennium = (Math.floor(year/1000))*1000;

                if(force || (! ( (year-millennium)=== 0 && date.getMonth() === 0 && date.getDate() ===1)) ){
                    date.setFullYear(millennium+1000,0,1);
                }
                return date;
            },
            /**
             * @doc returns the date formatter function corresponding to the wanted pattern
             * format given date using a simplified personal pattern expression (php inspired)
             * ## DAYS ##
             * [d] : day month n° with initial zero, [j] : day month n° without initial zero, [l] : textual day, [D] : abridged textual day
             * ## MONTHS ##
             * [m] : month number with initial zero, [n] : month number without initial zero, [F] : textual month, [M] : abridged textual month,
             * [S] : textual season, [s] : season index (1-4)
             * ## YEARS ##
             * [Y] : complete year, [y] year on two numbers, [z] : last digit of year, [c] century of the year (3 digit or 0 if first Gregorian year),
             * for negative years the - is displayed if the year is originally on the requested size
             * ## SEPARATORS ##
             * separators can be [/][_][:][a space] or nothing
             * @param {string} pattern - the string pattern with which format the date (ex : dd/MM/YY ). "-" can't be used as separator
             * @returns {function}
             */
            getFormatterFromPattern: function(pattern) {
                let regexArray = _formatRegex.exec(pattern);
                if (regexArray === null){throw ["The given pattern : ",pattern," isn't a valid date pattern."].join("");}
                // determine the required data and max index to loop on for the format function
                var maxIndex=7;
                if (typeof regexArray[maxIndex] ==='undefined'){maxIndex=5;}
                if (typeof regexArray[maxIndex] ==='undefined'){maxIndex=3;}
                if (typeof regexArray[maxIndex] ==='undefined'){maxIndex=1;}

                var DAY_NAMES = ['Dimanche','Lundi','Mardi','Mercredi','Jeudi','Vendredi','Samedi'];
                var ABG_DAY_NAMES = ['D','L','M','M','J','V','S'];
                var MONTH_NAMES = ['Janvier','Fevrier','Mars','Avril','Mai','Juin','Juillet','Aout','Septembre','Octobre','Novembre','Decembre'];
                var ABG_MONTH_NAMES = ['Janv.','Fev.','Mars','Avr.','Mai','Juin','Juil.','Aout','Sept.','Oct.','Nov.','Dec.'];
                var SEASON_NAMES = ['Hiver','Printemps','Eté','Automne'];

                /**
                 * @doc returns date formatted with the previously given pattern
                 * @param {Date} date
                 * @param {array} pieces - if given the function fills it with each piece of the rendered date
                 * @returns {string}
                 */
                function formatter (date,pieces=[]) {
                    for(var index=1;index<=maxIndex;index++){
                        if(typeof formatters[regexArray[index]] === 'function'){
                            pieces[index-1] = (formatters[regexArray[index]])(date);
                        }
                        else{
                            pieces[index-1] =regexArray[index];
                        }
                    }
                    return pieces.join('');
                }
                return formatter;
            },
            /**
             * @doc returns the parser for the given parsing style
             * @param {string} sDate
             * @param {string} type - parsing style to apply from "1" (PRECISE) to "8" (MILLENNIUM)
             * @param {array} errors - if provided, the function fills it with encountered errors
             * @returns {Date}
             */
            getParserFromStyle: function (type) {

            },


            /**
             * @doc parses a string to date according to one of the defined parsing styles
             * @param {string} sDate
             * @param {string} type - parsing style to apply from "1" (PRECISE) to "8" (MILLENNIUM)
             * @param {array} errors - if provided, the function fills it with encountered errors
             * @returns {Date}
             */
            parse: function(sDate,type,errors=[]) {
                let regexType = {"1":"(\\d{1,2})\/(\\d{1,2})\/(-?\\d{1,5})$",
                    "3": "\/?(\\d{1,2})\/(-?\\d{1,5})$",
                    "4": "\/?(\\d{1,2})\/(-?\\d{1,5})$",
                    "5": "\/?(-?\\d{1,5})$",
                    "6": "\/?(-?\\d{1,5})$",
                    "7": "\/?(-?\\d{1,5})$",
                    "8": "\/?(-?\\d{1,5})$"};

                let regex = new RegExp(regexType[type]);
                if (typeof regex === "undefined" || regex === null){
                    throw ["The given type : ",type," isn't a valid parsing style ('1' to '8' accepted)."].join("");
                }
                let regexArray = regex.exec(sDate);
                if (regexArray === null){
                    var typeLabelArray = {"1":"Précise","3":"mois","4":"saison","5":"année",
                        "6":"decennie","7":"siècle","8":"millénaire"};
                    var exampleLabelArray = {"1":"1/8/1985, 01/09/573, 2/06/-582",
                        "3":"8/1985,09/573,06/-582",
                        "4":"1/1985 (hiver 1985),4/-582 (automne -582)",
                        "5":"1985,573,-582",
                        "6":"1980,571,-580",
                        "7":"1980,571,-580",
                        "8":"1980,571,-580"};

                    errors.push("'"+ + " n'est pas convertible en date (" +
                        typeLabelArray[type] + "). Exemples de valeurs autorisées : " +
                        exampleLabelArray[type]);
                    return null;
                }

                let date = null;
                let day  = 1;
                let season = 1;
                let month = 1;
                let year = 1;
                switch(type){
                    case PRECISE:
                        day = parseInt(regexArray[1]);
                        month = parseInt(regexArray[2]);
                        year = parseInt(regexArray[3]);
                        break;
                    case MONTH:
                        month = parseInt(regexArray[1]);
                        year = parseInt(regexArray[2]);
                        break;
                    case SEASON:
                        season = parseInt(regexArray[1]);
                        year = parseInt(regexArray[2]);
                        month = (season-1)*3 + 1;
                        break;
                    case YEAR:
                        year = parseInt(regexArray[1]);
                        break;
                    case DECADE:
                        year = Math.floor(parseInt(regexArray[1])/10)*10;
                        break;
                    case CENTURY:
                        year = Math.floor(parseInt(regexArray[1])/100)*100;
                        break;
                    case MILLENIA:
                        year = Math.floor(parseInt(regexArray[1])/1000)*1000;
                        break;

                    default: break;
                }

                if(day<1 || day>31){errors.push("Le jour '" + day + "' est invalide");}
                if(season<1 || season>4){errors.push("La saison '" + season + "' est invalide");}
                if(month<1 || month>12){errors.push("Le mois '" + month + "' est invalide");}
                if(year<-10000 || year>maxYear){errors.push("L'année '" + year + "' est invalide : les années autorisées vont de -10000 à " + maxYear);}
                if(errors.length===0){ date = new Date(year,month-1,day).correctYear(year);}
                return date;
            },
            /**
             * @doc returns the name of the module
             * @return {string}
             */
            getModuleName()
            {
                return _moduleName;
            },
            /**
             * @doc returns list of required modules and libraries for this module
             * @return {array}
             */
            getRequiredModules: function () {
                return _requiredModules;
            },
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
