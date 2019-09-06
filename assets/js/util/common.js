/**
 * @package hbase.js
 * @doc common.js : Contains various common utilitary function for hbase
 */
const mod =
    {
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
            if (str === null) return null;
            let splitText = str.split("\r\n");

            $.each(splitText, function (key, value) {
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
            let characters = ["M", "D", "C", "L", "X", "V", "I"];
            let values = [1000, 500, 100, 50, 10, 5, 1];
            let nos = [0, 0, 0, 0, 0, 0, 0];
            let romanNo = "";

            for (let index = 0; index < 7; index++) {
                remainder -= (nos[index] = Math.floor(remainder / values[index])) * values[index];

                if (index === 6 && nos[index] === 4) {
                    if (nos[index - 1] > 0) {
                        romanNo = romanNo.substr(0, romanNo.length - 1) + "IX";
                    }
                    else {
                        romanNo += "IV";
                    }
                }
                else if (index === 4 && nos[index] === 4) {
                    if (nos[index - 1] > 0) {
                        romanNo = romanNo.substr(0, romanNo.length - 1) + "XC";
                    }
                    else {
                        romanNo += "XL";
                    }
                }
                else if (index === 2 && nos[index] === 4) {
                    if (nos[index - 1] > 0) {
                        romanNo = romanNo.substr(0, romanNo.length - 1) + "CM";
                    }
                    else {
                        romanNo += "CD";
                    }
                }
                else {
                    for (let index2 = 0; index2 < nos[index]; index2++) {
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
        getIdGenerator: function (begin=0,step=1) {
            let id = begin;
            return function () {
                let toReturn = id;
                id = id + step;
                return toReturn;
            };
        },
        /**
         * @doc replace a set of different old text in a String with replacement values and return its
         * @param {string} oldText
         * @param {*} replacements : an object with pairs "<VALUE TO REPLACE>" => REPLACEMENT
         * @returns {String}
         */
        multiReplace: function (oldText, replacements) {
            Object.keys(replacements).forEach(function (key, index) {
                oldText = oldText.replace(key, replacements[key]);
            });
            return oldText;
        },
        /**
         * @doc cancel all selection on page to prevent undisered selection (while resizing for example)
         * @return void
         */
        cancelSelection : function(){
            if (window.getSelection) {window.getSelection().removeAllRanges();}
            else if (document.selection) {document.selection.empty();}
        },
        /**
         * @doc given a simple object key=>value returns the object value=>key
         * values must be unique in the original object
         * @return Object
         */
        reverseMapping : function(o){
            return Object.keys(o).reduce((r, k) => {
                const item = {};
                item[o[k]] = k;
                return  Object.assign(r, item);
            }, {});
        }
    };

export default mod;