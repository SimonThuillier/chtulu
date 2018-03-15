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
            submitArticleSearch : function(event,element)
        {
            event.preventDefault();
            event.stopPropagation();
            let $this = $(element);
            let $formData = $this.serializeArray().slice();
            let formMap = hb.util.sf.getFormMap($formData);
            let $data;
            let tempValue;
            $this.find(".hb-hdatepicker").each(function(index){
                if(typeof formMap[this.name] !== "undefined"){
                    //$formData[formMap[this.name]].value = null;
                    $formData[formMap[this.name]].value = $(this).attr("data-hdate");
                    // $this = $(this);
                    //$data.value = $(this).attr("data-hdate");
                    //$data.attr("data-hdate",$data.value);
                    //$data.val(tempValue);
                }
            });
            console.log($formData);
            let action = $this.attr("action");
            if (typeof action === "undefined" || action === null || action ==="") return;
            $.ajax({
                url : $this.attr("action"),
                type : "POST",
                dataType : "html",
                data : $formData,
                success:function(data) {
                    console.log("success ! " + data);
                    location.reload();
                }
            });

            /*$this.find(".hb-hdatepicker").each(function(index){
                if(typeof formMap[this.name] !== "undefined"){
                    $data = $formData[formMap[this.name]];
                    tempValue = $data.value;
                    console.log(tempValue);
                    $(this).val($(this).attr("data-hdate"));
                    console.log($data.value);
                    $(this).attr("data-hdate",tempValue);
                }
            });*/

            return true;
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

        $(function() {
            console.log("apply classes");
            ui.manager.applyClasses();
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
