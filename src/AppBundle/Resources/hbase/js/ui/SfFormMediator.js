/**
 * @package SfFormMediator.js
 * @doc SfFormMediator.js :
 */
var hb = (function (hb) {
    "use strict";
    var _moduleName = "ui:SfFormMediator/SfFormMediator.js";
    if (((typeof hb.getLoadedModules === "function" ? hb.getLoadedModules() : [])).includes(_moduleName)) {
        console.log(_moduleName + " already loaded, skipping");
        return hb;
    }
    hb.ui = (function (ui, hb, $) {
        var _requiredModules = ["util:cmn/common.js"];

        $(".hb-form").each(function(){
            let $labels = $(this).find("[class*='hb-group-']");
            let regex = new RegExp("^.*(hb-group-\\S+).*");
            let groups = [];
            $labels.each(function(){
                let groupClass = regex.exec($(this).attr('class'));
                if(groupClass.length<2){return;}
                groupClass=groupClass[1];
                let $formGroup = $(this).closest(".form-group");
                $(this).removeClass(groupClass);
                $($formGroup).attr("data-hb-group",groupClass);
                groups.push(groupClass.replace('hb-group-',''));
            });
            groups = $.unique(groups);
            $(this).attr("data-hb-groups",JSON.stringify(groups));
        });

        let _inputMapper = {
            getStrValue:function(value){
                if(typeof value !== 'object'){return value;}
                return JSON.stringify(value);
            },
            mapInput:function(value,$element){
                if($element.attr('type') === "checkbox"){return this.mapInputCheckbox(value,$element);}
                $element.val(this.getStrValue(value)).trigger("hb.load");
            },
            mapInputCheckbox:function(value,$element){
                if(value !== false){$element.prop( "checked", true);}
                else{$element.prop( "checked", false );}
            },
            mapSelect:function(value,$element){
                let selectValue = $element.find("option:first").val();
                if(typeof value === 'object' &&
                    typeof value.id !== 'undefined' &&
                    $element.find("option[value='"+ value.id +"']").length > 0
                ){
                    selectValue = value.id;
                }
                $element.val(selectValue).prop('selected', true);
            },
            mapTextarea:function(value,$element){
                $element.text(this.getStrValue(value));
            }
        };

        /**
         * @doc SfFormMediator constructor
         * @class hb.ui.SfFormMediator
         */
        ui.SfFormMediator = function() {
            /** @type {jQuery} */
            this.$target=null;
            /** @type {hb.util.HArticle} */
            this.object=null;
            return this;
        };

        Object.assign(ui.SfFormMediator.prototype,{
            /**
             * @return array
             */
            map:function(){
                let unloadedGroups = [];
                let object = this.object;
                let groups = object.groups;
                let $form = this.$target.form;
                let $rows = $form.find("[data-hb-group*='hb-group-']");


                let objectGroupsIterator = function(key,value){
                    console.log("[data-hb-group='hb-group-"+ value + "']");
                    let $rowGroup = $rows.filter("[data-hb-group='hb-group-"+ value + "']");
                    //console.log(value);
                    console.log("$rowGroup");
                    console.log($rowGroup);
                    $.each($rowGroup,formGroupIterator);
                };

                let formGroupIterator = function(key,value){
                    //console.log(value);
                    let $controls = $(value).find(".form-control,.form-check-input");
                    $.each($controls,objectAttributeMediator);
                };

                let objectAttributeMediator = function(key,value){
                    let $control = $(value);
                    let attributeName = $control.attr('id').split('_');
                    attributeName = attributeName[attributeName.length-1];
                    console.log(attributeName);
                    if(typeof object[attributeName] !=='undefined'){
                        let attribute = object[attributeName];
                        let nodeType = hb.util.cmn.capitalize($control.get(0).nodeName.toLowerCase());

                        if(typeof _inputMapper["map"+nodeType] !== 'undefined'){
                            _inputMapper["map"+nodeType](attribute,$control);
                        }
                    }

                };

                $.each(groups,objectGroupsIterator);
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
