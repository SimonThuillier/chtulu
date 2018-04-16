/**
 * @package hbase.js
 * @doc common.js : Contains various common utilitary function for hbase
 */
var hb = (function (hb) {
    "use strict";
    var _moduleName = "util:cmn/common.js";
    if(((typeof hb.getLoadedModules==="function")?hb.getLoadedModules():[]).includes(_moduleName)) {
        console.log(_moduleName + " already loaded, skipping");
        return hb;
    }
    hb.util = (function (util) {
        var _requiredModules = [];
        /**
         * @module hb/util/cmn
         * @class hb.util.cmn
         */
        util.cmn = {
            /**
             * @doc capitalizes a string
             * @param {string} str
             * @return {string}
             */
            capitalize: function (str) {
                return str.charAt(0).toUpperCase() + str.slice(1);
            },
            /**
             * @doc convert plain text in html paragraphed text, with paragraph for each line breaks
             * @param {string} str
             * @return {string}
             */
            convertPlainTextToParagraphed: function (str) {
                if(str === null) return null;
                let splitText = str.split("\r\n");

                $.each(splitText,function(key,value){
                    splitText[key] = '<p>' + value + '</p>';
                });
                return splitText.join('');
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
