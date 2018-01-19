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
        var _requiredModules = ["util:cmn/cmn.js","util:date/date.js",
            "util:trans/translation.js","util:HDate/HDate.js"];

        const _PARSERS = {
            "1":hb.util.date.getParserFromStyle(hb.util.trans.FORMAT_CANONICAL_STRS["1"]),
            "3":hb.util.date.getParserFromStyle(hb.util.trans.FORMAT_CANONICAL_STRS["3"]),
            "4":hb.util.date.getParserFromStyle(hb.util.trans.FORMAT_CANONICAL_STRS["4"]),
            "5":hb.util.date.getParserFromStyle(hb.util.trans.FORMAT_CANONICAL_STRS["5"]),
            "6":hb.util.date.getParserFromStyle(hb.util.trans.FORMAT_CANONICAL_STRS["6"]),
            "7":hb.util.date.getParserFromStyle(hb.util.trans.FORMAT_CANONICAL_STRS["7"]),
            "8":hb.util.date.getParserFromStyle(hb.util.trans.FORMAT_CANONICAL_STRS["8"]),
        };
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
            option.position = option.position|| { my: "left top", at: "left bottom", of: null };
            return option;
        };
        /**
         * @doc apply options to HDatePicker
         * @param {hb.ui.HDatePicker} picker
         * @private
         */
        let _applyOption = function(picker){
            let $modal = picker.$modal;
            $modal.dialog( "option", "title", picker.option.title );
            $modal.dialog( picker.option.position );
        };
        /**
         * @doc builds modal for HDatePicker
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
         * @doc refresh HDatePicker
         * @param {hb.ui.HDatePicker} picker
         * @param {boolean} total - if true type and input values are updated from the current hdate value
         * @private
         */
        let _refresh = function(picker,total = false)
        {
            let $modal = picker.$modal;
            let type = $modal.typeSelector.find(":selected").val();
            $modal.inputLabel.text(hb.util.trans.PARSING_HELP[type]);
            $modal.dateLabel.empty();
            $modal.dateInterval.empty();
            if(total){$modal.dateInput.empty();}
            if(picker.hDate !== null){
                if(total){
                    $modal.dateInput.val(picker.hDate.getCanonicalInput());
                    $modal.typeSelector.val(picker.hDate.type);
                }
                $modal.dateInput.attr("placeholder",hb.util.trans.PARSING_PLACEHOLDERS[type]);
                $modal.dateLabel.text($modal.hDate.getLabel());
                $modal.dateInterval.text($modal.hDate.getIntervalLabel());
            }
            $modal.validateButton.button("enable").removeClass("ui-state-error");
            $modal.validateButton.children().first().removeClass("ui-icon-circle-close").addClass("ui-icon-check");
            $modal.errorSpan.hide();
            $modal.validateButton.show();

            // if date value is empty validation icon isn"t displayed
            if($modal.dateInput.val() === "" ){$modal.validateButton.hide();}
            else if(picker.errors.length > 0 ){
                $modal.validateButton.button("disable").addClass("ui-state-error");
                $modal.validateButton.children().first().removeClass("ui-icon-check").addClass("ui-icon-circle-close");
                $modal.errorSpan.show();
                $modal.errorSpan.text(picker.errors[0]);
            }
        };
        /**
         * function to call when input is changed
         * @param {hb.ui.HDatePicker} picker
         * @private
         */
        let _onInputChange = function(picker) {
            let $modal = picker.$modal;
            let type = $modal.typeSelector.find(":selected").val();
            let sDate = $modal.dateInput.val();
            picker.errors=[];

            picker.hDate = null;
            let date = null;
            if(type === "2"){
                let regex = new RegExp("^([^;]+);([^;]+)$");
                let regexArray = regex.exec(sDate);
                if(regexArray === null) {
                    picker.errors.push(hb.util.trans.PARSING_ERRORS[5]);
                    _refresh(picker,false);
                    return;
                }

                date = _PARSERS["1"](regexArray[1],picker.errors);
                let endDate = _PARSERS["1"](regexArray[2],picker.errors);

                if(date !== null && endDate !== null){
                    if(hb.util.date.dayDiff(endDate,date) < 1){
                        picker.errors.push("La date de fin doit être strictement posterieure à la date de début");
                        _refresh(picker,false);
                        return;
                    }
                    picker.hDate = new HDate("2",date,endDate);
                }
            }
            else{
                date = _PARSERS[type](sDate,picker.errors);
                if(date !== null) {picker.hDate = new HDate(type,date);}
            }
            _refresh(picker,false);
        };
        /**
         * @doc function to call when hdate type is changed
         * @param {hb.ui.HDatePicker} picker
         * @private
         */
        let _onTypeChange = function(picker) {
            let $modal = picker.$modal;
            let type = $modal.typeSelector.find(":selected").val();

            if (picker.hDate !== null && picker.errors.length < 1){
                picker.hDate.type = type;
                $modal.dateInput.val(picker.hDate.getCanonicalInput());
                _refresh(picker);
            }
            else{
                _onInputChange(picker);
            }
        };
        /**
         * @doc updates data-hdate attribute and value of the current picker element
         * @param {hb.ui.HDatePicker} picker
         * @private
         */
        let _updateElement = function(picker) {
            if(picker.errors.length > 0 || picker.hDate === null ) {return;}
            picker.$element.first().val(picker.hDate.label);
            picker.$element.first().attr("data-hdate",JSON.stringify(picker.hDate));
            picker.$element.first().change();
        };
        /**
         * @doc function to call when user validates the picker input
         * @param {hb.ui.HDatePicker} picker
         * @private
         */
        let _onValidate = function(picker) {
            let $modal = picker.$modal;
            _updateElement(picker);
            $modal.mouseOn = false;
            $modal.focusout();
        };
        /**
         * @doc apply events and dynamic to HDatePicker
         * @param {hb.ui.HDatePicker} picker
         * @private
         */
        let _applyEvents= function(picker) {
            let $modal = picker.$modal;

            $modal.mouseenter(function(){picker.mouseOn = true;});
            $modal.mouseleave(function(){picker.mouseOn = false;});
            $modal.typeSelector.on("change",function(){_onTypeChange(picker);});
            $modal.dateInput.on("change",function(){_onInputChange(picker);});
            $modal.dateInput.on("keyup", function(event) {
                if(event.keyCode === 13){_onValidate(picker);}
                else{_onInputChange(picker);}
            });
            $modal.validateButton.on("click", function() {_onValidate(picker);});
            $modal.on("focusout", function(event)
            {
                if(picker.mouseOn){
                    event.stopPropagation();
                    event.preventDefault();
                    return;
                }
                $modal.mouseOn = false;
                if(picker.$element === null) {return;}
                picker.$element.attr("disabled","disabled");
                picker.unbind();
                setTimeout(function() {picker.$element.removeAttr("disabled");picker.$element.blur();}, 30);
                picker.$element.prev().click();
                picker.$element.blur();
            });
        };


        /**
         * @doc HDatePicker modal constructor
         * @class hb.ui.HDatePicker
         * @param {object} option
         */
        hb.ui.HDatePicker = function(option = {}) {
            this.option = _setDefaultOption(option);
            this.errors=[];
            this.$element=null;
            this.hDate=null;
            this.mouseOn = false;
            this.$modal =  $("<div>").dialog({
                autoOpen: false,
                dialogClass: "hb-modal-z" + this.option.z,
                show: {
                    effect: "fade",
                    duration: this.option.fadeTime
                }
            });
            _build(this);
            _applyOption(this);
            _applyEvents(this);

            this.$modal.dialog("close");
            return this;
        };

        let _prototype = {
            bind : function($element) {
                if($element === null){return;}
                let $modal = this.$modal;
                this.unbind();
                $modal.$element=$element;
                $element.addClass( "hb-enabled");
                this.option.title = { my: "left top", at: "left bottom", of: $element };
                if(typeof (this.$element.first().attr("data-label")) !== "undefined"){
                    this.option.title = this.$element.first().attr("data-label");}

                if(typeof ($element.first().attr("data-hdate")) !== "undefined"){
                    this.hDate = hb.util.HDate.parseJSON($element.first().attr("data-hdate"));
                }
                else if (this.hDate !== null){this.hDate = this.hDate.clone();}

                _refresh(this,true);
                this.dialog("open");
            },
            unbind : function() {
                let $modal = this.$modal;
                if($modal.$element === null){return;}
                let $element = $modal.$element;
                this.dialog("close");
                $modal.$element=null;
                setTimeout(function(){$($element).removeClass("hdatepicker-enabled");}, 40);
            }
        };
        Object.extend(hb.ui.HDatePicker.prototype,_prototype);

        $.widget( "hb.hdatepicker", {
            // default options
            options: {
            },

            // The constructor
            _create: function() {
                let $element = $(this.element).first();

                console.log("create hdatepicker widget");
                function enableDatePicker($element){
                    if(! $element.hasClass("hb-enabled")){
                        hb.ui.manager.get("hdatepicker").bind($element);
                    }
                }
                $($element).on("focus",function(){enableDatePicker(this);});
                $($element).on("keyup",function(){enableDatePicker(this);});

                $(this.element).change(function(){
                    let $element = $(this).first();
                    if($element.attr("data-hdate") === "undefined" || $element.attr("data-hdate") === null ||
                        $element.attr("data-hdate") === "") return;
                    let hDate = hb.util.HDate.parseFromJson($element.attr("data-hdate"));
                    let $partner;
                    let partnerHDate = null;
                    let newPartnerHDate = null;
                    if(typeof $element.attr("data-date-ender") !== "undefined"){
                        $partner = $("#" + $element.attr("data-date-ender"));
                        if(! $partner.hasClass("hb-hdatepicker") ) return;

                        if(typeof $partner.attr("data-hdate") !== "undefined" && $partner.attr("data-hdate") !== null &&
                            $partner.attr("data-hdate") !== ""){
                            partnerHDate =  hb.util.HDate.parseFromJson($partner.attr("data-hdate"));
                        }
                        if(partnerHDate === null || partnerHDate.endDate < hDate.endDate){
                            newPartnerHDate = new hb.util.HDate("1",hDate.endDate);
                            $partner.attr("data-hdate",JSON.stringify(newPartnerHDate));
                            $partner.val(newPartnerHDate.label);
                        }
                    }
                    else if(typeof $element.attr("data-date-beginner") !== "undefined"){
                        $partner = $("#" + $element.attr("data-date-beginner"));
                        if(! $partner.hasClass("hb-hdatepicker") ) return;
                        if(typeof $partner.attr("data-hdate") !== "undefined" && $partner.attr("data-hdate") !== null &&
                            $partner.attr("data-hdate") !== ""){
                            partnerHDate =  hb.util.HDate.parseFromJson($partner.attr("data-hdate"));
                        }
                        if(partnerHDate === null || partnerHDate.beginDate > hDate.beginDate){
                            newPartnerHDate = new hb.util.HDate("1",hDate.beginDate);
                            $partner.attr("data-hdate",JSON.stringify(newPartnerHDate));
                            $partner.val(newPartnerHDate.label);
                        }
                    }
                });
                // at start an attempt is made to retrieve hdate attribute of the $element an update it"s value accordingly
                if(typeof $element.attr("data-hdate") !== "undefined" && $element.attr("data-hdate") !== null){
                    $element.val( $.hbase.HDate.parse(this.$element.attr("data-hdate")).label);
                }
            },
            // Events bound via _on are removed automatically
            // revert other modifications here
            _destroy: function() {
            }
        });





        console.log(_moduleName + " loaded");
        return hb.ui;
    }(hb || {},$));

    let _loadedModules = ((typeof hb.getLoadedModules==="function")?hb.getLoadedModules():[]);
    _loadedModules.push(_moduleName);
    hb.getLoadedModules = function() {
        return _loadedModules;
    }
    return hb;
}(hb || {},$));
