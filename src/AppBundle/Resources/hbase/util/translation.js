/**
 * @package hbase.js
 * @doc translation.js : Contains textual message and translations for hbase project
 * @param hb - hb module
 * @param currentLocale - {ENGLISH,FRENCH}
 */
var hb = (function (hb,currentLocale="FRENCH") {
    "use strict";
    var _moduleName = "util:trans/translation.js";
    if(((typeof hb.getLoadedModules==="function"?hb.getLoadedModules():[])).includes(_moduleName)) {
        console.log(_moduleName + " already loaded, skipping");
        return hb;
    }
    hb.util = (function (util) {
        var _requiredModules = [];

        const _LOCALES= {
            "ENGLISH": {
                DAY_NAMES : ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"],
                DAY_NAMES_SHORT : ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"],
                DAY_NAMES_MIN : ["Su", "Mo", "Tu", "We", "Th", "Fr", "Sa"], // Column headings for days starting at Sunday
                FIRST_DAY : 0, // The first day of the week, Sun = 0, Mon = 1, ...
                MONTH_NAMES : ["January", "February", "March", "April", "May", "June",
                    "July", "August", "September", "October", "November", "December"], // Names of months
                MONTH_NAMES_SHORT : ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"], // For formatting
                SEASON_NAMES : ['Winter','Spring','Summer','Fall'],
                CURRENT_TEXT : "Today",
                CLOSE_TEXT : "Done",
                PREV_TEXT : "Prev",
                NEXT_TEXT : "Next",
                WEEK_HEADER : "Wk",
                PARSING_TYPE_LABELS : {
                    "1":"Precise","3":"Month","4":"Season","5":"Year",
                    "6":"Decade","7":"Century","8":"Millennium"
                },
                PARSING_TYPE_EXAMPLES : {
                    "1":"8/1/1985, 09/25/573, 06/2/-582", "3":"8/1985,09/573,06/-582", "4":"1/1985 (<WINTER> 1985),4/-582 (<FALL> -582)",
                    "5":"1985,573,-582", "6":"1980,571,-580", "7":"1980,571,-580", "8":"1980,571,-580"
                },
                PARSING_PLACEHOLDERS : {
                    "1": "MM/DD/YYYY", "2": "MM/DD/YYYY;MM/DD/YYYY",
                    "3": "MM/YYYY", "4": "SS/YYYY", "5": "YYYY",
                    "6": "YYYY", "7": "YYYY", "8": "YYYY"
                },
                PARSING_PLACEMENT : {
                    "1": {"DAY":2,"MONTH":1,"YEAR":3}, "3": {"MONTH":1,"YEAR":2}, "4" : {"SEASON":1,"YEAR":2},
                    "5": {"YEAR":1},"6": {"YEAR":1},"7": {"YEAR":1},"8": {"YEAR":1}
                },
                PARSING_HELP : {
                    "1": "Enter complete date (Ex: 11/9/1989 or 3/15/-44)", "2": "Enter imprecise date (Ex: 10/11/732;10/13/733)",
                    "3": "Enter month (Ex: 7/622 or 10/-539)", "4": "Enter season (Ex: 1/208 ou 4/1917)",
                    "5": "Enter year (Ex: 1968 or -333)", "6": "Enter a year of the decade (Ex: 1242 or 1648)",
                    "7": "Enter a year of the century (Ex: -221 or 1789)", "8": "Enter a year of the millennium (Ex: -3140 or 1945)"
                },
                PARSING_ERRORS : [
                    "'<SDATE>' isn't parsable to <PARSING_TYPE> date. Authored values examples : <PARSING_EXAMPLE>",
                    "Day '<DAY>' isn't valid",
                    "Season '<SEASON>' isn't valid",
                    "Month '<MONTH>' isn't valid",
                    "Year '<YEAR>' isn't valid : Authored years go from -10000 to <MAX_YEAR>",
                ],

                dateFormat: "mm/dd/yy", // See format options on parseDate

            },
            "FRENCH": {
                DAY_NAMES : ['Dimanche','Lundi','Mardi','Mercredi','Jeudi','Vendredi','Samedi'],
                DAY_NAMES_SHORT : ['Dim','Lu','Mar','Mer','Je','Ven','Sa'],
                DAY_NAMES_MIN : ['D','L','M','M','J','V','S'],
                FIRST_DAY : 1, // The first day of the week, Sun = 0, Mon = 1, ...
                MONTH_NAMES : ['Janvier','Fevrier','Mars','Avril','Mai','Juin',
                    'Juillet','Aout','Septembre','Octobre','Novembre','Decembre'],
                MONTH_NAMES_SHORT : ['Janv','Fev','Mar','Avr','Mai','Juin','Juil.','Aout','Sept','Oct','Nov','Dec'],
                SEASON_NAMES : ['Hiver','Printemps','Eté','Automne'],
                CURRENT_TEXT : "Maintenand",
                CLOSE_TEXT : "Fait",
                PREV_TEXT : "Prec.",
                NEXT_TEXT : "Suiv.",
                WEEK_HEADER : "Sem.",
                PARSING_TYPE_LABELS : {
                    "1":"Précise","3":"Mois","4":"Saison","5":"Année",
                    "6":"Décennie","7":"Siècle","8":"Millénaire"
                },
                PARSING_TYPE_EXAMPLES : {
                    "1":"1/8/1985, 25/09/573, 2/06/-582", "3":"8/1985,09/573,06/-582", "4":"1/1985 (<WINTER> 1985),4/-582 (<FALL> -582)",
                    "5":"1985,573,-582", "6":"1980,571,-580", "7":"1980,571,-580", "8":"1980,571,-580"
                },
                PARSING_PLACEHOLDERS : {
                    "1": "JJ/MM/AAAA", "2": "JJ/MM/AAAA;JJ/MM/AAAA",
                    "3": "MM/AAAA", "4": "SS/AAAA", "5": "AAAA",
                    "6": "AAAA", "7": "AAAA", "8": "AAAA"
                },
                PARSING_PLACEMENT : {
                    "1": {"DAY":2,"MONTH":1,"YEAR":3}, "3": {"MONTH":1,"YEAR":2}, "4" : {"SEASON":1,"YEAR":2},
                    "5": {"YEAR":1},"6": {"YEAR":1},"7": {"YEAR":1},"8": {"YEAR":1}
                },
                PARSING_HELP : {
                    "1": "Entrez la date complete (Ex: 9/11/1989 ou 15/3/-44)", "2": "Entrez la date imprecise (Ex: 11/10/732;13/10/733)",
                    "3": "Entrez le mois (Ex: 7/622 ou 10/-539)", "4": "Entrez la saison (Ex: 1/208 ou 4/1917)",
                    "5": "Entrez l'année (Ex: 1968 ou -333)", "6": "Entrez une année de la decennie (Ex: 1242 ou 1648)",
                    "7": "Entrez une année du siècle (Ex: -221 ou 1789)", "8": "Entrez une année du millénaire (Ex: -3140 ou 1945)"
                },
                PARSING_ERRORS : [
                    "'<SDATE>' n'est pas convertible en date <PARSING_TYPE>. Exemples de valeurs autorisées : <PARSING_EXAMPLE>",
                    "Le jour '<DAY>' est invalide",
                    "La saison '<SEASON>' est invalide",
                    "Le mois '<MONTH>' est invalide",
                    "L'année '<YEAR>' est invalide : Les années autorisées vont de -10000 à <MAX_YEAR>",
                ],
                dateFormat: "mm/dd/yy", // See format options on parseDate
            }
        };








        /**
         * @module hb/util/trans
         * @class hb.util.trans
         */
        util.trans = {
            loc : _LOCALES[currentLocale],
            /**
             * @doc returns the name of the module
             * @return {string}
             */
            getModuleName : function(){
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
