

/** the jQuery Hbase object will be the core object for various variables and methods of hbase front-end library */

$.hbase = {};
$.hbase.modal = {};
$.hbase.func = {};
$.hbase.HDate = HDate.prototype;
$.hbase.hiddenInput = $("<input/>").hide();

$.hbase.currentRegional = "french";
$.hbase.regional = {
    "french":{
        placeHolders : {"1":"JJ/MM/AAAA","2":"JJ/MM/AAAA;JJ/MM/AAAA",
            "3":"MM/AAAA","4":"MM/AAAA","5":"AAAA",
            "6":"AAAA","7":"AAAA","8":"AAAA"},
        inputLabel : {"1":"Entrez la date complete comme 9/11/1989 ou 15/3/-44","2":"Entrez la date imprecise (Ex: 11/10/732;13/10/733)",
            "3":"Entrez le mois (Ex: 7/622 ou 10/-539)","4":"Entrez la saison (Ex: 1/208 ou 4/1917)",
            "5":"Entrez l'année (Ex: 1968 ou -333)","6":"Entrez une année du de la decennie (Ex: 1242 ou 1648)",
            "7":"Entrez une année du siècle (Ex: -221 ou 1789)","8":"Entrez une année du millénaire (Ex: -3140 ou 1945)"},
        closeText: "Done", // Display text for close link
        prevText: "Prev", // Display text for previous month link
        nextText: "Next", // Display text for next month link
        currentText: "Today", // Display text for current month link
        monthNames: [ "Janvier","Fevrier","Mars","Avril","Mai","Juin",
            "Juillet","Aout","Septembre","Octobre","Novembre","Decembre" ], // Names of months for drop-down and formatting
        monthNamesShort: [ "Jan", "Fev", "Mar", "Avr", "Mai", "Juin", "Juil", "Aout", "Sep", "Oct", "Nov", "Dec" ], // For formatting
        dayNames: [ "Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday" ], // For formatting
        dayNamesShort: [ "Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat" ], // For formatting
        dayNamesMin: [ "Su","Mo","Tu","We","Th","Fr","Sa" ], // Column headings for days starting at Sunday
        weekHeader: "Wk", // Column header for week of the year
        dateFormat: "mm/dd/yy", // See format options on parseDate
        firstDay: 0, // The first day of the week, Sun = 0, Mon = 1, ...
        isRTL: false, // True if right-to-left language, false if left-to-right
        showMonthAfterYear: false, // True if the year select precedes month, false for month then year
        yearSuffix: "" // Additional text to append to the year in the month headers
    }
};



/**
 * @doc generic hbase project factory for various objects
 * @param {string} type : available values {hdatepicket|hmaxlength|harticlemodal}
 * @returns {jQuery}
 */
