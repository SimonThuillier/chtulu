/**
 * @package HArticle.js
 * @doc common.js : HDate class definition
 * @requires hb.util.cmn,hb.util.date,hb.util.trans
 */
var hb = (function (hb) {
    "use strict";
    var _moduleName = "util:HArticle/HArticle.js";
    if(((typeof hb.getLoadedModules==="function"?hb.getLoadedModules():[])).includes(_moduleName)) {
        console.log(_moduleName + " already loaded, skipping");
        return hb;
    }
    hb.util = (function (util) {
        var _requiredModules = ["util:cmn/cmn.js","util:trans/translation.js,util:HDate/HDate.js"];
        let hd = hb.util.HDate;
        let trans = hb.util.trans;

        let _idGenerator = new hb.util.cmn.getIdGenerator();



        /**
         * @doc HArticle object constructor
         * @class hb.util.HArticle
         * @return {hb.util.HArticle}
         */
        util.HArticle = function()
        {
            this.id = "t" + _idGenerator(); // at creation articles receive a temporary id
            this.title = null;
            this.type = null;
            this.abstract = null;
            this.beginHDate = null;
            this.hasEndDate = null;
            this.endHDate = null;
            this.groups = [];
        };

        let _prototype = {
            /**
             * @doc HDate prototype clone function
             * @returns {HDate}
             */
            clone : function() {
                //return new util.HDate(this.type,hd.clone(this.beginDate),hd.clone(this.endDate));
            },
            /**
             * @doc : determines if two HArticle are equals (same id)
             * @param {HArticle} hArticle
             * @returns {boolean}
             */
            equals : function(hArticle) {
                return this.id === hArticle.id;
            },
            /**
             * @doc HArticle json parser/creator function : returns the HArticle generated from its JSON representation
             * @param {string} jsonStr
             * @returns {HArticle}
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
                    jsonObj.beginDate = new Date(Date.parse(jsonObj.beginDate));
                    jsonObj.beginDate.setFullYear(-jsonObj.beginDate.getFullYear());
                }
                else{
                    jsonObj.beginDate = new Date(Date.parse(jsonObj.beginDate));
                }
                if(jsonObj.endDate !== null && jsonObj.endDate.substring(0,1) === "-"){
                    jsonObj.endDate = jsonObj.endDate.substring(1);
                    jsonObj.endDate = new Date(Date.parse(jsonObj.endDate));
                    jsonObj.endDate.setFullYear(-jsonObj.endDate.getFullYear());
                }
                else{
                    jsonObj.endDate = new Date(Date.parse(jsonObj.endDate));
                }

                //console.log("date parsée : " + jsonObj.beginDate);
                return new util.HDate(jsonObj.type,jsonObj.beginDate,jsonObj.endDate);
            }
        };
        Object.assign(util.HArticle.prototype,_prototype);

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
