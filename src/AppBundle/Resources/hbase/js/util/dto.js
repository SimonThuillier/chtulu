/**
 * @package dto.js
 * @doc dto.js :
 */
var hb = (function (hb) {
    "use strict";
    var _moduleName = "util:dto/dto.js";
    if (((typeof hb.getLoadedModules === "function" ? hb.getLoadedModules() : [])).includes(_moduleName)) {
        console.log(_moduleName + " already loaded, skipping");
        return hb;
    }
    hb.util = (function (util, hb, $) {
        var _requiredModules = ["util:cmn/common.js","util:HDate/HDate.js"];
        util.dto = {};

        let _idGenerator = new hb.util.cmn.getIdGenerator();
        /**
         * @doc Article object constructor
         * @class hb.util.dto.Article
         * @return {hb.util.dto.Article}
         */
        util.dto.Article = function()
        {
            this.id = "t" + _idGenerator(); // at creation articles receive a temporary id
            this.objectType = "article";
            this.title = null;
            this.type = null;
            this.abstract = null;
            this.beginHDate = null;
            this.hasEndDate = null;
            this.endHDate = null;
            this.hteRange = null;
            this.groups = [];
            this.urlBag = null;
        };

        Object.assign(util.dto.Article,
            {
                /**
                 * @doc : determines if two HArticle are equals (same id)
                 * @param {hb.util.dto.Article} article
                 * @returns {boolean}
                 */
                equals : function(article) {
                    return this.id === article.id;
                },
                /**
                 * @doc : function aimed to finalize constitution of new HArticle created by parsing JSon
                 * @return {hb.util.dto.Article}
                 */
                finalize : function(){
                    let jsonStr = null;
                    if(this.beginHDate !== null){
                        if(typeof this.beginHDate === "object"){jsonStr = JSON.stringify(this.beginHDate);}
                        else{jsonStr = this.beginHDate;}
                        this.beginHDate = util.HDate.prototype.parseFromJson(jsonStr);
                    }
                    if(this.endHDate !== null){
                        if(typeof this.endHDate === "object"){jsonStr = JSON.stringify(this.endHDate);}
                        else{jsonStr = this.endHDate;}
                        this.endHDate = util.HDate.prototype.parseFromJson(jsonStr);
                    }
                    if(this.hteRange !== null){
                        if(typeof this.hteRange === "object"){jsonStr = JSON.stringify(this.hteRange);}
                        else{jsonStr = this.hteRange;}
                        this.hteRange = util.HDate.prototype.parseFromJson(jsonStr);
                    }
                },
                /**
                 * @deprecated
                 */
                parseFromJson : function(jsonStr)
                {
                    let jsonObj = JSON.parse(jsonStr);
                    let hArticle = new hb.util.HArticle();
                    for(var key in hArticle) {
                        if(jsonObj.hasOwnProperty(key)){
                            hArticle[key] = jsonObj[key];
                        }
                    }
                    return hArticle;
                }
            });



        console.log(_moduleName + " loaded");
        return util;
    }(hb.util || {}, hb, $));

    let _loadedModules = ((typeof hb.getLoadedModules === "function") ? hb.getLoadedModules() : []);
    _loadedModules.push(_moduleName);
    hb.getLoadedModules = function () {
        return _loadedModules;
    };
    return hb;
}(hb || {}));
