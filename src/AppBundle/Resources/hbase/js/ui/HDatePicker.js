/**
 * @package hbase.js
 * @doc HDatePicker.js : HDatePicker modal definition
 * @requires jQuery,jQueryUI
 */
var hb = (function (hb,$) {
    "use strict";
    var _moduleName = "ui:HDatePicker/HDatePicker.js";
    if(((typeof hb.getLoadedModules==="function"?hb.getLoadedModules():[])).includes(_moduleName)) {
        console.log(_moduleName + " already loaded, skipping");
        return hb;
    }
    hb.ui = (function (hb,$) {
        var _requiredModules = ["util:cmn/cmn.js","util:date/date.js","util:trans/translation.js","util:HDate/HDate.js"];

        /**
         * @doc setDefaultOption for HDatePicker
         * @param option
         * @returns {object}
         * @private
         */
        let _setDefaultOption = function(option) {
            option.z = option.z || 7;
            option.fadeTime = option.fadeTime || 250;
            option.title = option.title || hb.util.trans.HDATEPICKER_DEFAULT_TITLE;
            return option;
        };

        /**
         * @doc modal builder for HDatePicker
         * @param {hb.ui.HDatePicker} picker
         * @private
         */
        let _build = function(picker) {
            let $modal = picker.$modal;
            $modal.find(".ui-dialog-titlebar-close").hide();
            $modal.append("<label class='mx-2'><DATE_TYPE></label>&nbsp;");
            $modal.typeSelector = $("<select class='ui-corner-all'>").appendTo($modal);
            $(Object.keys(hb.util.trans.PARSING_TYPE_LABELS)).each(function(key){
                $modal.typeSelector.append($("<option>", {value: key,text: hb.util.trans.PARSING_TYPE_LABELS[key]}));
            });
            $modal.append("<br>");

            let $labelContainer = $("<div class='text-muted m-r visible-md-inline-block visible-lg-inline-block'>").appendTo($modal);
            $modal.inputLabel = $("<p/>").appendTo($labelContainer);
            $modal.inputContainer = $("<div>").appendTo($modal);
            $modal.dateInput = $("<input type='text' class='ui-corner-all' style='min-height:23px' required='required' maxlength='30' size='20'>").
            appendTo($modal.inputContainer);
            $modal.validateButton = $("<button class='btn btn-primary'></button>").button({icon: "ui-icon-circle-close"}).appendTo($modal.inputContainer);

            $modal.errorSpan = $("<div disabled='disabled' class='ui-state-error alert alert-danger'></div>").appendTo($modal);
            $modal.append("<label><DATE_RENDERING></label> : ");
            $modal.dateLabel = $("<label>").appendTo($modal);
            $modal.append("<br>").append("<label>[min;max]</label> : ");
            $modal.dateInterval = $("<label>").appendTo($modal);
            $modal.append("<br>");

            $modal.html(hb.util.trans.HDATEPICKER_TRANSLATOR($modal.html()));
        };

        /**
         * @doc apply options to HDatePicker
         * @param {hb.ui.HDatePicker} picker
         * @private
         */
        let _applyOption = function(picker){
            let $modal = picker.$modal;
            $modal.dialog( "option", "title", picker.option.title );
        };

        /**
         * @doc HDatePicker modal constructor
         * @class hb.ui.HDatePicker
         * @param {object} option
         */
        hb.ui.HDatePicker = function(option = {}) {
            this.option = _setDefaultOption(option);
            var hbthis = this;

            this.$modal =  $("<div>").dialog({
                autoOpen: false,
                dialogClass: "hb-modal-z" + option.z,
                show: {
                    effect: "fade",
                    duration: option.fadeTime
                }
            });
            _build(this);
            _applyOption(this);
            this.errors=[];
            this.element=null;
            this.hDate=null;
            this.mouseOn = false;
            this.$modal.mouseenter(function(){hbthis.mouseOn = true;});
            this.$modal.mouseleave(function(){hbthis.mouseOn = false;});
            return this;
        };






        let _prototype = {
            buildComponent

        }




        factories.hdatepicker = function()
        {
            var $modal = new newModal();
            $modal.dialog( "option", "title", this.option.title );
            $modal.append("<label class='mx-2'>Type de date :</label>&nbsp;");
            $modal.typeSelector = $("<select class='ui-corner-all'>").appendTo($modal)
                .append($("<option>", {value: HDate.prototype.PRECISE,text: "Précise"}))
                .append($("<option>", {value: HDate.prototype.BOUNDED,text: "Imprecise (bornée)"}))
                .append($("<option>", {value: HDate.prototype.MONTH,text: "Mois"}))
                .append($("<option>", {value: HDate.prototype.SEASON,text: "Saison"}))
                .append($("<option>", {value: HDate.prototype.YEAR,text: "Année"}))
                .append($("<option>", {value: HDate.prototype.DECADE,text: "Decennie"}))
                .append($("<option>", {value: HDate.prototype.CENTURY,text: "Siècle"}))
                .append($("<option>", {value: HDate.prototype.MILLENIA,text: "Millénaire"}));

            $modal.append("<br>");
            var labelContainer = $("<div class='text-muted m-r visible-md-inline-block visible-lg-inline-block'>").appendTo($modal);
            $modal.inputLabel = $("<p/>").appendTo(labelContainer);
            $modal.inputContainer = $("<div>").appendTo($modal);
            $modal.dateInput = $("<input type='text' class='ui-corner-all' style='min-height:23px' required='required' placeholder='JJ/MM/AAAA' maxlength='30' size='20'>").appendTo($modal.inputContainer);
            $modal.validateButton = $("<button class='btn btn-primary'></button>").button({icon: "ui-icon-circle-close"}).appendTo($modal.inputContainer);
            //$modal.append("<br>");
            $modal.errorSpan = $("<div disabled='disabled' class='ui-state-error alert alert-danger'></div>").appendTo($modal);
            $modal.append("<label>Rendu de la date</label> : ");
            $modal.dateLabel = $("<label>").appendTo($modal);
            $modal.append("<br>").append("<label>[min;max]</label> : ");
            $modal.dateInterval = $("<label>").appendTo($modal);
            $modal.append("<br>");

            $modal.bind = function(element)
            {
                if ($modal.element !== null){$modal.unbind();}
                $modal.element=element;
                element.addClass( "hdatepicker-enabled" );
                this.attr("title","Entrez une date");
                if(typeof (this.element.first().attr("hdatepicker-label")) !== "undefined"){this.dialog("option","title",this.element.first().attr("hdatepicker-label"));}
                if(element !== null && typeof (element.first().attr("hdate")) !== "undefined"){
                    $modal.hDate = $.hbase.HDate.parse(element.first().attr("hdate"));
                }
                else if ($modal.hDate !== null){
                    $modal.hDate = $modal.hDate.clone();
                }
                this.refresh(true);
                this.dialog({
                    position: { my: "left top", at: "left bottom", of: element }
                });
                this.dialog("open");
            };

            $modal.unbind = function()
            {
                if($modal.element === null){return;}
                //$modal.errors=[];
                var element = $modal.element;
                this.dialog("close");
                $modal.element=null;
                setTimeout(function(){$(element).removeClass( "hdatepicker-enabled" );}, 40);
            };

            $modal.refresh = function(total = false)
            {
                var type = $(this).find(":selected").val();
                $modal.inputLabel.text($modal.regional.inputLabel[type]);
                $modal.dateLabel.empty();
                $modal.dateInterval.empty();
                if(total){$modal.dateInput.empty();}
                if($modal.hDate !== null){
                    if(total){
                        $modal.dateInput.val($modal.hDate.getCanonicalInput());
                        $modal.typeSelector.val($modal.hDate.type);
                    }
                    $modal.dateLabel.text($modal.hDate.getLabel());
                    $modal.dateInterval.text($modal.hDate.getIntervalLabel());
                }
                $modal.validateButton.button("enable").removeClass("ui-state-error");
                $modal.validateButton.children().first().removeClass("ui-icon-circle-close").addClass("ui-icon-check");
                $modal.errorSpan.hide();
                $modal.validateButton.show();

                // if date value is empty validation icon isn"t displayed
                if($modal.dateInput.val() === "" ){
                    $modal.validateButton.hide();
                }
                else if($modal.errors.length > 0 ){
                    $modal.validateButton.button("disable").addClass("ui-state-error");
                    $modal.validateButton.children().first().removeClass("ui-icon-check").addClass("ui-icon-circle-close");
                    $modal.errorSpan.show();
                    $modal.errorSpan.text($modal.errors[0]);
                }
            };

            // method called when date type is changed
            $modal.selectorChanged =  function()
            {
                var type = $(this).find(":selected").val();
                $modal.dateInput.attr("placeholder",$modal.regional.placeHolders[type]);

                if ($modal.hDate !== null && $modal.errors.length < 1){
                    $modal.hDate.setType(type);
                    $modal.dateInput.val($modal.hDate.getCanonicalInput());
                    $modal.refresh();
                }
                else{
                    $modal.inputChanged();
                }
            };

            $modal.inputChanged = function()
            {
                var type = $modal.typeSelector.find(":selected").val();
                var sDate = $modal.dateInput.val();
                $modal.errors=[];

                $modal.hDate = null;
                var date = null;
                if(type == HDate.prototype.BOUNDED){
                    var regex = new RegExp("^([^;]+);([^;]+)$");
                    var regexArray = regex.exec(sDate);
                    if(regexArray === null) {
                        $modal.errors.push("La valeur entrée n'est pas convertible en date (imprecise). " +
                            "Exemples de valeurs autorisées : 2/5/1985;9/6/1985,3/04/-8;2/04/-7");
                        $modal.refresh();
                        return;
                    }

                    date = myParseDate(regexArray[1],HDate.prototype.PRECISE,$modal.errors);
                    var endDate = myParseDate(regexArray[2],HDate.prototype.PRECISE,$modal.errors);
                    console.log(date);
                    console.log(endDate);

                    if(date !== null && endDate !== null){
                        if(endDate.dayDiff(date) < 1){
                            $modal.errors.push("La date de fin doit être strictement posterieure à la date de début");
                            $modal.refresh();
                            return;
                        }
                        $modal.hDate = new HDate(HDate.prototype.BOUNDED,date,endDate);
                    }
                    else{
                        if (date === null){$modal.errors[0]=$modal.errors[0].replace("La valeur entrée ", "La valeur de début ");}
                        else{ $modal.errors[0]=$modal.errors[0].replace("La valeur entrée ", "La valeur de fin ");}
                    }
                }
                else{
                    date = myParseDate(sDate,type,$modal.errors);
                    if(date !== null) {$modal.hDate = new HDate(type,date);}
                }
                $modal.refresh();
                return;
            };

            $modal.updateElement = function()
            {
                if($modal.errors.length > 0 || $modal.hDate === null ) {return;}
                $modal.element.first().val($modal.hDate.getLabel());
                $modal.element.first().attr("hdate",JSON.stringify($modal.hDate));
                $modal.element.first().change();
            };
            $modal.validate = function()
            {
                $modal.updateElement();
                $modal.mouseOn = false;
                $modal.focusout();
            };

            $modal.typeSelector.on("change",function(){$modal.selectorChanged();});
            $modal.dateInput.on("change",function(){$modal.inputChanged();});
            $modal.dateInput.on("keyup", function(event) {
                if(event.keyCode === 13){$modal.validate();}
                else{$modal.inputChanged();}
            });
            $modal.validateButton.on("click", function() {$modal.validate();});
            $modal.on("focusout", function(event)
            {
                if($modal.mouseOn){
                    event.stopPropagation();
                    event.preventDefault();
                    return;
                }
                $modal.mouseOn = false;
                if($modal.element === null) {return;}
                var element = $modal.element;
                element.attr("disabled","disabled");
                $modal.unbind();
                setTimeout(function() {element.removeAttr("disabled");element.blur();}, 30);
                element.prev().click();
                element.blur();
            });
            $modal.dialog("close");
            return $modal;
        };







        /**
         * @module hb/ui/HDatePicker
         * @class hb.ui.HDatePicker
         */
        util.cmn = {
            /**
             * @doc capitalizes a string
             * @param {string} str
             * @return {string}
             */
            capitalize: function (str) {
                return str.charAt(0).toUpperCase() + this.slice(1);
            },
            /**
             * @doc converts an integer (arabic 10 base) to the corresponding roman number
             * @param number
             * @returns {string}
             */
            convertArabicToRoman: function (number) {
                number = Number(number);
                let remainder = number;
                let characters = ["M","D","C","L","X","V","I"];
                let values = [1000,500,100,50,10,5,1];
                let nos = [0,0,0,0,0,0,0];
                let romanNo ="";

                for (let index = 0; index < 7; index++) {
                    remainder -= (nos[index] = Math.floor(remainder / values[index])) * values[index];

                    if(index=== 6 && nos[index]=== 4){
                        if(nos[index-1]>0){romanNo = romanNo.substr(0,romanNo.length-1) + "IX";}
                        else{romanNo +="IV";}
                    }
                    else if(index=== 4 && nos[index]=== 4){
                        if(nos[index-1]>0){romanNo = romanNo.substr(0,romanNo.length-1) + "XC";}
                        else{romanNo +="XL";}
                    }
                    else if(index=== 2 && nos[index]=== 4){
                        if(nos[index-1]>0){romanNo = romanNo.substr(0,romanNo.length-1) + "CM";}
                        else{romanNo +="CD";}
                    }
                    else{
                        for(let index2=0;index2<nos[index];index2++){
                            romanNo += characters[index];
                        }
                    }
                }
                return romanNo;
            },
            /**
             * @doc returns and idGenerator function which returns at each call an id increased of 1 from 0
             * @returns {Function}
             */
            getIdGenerator : function () {
                let id = 0;
                return function () {
                    return ++id;
                };
            },
            /**
             * @doc replace a set of different old text in a String with replacement values and return its
             * @param {string} oldText
             * @param {*} replacements : an object with pairs "<VALUE TO REPLACE>" => REPLACEMENT
             * @returns {String}
             */
            multiReplace : function (oldText,replacements) {
                Object.keys(replacements).forEach(function(key,index) {
                    oldText = oldText.replace(key,replacements[key]);
                });
                return oldText;
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
        console.log(_moduleName + " loaded");
        return util;
    }(hb || {},$));

    let _loadedModules = ((typeof hb.getLoadedModules==="function")?hb.getLoadedModules():[]);
    _loadedModules.push(_moduleName);
    hb.getLoadedModules = function() {
        return _loadedModules;
    }
    return hb;
}(hb || {},$));