$.hbase.func.factory = function(type)
{
    var factories = [];

    var newModal = function(z = 7,fadeTime = 250)
    {
        var $modal = $("<div>").dialog({
            autoOpen: false,
            dialogClass: "hb-modal-z" + z,
            show: {
                effect: "fade",
                duration: fadeTime
            }
        });
        $modal.errors=[];
        $modal.element=null;
        $modal.hDate=null;
        $modal.regional = $.hbase.regional[$.hbase.currentRegional];
        $(".ui-dialog-titlebar-close").hide();
        $modal.mouseOn = false;
        $modal.mouseenter(function(){$modal.mouseOn = true;});
        $modal.mouseleave(function(){$modal.mouseOn = false;});
        return $modal;
    };

    factories.hdatepicker = function()
    {
        var $modal = new newModal();
        $modal.dialog( "option", "title", "Entrez une date" );
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
        $modal.dateInput = $("<input type='text' class='ui-corner-all' style='min-height:23px' " +
            "required='required' placeholder='JJ/MM/AAAA' maxlength='30' size='20'>").appendTo($modal.inputContainer);
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
    factories.hmaxlength = function(maxLength=255,warningThreshold=0.9)
    {
        var $paragraph = $("<p style='color:grey display:inline'>");
        $paragraph.maxLength=maxLength;
        $paragraph.warningThreshold=warningThreshold;
        $paragraph.setLength = function(length){
            $paragraph.text(length + "/" + $paragraph.maxLength + " caractères autorisés" );
            var ratio = length/$paragraph.maxLength;
            if(ratio >= 1 ){
                $paragraph.css("color","red");
            }
            else if(ratio > $paragraph.warningThreshold){
                $paragraph.css("color","DarkOrange");
            }
            else{
                $paragraph.css("color","grey");
            }
        }
        return $paragraph;
    };
    factories.harticlemodal = function()
    {
        var $modal = $("<div id='article_modal_live' class='modal fade' role='dialog'><div/>");
        $modal.container = $("<div class=\"modal-dialog modal-lg\">").appendTo($modal);
        $modal.content = $("<div class=\"modal-content\">").appendTo($modal.container);

        $modal.header = $("<div class=\"modal-header\">").appendTo($modal.content);
        $modal.body = $("<div class=\"modal-body\">").appendTo($modal.content);
        $modal.footer = $("<div class=\"modal-footer\">").appendTo($modal.content);

        // header
        $modal.dismissButtonHeader = $("<button type=\"button\" class=\"close\" data-dismiss=\"modal\">&times;</button>").appendTo($modal.header);
        $modal.title=$("<h4 class=\"modal-title\">Article</h4>");

        // content
        $modal.form = $($("#article_modal").html()).appendTo($modal.body);

        // footer
        $modal.dismissButtonFooter = $("<button type=\"button\" class=\"btn btn-default\" data-dismiss=\"modal\">Close</button>").appendTo($modal.footer);

        // functions


        /**
         * function binder to an element with attr hevent or hevent string directly
         * @param $element
         */
        $modal.bind = function($element){

        }


        return $modal;

    };



    return factories[type]();
};

$.widget( "hbase.hmaxlength", {
    // default options
    options: {
    },
    // The constructor
    _create: function() {
        console.log("create hmaxlength widget");
        var $element = $(this.element);
        $element.removeClass("hmaxlength-active");
        if($element.hasClass("hmaxlength-enabled")){return;}
        console.log($element);
        var $paragraph = $.hbase.func.factory("hmaxlength");
        $paragraph.setLength($element.text().length);
        if($element[0].hasAttribute("maxlength")){ $paragraph.maxLength=$element.attr("maxlength");}
        if($element[0].hasAttribute("warningthreshold")) {$paragraph.warningThreshold=$element.attr("warningthreshold");}


        $paragraph.insertAfter($element);
        $element.addClass("hmaxlength-enabled");
        $paragraph.hide();

        function showParagraph(){
            $paragraph.setLength($element.val().length);
            $paragraph.fadeIn(150);
            $element.addClass("hmaxlength-active");
        }
        function hideParagraph(){
            $paragraph.fadeOut(150);
            $element.removeClass("hmaxlength-active");
        }

        $element.on("focus",function(event){
            console.log("focus");
            if($element.hasClass("hmaxlength-active")) return;
            showParagraph();
        });

        $element.on("keypress",function(event){
            console.log("keypress" + $element.val().length);
            if(! $element.hasClass("hmaxlength-active")) return;
            if($element.val().length > $paragraph.maxLength) $element.val($element.val().substring(0,$paragraph.maxLength));
            $paragraph.setLength($element.val().length);
        });
        $element.on("keydown",function(event){$element.trigger("keypress");});
        $element.on("keyup",function(event){$element.trigger("keypress");});
        $element.on("focusout",function(event){
            console.log("focusout")
            if(! $element.hasClass("hmaxlength-active")) return;
            hideParagraph();
        });
    },
    // Events bound via _on are removed automatically
    // revert other modifications here
    _destroy: function() {
    }
});

$.widget( "hbase.htimescroller", {
    // default options
    options: {
    },

    // The constructor
    _create: function() {
        console.log("create hts1");
        if(! this.element.hasClass("htimescroller-enabled")){
            var htsOptions = {hasMainEvent:false};
            var endDate = new Date();
            var beginDate = endDate.clone().addDay(-7);
            console.log("create hts2 : ");
            console.log(this.element);
            var hts = new HTimeScroller("#" + this.element.first().attr("id"),beginDate,endDate,null,null, htsOptions);
            this.element.addClass("htimescroller-enabled");
        }
    },
    // Events bound via _on are removed automatically
    // revert other modifications here
    _destroy: function() {
    }
});
$.widget( "hbase.harticledisplayer", {
    // default options
    options: {
    },

    // The constructor
    _create: function() {
        console.log("create harticledisplayer widget");
        function enableArticleDisplayer(element){
            if(! element.hasClass("harticledisplayer-enabled")){
                $.hbase.modal.article.bind($(element));
            }
        }

        $(this.element).on("click",function(){enableArticleDisplayer($(this));});

    },
    // Events bound via _on are removed automatically
    // revert other modifications here
    _destroy: function() {
    }
});

$(function(){
    /*console.log("--- persistent resources creation ---");
    console.log("hdatepicker creation ... ");
    $.hbase.modal.hdatepicker = $.hbase.func.factory("hdatepicker");
    console.log("OK");

    console.log("harticlemodalcreation ...");
    if($("#article_modal").length === 0){
        console.log("undone, required bridge element #article_modal is missing.");
    }
    else{
        $.hbase.modal.article = $.hbase.func.factory("harticlemodal");
        console.log("OK");
    }*/

    $.hbase.func.hbaseCheck = function(element)
    {
        var $checker = $(element);
        var transition = $checker.is(":checked");
        var inverted = $checker.hasClass("hbase-inverted");
        if(inverted) transition = !transition;
        $($checker.attr("hBase-checked")).each(function(){
            var $checked = $(this);
            if(transition){
                $checked.show();
                console.log($checked[0].hasAttribute("hbase-default-required"));
                if($checked[0].hasAttribute("hbase-default-required")) $checked.attr("required","required");
            }
            else{
                $checked.hide();
                console.log($checked[0].hasAttribute("hbase-default-required"));
                $checked.removeAttr("required");
            }
        });
    }

    $.hbase.func.hbaseChecker = function(element)
    {
        $.hbase.func.hbaseCheck(element);
        $(element).on("change",function(){$.hbase.func.hbaseCheck(element);});
    }


    $.hbase.func.hbaseApply = function(rootSelector = null){
        console.log("application des widget");
        if(rootSelector === null){
            $(".hbase-hmaxlength").hmaxlength();
            $(".hbase-hdatepicker").hdatepicker();
            $(".hbase-htimescroller").htimescroller();
            $(".hbase-hdatepicker").hdatepicker();
            $(".hbase-activer").each(function(){$.hbase.func.hbaseChecker(this)});
            $(".hbase-article-form").on("submit",function(){$.hbase.func.hbaseArticleFormSubmitter(event,this);});

        }
        else{
            rootSelector.find(".hbase-hmaxlength").hmaxlength();
            rootSelector.find(".hbase-hdatepicker").hdatepicker();
            rootSelector.find(".hbase-htimescroller").htimescroller();
            rootSelector.find(".hbase-hdatepicker").hdatepicker();
            rootSelector.find(".hbase-activer").each(function(){$.hbase.func.hbaseChecker(this);});
            rootSelector.find(".hbase-article-form").on("submit",function(){$.hbase.func.hbaseArticleFormSubmitter(event,this);});
        }
    }

    $.hbase.func.hbaseApply();
});