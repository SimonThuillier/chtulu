/**
 * @package detailMediator.js
 * @doc detailMediator.js :
 */
var hb = (function (hb) {
    "use strict";
    var _moduleName = "ui:detailMediator/detailMediator.js";
    if (((typeof hb.getLoadedModules === "function" ? hb.getLoadedModules() : [])).includes(_moduleName)) {
        console.log(_moduleName + " already loaded, skipping");
        return hb;
    }
    hb.ui = (function (ui, hb, $) {
        var _requiredModules = ["util:cmn/common.js"];

        /**
         * @module hb/ui/detailMediator
         * @class hb.ui.detailMediator
         */
        ui.detailMediator = {};

        let _detailGroupMediator = {
            /** @type {jQuery} */
            $target:null,
            object:null,
            /**
             * @doc mediates minimal part of hArticle to HArticleDetail
             * @private
             */
            mapMinimal : function() {
                let groupLabel = 'minimal';
                let attrs = this.$target.detail.hAttributes;
                this.$target.title.text((this.object.title && this.object.title !=='')?this.object.title:'Nouvel article');
                attrs.type.text(attrs.type.data('label') + this.object.type.label);
            },
            mapDate : function() {
                let groupLabel = 'date';
                let attrs = this.$target.detail.hAttributes;
                attrs.beginHDate.text(attrs.beginHDate.data('label') +
                    ((this.object.beginHDate != null)?this.object.beginHDate.getLabel():"-"));
                attrs.endHDate.text(attrs.endHDate.data('label') +
                    ((this.object.endHDate != null)?this.object.endHDate.getLabel():"-"));
            },
            mapDetailImage : function() {
            },
            mapAbstract : function() {
                let groupLabel = 'abstract';
                let attrs = this.$target.detail.hAttributes;

                if(! $.inArray('abstract',this.object.groups)){
                    console.log(groupLabel + " ins't loaded");
                }
                attrs.abstract.html(hb.util.cmn.convertPlainTextToParagraphed(this.object.abstract));
            },
            mapHteRange : function() {
            },
        };

        /**
         * @doc hb.ui.detailMediator.ArticleMediator constructor
         * @class hb.ui.detailMediator.ArticleMediator
         */
        ui.detailMediator.ArticleMediator = function() {
            /** @type {jQuery} */
            this.$target=null;
            this.object=null;
            return this;
        };
        Object.assign(ui.detailMediator.ArticleMediator.prototype,{
            supportsGroup:function(group){
                if(typeof (_detailGroupMediator["map" + hb.util.cmn.capitalize(group)]) !== 'function') return false;
                return true;
            },
            /**
             * @param groups
             * @return array
             */
            map:function(groups=['minimal']){
                let mediator = this;
                _detailGroupMediator.$target = this.$target;
                _detailGroupMediator.object = this.object;
                let unloadedGroups = [];
                let object = this.object;
                console.log(object);

                $.each(groups,function(key,value){
                    if (!mediator.supportsGroup(value)) throw "Group " + value + " doesn't exist for ArticleMediator";
                    if($.inArray(value,object.groups)<0){unloadedGroups.push(value);}
                    else{_detailGroupMediator["map" + hb.util.cmn.capitalize(value)]();}
                });
                console.log("unloaded" + unloadedGroups);
                if(! $.isEmptyObject(unloadedGroups)){this.load(unloadedGroups);}
                return groups;
            },
            load:function(groups){
                let object = this.object;
                let $target = this.$target;
                if(object.urlBag === null || object.urlBag.info === null){return;}
                let $loadingSpinner = $("<div class=\"col-md-1\"><div class='hb-spinner fast' style='display:-moz-inline-box'></div>").
                prependTo($target.body);
                $.ajax({
                    url: object.urlBag.info,
                    data: {groups:groups},
                    dataType:'json',
                    error: function(jqXHR,textStatus,errorThrown){
                        let status = "error";
                        let msg = textStatus + " - " + errorThrown;
                        if(textStatus === "timeout"){
                            status = "warning";
                            msg = "Le serveur prend trop de temps à répondre. Reessayez dans quelques instants.";
                        }
                        hb.ui.misc.alert(status,msg,$target.body);
                    },
                    complete: function(){
                        $loadingSpinner.toggle(300,function() { $(this).remove(); });
                    },
                    timeout:1000,
                    success: function(response) {
                        if(response.status !== "success"){$target.alerts.push(hb.ui.misc.alert(response.status,response.message,$target.body));}
                        if(response.status === "error"){return;}
                        $.extend(object,response.data);
                        $.merge(object.groups,groups);
                        $.each(groups,function(key,value){
                            _detailGroupMediator["map" + hb.util.cmn.capitalize(value)]();
                        });
                    }
                });
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
