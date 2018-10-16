/**
 * @package dto.js
 * @doc dto.js :
 */
let _idGenerator = new hb.util.cmn.getIdGenerator();
let mod = {};

/**
 * @doc ResourceGeometry object constructor
 * @class hb.util.dto.ResourceGeometry
 * @return {hb.util.dto.ResourceGeometry}
 */
mod.ResourceGeometry = function()
{
    this.id = "t" + (new hb.util.cmn.getIdGenerator());
};


Object.assign(mod.ResourceGeometry,
    {
        objectType : "resourceGeometry",
        targetGeometry : null,
        zoomGeometry : null,
        comment:"commentaire par défaut",
        urlBag : null,
        /**
         * @doc : determines if two ResourceGeometry are equals (same id)
         * @param {hb.util.dto.ResourceGeometry} resource
         * @returns {boolean}
         */
        equals : function(resource) {
            return this.id === resource.id;
        },
        /**
         * @doc : function aimed to finalize constitution of new object created by parsing JSon
         * @return {hb.util.dto.Article}
         */
        finalize : function(){
        },
    });





/**
 * @doc Article object constructor
 * @class hb.util.dto.Article
 * @return {hb.util.dto.Article}
 */
mod.Article = function()
{
    this.id = "t" + _idGenerator(); // at creation articles receive a temporary id

};

Object.assign(mod.Article,
    {
        objectType : "article",
        title : null,
        type : null,
        abstract : null,
        beginHDate : null,
        hasEndDate : null,
        endHDate : null,
        hteRange : null,
        groups : [],
        urlBag : null,
        detailImageResource : null,
        detailImageUrl : null,
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
            //console.log(this);
            let jsonStr = null;
            if(this.beginHDate !== null){
                if(typeof this.beginHDate === "object"){jsonStr = JSON.stringify(this.beginHDate);}
                else{jsonStr = this.beginHDate;}
                this.beginHDate = hb.util.HDate.prototype.parseFromJson(jsonStr);
            }
            if(this.hasEndDate && this.endHDate !== null && this.endHDate !== ''){
                if(typeof this.endHDate === "object"){jsonStr = JSON.stringify(this.endHDate);}
                else{jsonStr = this.endHDate;}
                this.endHDate = hb.util.HDate.prototype.parseFromJson(jsonStr);
            }
            else{this.endHDate = null;}
            if(this.hteRange !== null){
                if(typeof this.hteRange === "object"){jsonStr = JSON.stringify(this.hteRange);}
                else{jsonStr = this.hteRange;}
                this.hteRange = hb.util.HDate.prototype.parseFromJson(jsonStr);
            }
            if(this.detailImageResource === "") this.detailImageResource = null;
            if(this.detailImageResource !== null){
                if(typeof this.detailImageResource === "string"){
                    this.detailImageResource = JSON.parse(this.detailImageResource);
                }
            }
        },
        /**
         * @deprecated
         */
        parseFromJson : function(jsonStr)
        {
            let jsonObj = JSON.parse(jsonStr);
            let hArticle = new mod.Article();
            for(var key in hArticle) {
                if(jsonObj.hasOwnProperty(key)){
                    hArticle[key] = jsonObj[key];
                }
            }
            return hArticle;
        }
    });

module.exports = mod;