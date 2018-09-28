/**
 * @package detailBuilder.js
 * @doc detailBuilder.js :
 */


/**
 * @module hb/ui/detailBuilder
 * @class hb.ui.detailBuilder
 */
let detailBuilder = {};

let _detailGroupBuilder = {
    /**
     * @doc builds minimal part of article for HArticleModal
     * @param {jQuery} $target
     * @private
     */
    buildMinimal : function($target) {
        let groupLabel = 'minimal';
        let attrs = $target.hAttributes;
        let parentGroup = null;
        let $group = $("<div class=\"row\">").appendTo($target);
        $target.hGroups[groupLabel] = $group;
        $group.childrenContainers = [];

        let $col = $("<div class=\"col-md-6\">").appendTo($group);
        let $area = $("<div class=\"container-fluid\">").appendTo($col);
        let $sRow = $("<div class=\"row\">").appendTo($area);
        attrs["type"] = $("<h5 data-label='Type : '>").appendTo($sRow);
        $group.childrenContainers["date"] = $sRow;
        $group.childrenContainers["detailImage"] = $("<div class=\"col-md-5 ml-auto\">").appendTo($group);
        return $group;
    },
    buildDate : function($target) {
        let groupLabel = 'date';
        let attrs = $target.hAttributes;
        let parentGroup = 'minimal';
        let $group = $target.hGroups[parentGroup].childrenContainers[groupLabel];
        $target.hGroups[groupLabel] = $group;
        $group.childrenContainers = [];

        attrs["beginHDate"] = $("<h5 data-label='Date de début : '>").appendTo($group);
        attrs["endHDate"] = $("<h5 data-label='Date de fin : '>").appendTo($group);

        return $group;
    },
    buildDetailImageUrl : function($target) {return null;},
    buildDetailImage : function($target) {
        let groupLabel = 'detailImage';
        let attrs = $target.hAttributes;
        let parentGroup = 'minimal';
        let $group = $target.hGroups[parentGroup].childrenContainers[groupLabel];
        $target.hGroups[groupLabel] = $group;
        $group.childrenContainers = [];

        attrs.detailImage = $("<a href=\"#\" class=\"thumbnail\">").appendTo($group);

        return $group;
    },
    buildAbstract : function($target) {
        let groupLabel = 'abstract';
        let attrs = $target.hAttributes;
        let parentGroup = null;
        let $group = $("<div class=\"row\">").appendTo($target);
        $target.hGroups[groupLabel] = $group;
        $group.childrenContainers = [];

        let $row = $("<div class=\"row\">").insertAfter($group);
        let $col = $("<div class=\"col-md-12\">").appendTo($row);
        attrs["abstract"] = $("<div class=\"well well-lg\">").appendTo($col);
        return $group;
    },
    buildHteRange : function($target) {
        let groupLabel = 'hteRange';
        let attrs = $target.hAttributes;
        let parentGroup = null;
        let $group = $("<div class=\"row\">").appendTo($target);
        $target.hGroups[groupLabel] = $group;
        $group.childrenContainers = [];

        let $row = $("<div class=\"row\">").insertAfter($group);
        let $col = $("<div class=\"col-md-12\">").appendTo($row);
        attrs["hteRange"] = $("<input class=\"hb-hts\">").appendTo($col);
        return $group;
    }

};

/**
 * @doc HArticleDetailBuilder constructor
 * @class hb.ui.detailBuilder.ArticleBuilder
 */
detailBuilder.ArticleBuilder = function() {return this;};
Object.assign(detailBuilder.ArticleBuilder.prototype,{
    /**
     * @param {jQuery} $target
     * @param groups
     * @return array
     */
    build:function($target,groups=['minimal']){
        if(typeof $target.hAttributes === 'undefined'){$target.hAttributes=[];}
        if(typeof $target.hGroups === 'undefined'){$target.hGroups=[];}
        console.log(groups);
        $.each(groups,function(key,value){
            console.log(value);
            if(typeof (_detailGroupBuilder["build" + hb.util.cmn.capitalize(value)]) !== 'function'){
                throw "Group " + value + " doesn't exist for HArticleDetail";
            }
            _detailGroupBuilder["build" + hb.util.cmn.capitalize(value)]($target);
        });
        return groups;
    }
});

module.exports = detailBuilder;

