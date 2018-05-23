/**
 * @package form.js
 * @doc form.js : Handles special form actions
 */
var hb = (function (hb) {
    "use strict";
    var _moduleName = "ui:form/form.js";
    if(((typeof hb.getLoadedModules==="function"?hb.getLoadedModules():[])).includes(_moduleName)) {
        console.log(_moduleName + " already loaded, skipping");
        return hb;
    }
    hb.ui = (function (ui,hb,$) {
        var _requiredModules = ["util:cmn/common.js"];

        /**
         * @module hb/ui/form
         * @class hb.ui.form
         */
        ui.form = {
            /**
             * @doc hb.ui.form.FormBuilder constructor
             * @class hb.ui.form.FormBuilder
             * @param formName : name of the embedded form to be used by the builder
             */
            FormBuilder : function(formName) {
                this.formName = formName;
                return this;
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

        Object.assign(hb.ui.form.FormBuilder.prototype,{
            /**
             * @param {jQuery} $target
             * @param groups
             * @return array
             */
            build:function($target,groups=['minimal']){
                console.log("building form");

                let $form = $("div#hb-data form[name='" + this.formName + "']");
                console.log($form);
                console.log($form.length>0);
                if($form.length!==1){return [];}

                $form.detach().appendTo($target);

                console.log("groupes de formulaire : " + $form.data("groups"));

                return $form.data("groups");
            }
        });

        $(() => {
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

            $(".hb-form .hb-activer").on("change hb.load",function(event){
                let $element = $(this);
                let $form = $element.closest(".hb-form");
                if(! $element[0].hasAttribute("data-target") ){return;}

                let targets = $element[0].getAttribute("data-target");
                targets = targets.split(" ");
                let isActive = $element.prop( "checked");
                console.log(targets);
                let $target = $();
                let $controlTarget = $();
                let targetSelector = '';

                for (var i in targets) {
                    targetSelector = "[name$='[" + targets[i] + "]']";
                    $controlTarget = $.merge($controlTarget,$form.find(targetSelector));
                    $target = $.merge($target,$controlTarget.closest(".form-group"));
                }

                if(isActive){
                    $controlTarget.prop("disabled",false);
                    $target.show();
                }
                else{
                    $controlTarget.prop("disabled",true);
                    $target.hide()
                    if($controlTarget[0].hasAttribute("data-hb-value")){
                        $controlTarget[0].removeAttribute("data-hb-value") ;
                    }
                    $controlTarget.val(null);
                }
            });
        });

        console.log(_moduleName + " loaded");
        return ui;
    }(hb.ui || {},hb,$));

    let _loadedModules = ((typeof hb.getLoadedModules==="function")?hb.getLoadedModules():[]);
    _loadedModules.push(_moduleName);
    hb.getLoadedModules = function() {
        return _loadedModules;
    }
    return hb;
}(hb || {}));
