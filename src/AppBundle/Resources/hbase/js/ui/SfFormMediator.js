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
        var _requiredModules = ["util:cmn/common.js","util:form/form.js"];

        let _inputMapper = {
            getStrValue:function(value){
                if(value === null || value === "null"){return null;}
                if(typeof value !== 'object'){return value;}
                return JSON.stringify(value);
            },
            mapInput:function(value,$element){
                if($element.attr('type') === "checkbox"){return this.mapInputCheckbox(value,$element);}
                $element.val(this.getStrValue(value)).trigger("hb.load");
            },
            mapInputCheckbox:function(value,$element){
                if(value !== false){$element.prop( "checked", true).trigger("hb.load");}
                else{$element.prop( "checked", false ).trigger("hb.load");}
            },
            mapSelect:function(value,$element){
                let selectValue = $element.find("option:first").val();
                if(typeof value === 'object' &&
                    typeof value.id !== 'undefined' &&
                    $element.find("option[value='"+ value.id +"']").length > 0
                ){
                    selectValue = value.id;
                }
                $element.val(selectValue).prop('selected', true).trigger("hb.load");
            },
            mapTextarea:function(value,$element){
                $element.val(this.getStrValue(value)).trigger("hb.load");
            },
            unMapInput:function($element){
                if($element.attr('type') === "checkbox"){return this.unMapInputCheckbox($element);}
                $element.val("").trigger("hb.unload");
            },
            unMapInputCheckbox:function($element){
                $element.prop( "checked", false ).trigger("hb.unload");
            },
            unMapSelect:function($element){
                let selectValue = $element.find("option:first").val();
                $element.val(selectValue).prop('selected', true).trigger("hb.unload");
            },
            unMapTextarea:function($element){
                $element.text("").trigger("hb.unload");
            },
            returnInput:function($element,value){
                if($element.attr('type') === "checkbox"){return this.returnInputCheckbox($element,value);}
                if($element[0].hasAttribute('data-hb-value')){return $element[0].getAttribute('data-hb-value');}
                return value.value;
            },
            returnInputCheckbox:function($element,value){
                if($element[0].hasAttribute('data-hb-value')){return $element[0].getAttribute('data-hb-value');}
                return value.value;
            },
            returnSelect:function($element,value){
                if($element[0].hasAttribute('data-hb-value')){return $element[0].getAttribute('data-hb-value');}
                return {id:value.value,label:$element.find('option[value="'+ value.value +'"]').text()};
            },
            returnTextarea:function($element,value){
                if($element[0].hasAttribute('data-hb-value')){return $element[0].getAttribute('data-hb-value');}
                return value.value;
            }
        };

        /**
         * @doc SfFormMediator constructor
         * @class hb.ui.SfFormMediator
         */
        ui.SfFormMediator = function() {
            /** @type {jQuery} */
            this.$target=null;
            this.object=null;
            this.pendingAction = false;
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
                this.unMap($form);
                console.log(object);
                let $rows = $form.find("[data-hb-group*='hb-group-']");

                let objectGroupsIterator = function(key,value){
                    //console.log("[data-hb-group='hb-group-"+ value + "']");
                    let $rowGroup = $rows.filter("[data-hb-group='hb-group-"+ value + "']");
                    $.each($rowGroup,formGroupIterator);
                };

                let formGroupIterator = function(key,value){
                    let $controls = $(value).find(".form-control,.form-check-input");
                    $.each($controls,objectAttributeMediator);
                };

                let objectAttributeMediator = function(key,value){
                    let $control = $(value);
                    let attributeName = $control.attr('id').split('_');
                    attributeName = attributeName[attributeName.length-1];
                    if(typeof object[attributeName] !=='undefined'){
                        let attribute = object[attributeName];
                        let nodeType = hb.util.cmn.capitalize($control.get(0).nodeName.toLowerCase());
                        if(typeof _inputMapper["map"+nodeType] !== 'undefined'){
                            _inputMapper["map"+nodeType](attribute,$control);
                        }
                    }

                };
                $.each(groups,objectGroupsIterator);
                // button delete appears if deleteUrl is present
                let $deleteButton = $form.find("#delete");
                if(typeof object.urlBag.delete === 'undefined' || object.urlBag.delete === ""){
                    $deleteButton.hide();
                }
                return groups;
            },
            /**
             * @doc reinitialize fields of the forms in order to prevent weird meltings between objects
             * @return array
             */
            unMap:function(){
                let $form = this.$target.form;

                $form.find(".form-control,.form-check-input").each(function(key,value){
                    let $control = $(value);
                    let nodeType = hb.util.cmn.capitalize($control.get(0).nodeName.toLowerCase());
                    _inputMapper["unMap"+nodeType]($control);
                });
                $form.find("#delete").show();
                return true;
            },
            /**
             * @doc return data of form both to associated object and the server
             * @param data form data as an array
             * @return array
             */
            return:function(data){
                if(this.pendingAction){
                    console.log("pendingAction, abort");
                    return [];
                }
                this.pendingAction= true;
                console.log(data);
                let $form = this.$target.form;
                let object = this.object;
                let $controls = $form.find(".form-control,.form-check-input,.form-control-file");
                let formName = "";
                data.forEach(function(value){
                    if(value.name.indexOf(['[_token]']) !== -1) {formName = value.name.replace('[_token]','');}
                });
                let formObject = {};
                let localObject = {};
                let $control = {};
                let attributeName="";

                data.forEach(function(value){
                    if(value.name.indexOf(['[_token]']) !== -1) {
                        formObject._token = value.value;
                        //localObject['_token'] = value.value;
                        return;
                    }
                    attributeName = value.name.replace(formName + '[','').replace(']','');
                    $control = $controls.filter("#" + formName + "_" + attributeName);
                    let nodeType = hb.util.cmn.capitalize($control.get(0).nodeName.toLowerCase());
                    if(typeof _inputMapper["return"+nodeType] !== 'undefined'){
                        localObject[attributeName] = _inputMapper["return"+nodeType]($control,value);
                    }
                    else{localObject[attributeName] = value.value;}
                    formObject[attributeName]  = localObject[attributeName];
                    if(nodeType === 'Select'){formObject[attributeName] = formObject[attributeName].id;}
                });
                console.log(formObject);

                if(object === null){
                    this.object = formObject;
                    this.pendingAction= false;
                }
                else if(typeof object.urlBag !== 'undefined' && object.urlBag.post !== null){
                    this.submitToServer(object,formObject,localObject);
                }
                else{
                    this.submitToLocal(object,localObject);
                    this.pendingAction= false;
                }
                return [];
            },
            clearForm:function(){
                let $target = this.$target.parent();
                $target.find(".hb-form-error").remove();
                $target.find(".hb-alert").remove();
            },
            submitToServer:function(object,formObject,localObject){
                this.clearForm();
                let $target = this.$target;
                let $this = this;
                /*console.log(object);
                console.log(formObject);
                console.log(localObject);*/

                let isNew = (typeof object.id === 'undefined') ||
                    String(object.id)==='0' ||
                    (String(object.id).indexOf('t')) !== -1;

                $.ajax({
                    method:'POST',
                    url: object.urlBag.post,
                    data: {groups:object.groups,form:formObject},
                    dataType:'json',
                    error: function(jqXHR,textStatus,errorThrown){
                        $this.pendingAction= false;
                        let status = "error";
                        let msg = textStatus + " - " + errorThrown;
                        if(textStatus === "timeout"){
                            status = "warning";
                            msg = "Le serveur prend trop de temps à répondre. Reessayez dans quelques instants.";
                        }
                        hb.ui.misc.alert(status,msg,$target.body);
                    },
                    complete: function(){$this.pendingAction= false;},
                    timeout:10000,
                    success: function(response) {
                        $target.alerts.push(hb.ui.misc.alert(response.status,response.message,$target.body));
                        if(response.status === "error"){
                            if(response.errors !== null && typeof response.errors ==='object'){
                                Object.keys(response.errors).map(function(key, index) {
                                    let $errorTarget = $target.find("[name$='["+ key +"]']");
                                    let errorMsg = '';
                                    for (var i in response.errors[key]){
                                        errorMsg = response.errors[key][i];
                                        $("<li style='color:red' class='hb-form-error'>").html(errorMsg).
                                        insertAfter($errorTarget);
                                    }
                                });

                            }
                            return;
                        }
                        else if(typeof response.data === 'object' && response.data!==null){
                            Object.keys(response.data).map(function(key, index) {
                                object[key] = response.data[key];
                            });
                        }
                        $this.submitToLocal(object,localObject,isNew);
                    }
                });

            },
            submitToLocal:function(object,localObject,isNew=false){
                isNew = isNew ||
                    (typeof object.id === 'undefined') ||
                    String(object.id)==='0' ||
                    (String(object.id).indexOf('t')) !== -1;


                if($.isEmptyObject(object)){
                    Object.assign(object,localObject);
                    return;
                }

                Object.keys(localObject).map(function(key, index) {
                    if(typeof object[key] === 'undefined'){return;}
                    object[key] = localObject[key];
                });
                if(typeof object["finalize"] !== 'undefined'){
                    object.finalize();
                }

                if(isNew && typeof object.$bsTable !== 'undefined'){
                    //object.$bsTable.bootstrapTable('prepend', object);
                    object.$bsTable.bootstrapTable('insertRow', {index: 0, row: object});
                }
                else if(typeof object.$bsTable !== 'undefined'){
                    object.$bsTable.bootstrapTable('updateRow', {index: object.localIndex, row: object});
                }
            },
            delete:function($targetButton=null,onDelete=function(){},force=false){
                if(this.pendingAction && !force){
                    console.log("pendingAction, abort");
                    return [];
                }
                this.pendingAction= true;

                let object = this.object;
                let $target = this.$target;
                let $this = this;
                $.ajax({
                    method:'POST',
                    url: object.urlBag.delete,
                    error: function(jqXHR,textStatus,errorThrown){
                        let status = "error";
                        let msg = textStatus + " - " + errorThrown;
                        if(textStatus === "timeout"){
                            status = "warning";
                            msg = "Le serveur prend trop de temps à répondre. Reessayez dans quelques instants.";
                        }
                        $this.pendingAction= false;
                        hb.ui.misc.alert(status,msg,$target.body);
                    },
                    complete: function(){},
                    timeout:10000,
                    success: function(response) {
                        //$target.alerts.push(hb.ui.misc.alert(response.status,response.message,$target.body));
                        //console.log(response);
                        if(response.status === "confirm"){
                            hb.ui.misc.confirm(
                                "Confirmer suppression",
                                response.message,
                                function(){
                                    $this.delete($targetButton,onDelete,true);
                                    $this.pendingAction= false;
                                    $(this).dialog( "close" );
                                },
                                function(){
                                    $.ajax({method:"POST",url:object.urlBag.cancel});
                                    $this.pendingAction= false;
                                    $(this).dialog( "close" );
                                },
                                $targetButton
                            );
                        }
                        else if(response.status === "success"){
                            hb.ui.misc.alert("success",response.message);
                            $this.pendingAction= false;
                            onDelete();
                        }
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
