/**
 * @package detailBuilder.js
 * @doc detailBuilder.js :
 */
var hb = (function (hb) {
    "use strict";
    var _moduleName = "ui:detailBuilder/detailBuilder.js";
    if (((typeof hb.getLoadedModules === "function" ? hb.getLoadedModules() : [])).includes(_moduleName)) {
        console.log(_moduleName + " already loaded, skipping");
        return hb;
    }
    hb.ui = (function (ui, hb, $) {
        var _requiredModules = ["util:cmn/common.js"];

        /**
         * @module hb/ui/detailBuilder
         * @class hb.ui.detailBuilder
         */
        ui.detailBuilder = {};

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
            buildDetailImage : function($target) {
                let groupLabel = 'detailImage';
                let attrs = $target.hAttributes;
                let parentGroup = 'minimal';
                let $group = $target.hGroups[parentGroup].childrenContainers[groupLabel];
                $target.hGroups[groupLabel] = $group;
                $group.childrenContainers = [];

                let $thumbnail = $("<a href=\"#\" class=\"thumbnail\">").appendTo($group);
                let $img = $("<img src=\"/images/420a08a_user2-160x160_1.jpg\" alt=\"...\">").appendTo($thumbnail);

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
            }
        };

        /**
         * @doc HArticleDetailBuilder constructor
         * @class hb.ui.detailBuilder.ArticleBuilder
         */
        ui.detailBuilder.ArticleBuilder = function() {return this;};
        Object.assign(ui.detailBuilder.ArticleBuilder.prototype,{
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





        console.log(_moduleName + " loaded");
        return ui;
    }(hb.ui || {}, hb, $));

    let _loadedModules = ((typeof hb.getLoadedModules === "function") ? hb.getLoadedModules() : []);
    _loadedModules.push(_moduleName);
    hb.getLoadedModules = function () {
        return _loadedModules;
    };
    return hb;
}(hb || {}));
