/** the jQuery Hbase object will be the core object for various variables and methods of hbase front-end library */
$.hbase = {};
$.hbase.modals = {};
$.hbase.HDate = HDate.prototype;
$.hbase.hiddenInput = $("<input/>").hide();

$.hbase.currentRegional = "french";
$.hbase.regional = {
		"french":{
			placeHolders : {"precise":"JJ/MM/AAAA","bounded":"JJ/MM/AAAA;JJ/MM/AAAA",
				"season":"MM/AAAA","month":"MM/AAAA","year":"AAAA",
				"decade":"AAAA","century":"AAAA","millenia":"AAAA"},
				inputLabel : {"precise":"Entrez la date complete comme 9/11/1989 ou 15/3/-44","bounded":"Entrez la date imprecise (Ex: 11/10/732;13/10/733)",
					"season":"Entrez la saison (Ex: 1/208 ou 4/1917)","month":"Entrez le mois (Ex: 7/622 ou 10/-539)","year":"Entrez l'année (Ex: 1968 ou -333)",
					"decade":"Entrez une année du de la decennie (Ex: 1242 ou 1648)","century":"Entrez une année du siècle (Ex: -221 ou 1789)","Entrez une année du millénaire (Ex: -3140 ou 1945)":"AAAA"},	
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

$.hbase.modalFactory = function(type)
{
	factories = [];

	newInstance = function()
	{
		var modal = $("<div title='Entrez une date'>").dialog({
			autoOpen: false,
			show: {
				effect: 'fade',
				duration: 250
			}
		});
		modal.errors=[];
		modal.element=null;
		modal.hDate=null;
		modal.regional = $.hbase.regional[$.hbase.currentRegional];
		$(".ui-dialog-titlebar-close").hide();
		modal.mouseOn = false;
		modal.mouseenter(function(){modal.mouseOn = true;});
		modal.mouseleave(function(){modal.mouseOn = false;});
		return modal;
	};

	var modal = new newInstance();

	factories["hdatepicker"] = function(modal)
	{
		modal.append("<label class='mx-2'>Type de date :</label>");
		modal.typeSelector = $("<select class='ui-corner-all'>").appendTo(modal)
		.append($('<option>', {value: 'precise',text: 'Précise'}))
		.append($('<option>', {value: 'bounded',text: 'Imprecise (bornée)'}))
		.append($('<option>', {value: 'month',text: 'Mois'}))
		.append($('<option>', {value: 'season',text: 'Saison'}))
		.append($('<option>', {value: 'year',text: 'Année'}))
		.append($('<option>', {value: 'decade',text: 'Decennie'}))
		.append($('<option>', {value: 'century',text: 'Siècle'}))
		.append($('<option>', {value: 'millenia',text: 'Millénaire'}));

		modal.append("<br>");
		var labelContainer = $("<div class='text-muted m-r visible-md-inline-block visible-lg-inline-block'>").appendTo(modal);
		modal.inputLabel = $("<p/>").appendTo(labelContainer);
		modal.inputContainer = $("<div>").appendTo(modal);
		modal.dateInput = $("<input type='text' class='ui-corner-all' style='min-height:23px' required='required' placeholder='JJ/MM/AAAA' maxlength='30' size='20'>").appendTo(modal.inputContainer);
		modal.validateButton = $("<button class=\"btn btn-primary\"></button>").button({icon: "ui-icon-circle-close"}).appendTo(modal.inputContainer);
		//modal.append("<br>");
		modal.errorSpan = $("<div disabled='disabled' class='ui-state-error alert alert-danger'></div>").appendTo(modal);
		modal.append("<label>Rendu de la date</label> : ");
		modal.dateLabel = $("<label>").appendTo(modal);
		modal.append("<br>").append("<label>[min;max]</label> : ");
		modal.dateInterval = $("<label>").appendTo(modal);
		modal.append("<br>");

		modal.bind = function(element)
		{
			if (modal.element !== null){modal.unbind();}
			modal.element=element;
			element.addClass( "hdatepicker-enabled" );
			this.attr("title","Entrez une date");
			if(typeof (this.element.first().attr("hdatepicker-label")) != 'undefined'){this.dialog('option','title',this.element.first().attr("hdatepicker-label"));}
			var position = $(element).offset();
			modalX = position.left + "px";
			modalY = (position.top + element.outerHeight()) + "px";
			if(element !== null && typeof (element.first().attr("hdate")) !== 'undefined'){
				modal.hDate = $.hbase.HDate.parse(element.first().attr("hdate"));
			}
			else if (modal.hDate !== null){
				modal.hDate = modal.hDate.clone();
			}
			this.refresh(true);
			this.dialog({
				position: { my: "left top", at: "left bottom", of: element }
			});
			this.dialog("open");
		};

		modal.unbind = function()
		{
			if(modal.element === null) return;
			//modal.errors=[];
			var element = modal.element;
			this.dialog("close");
			modal.element=null;
			setTimeout(function(){$(element).removeClass( "hdatepicker-enabled" );}, 40);
		};

		modal.refresh = function(total = false)
		{
			var type = $(this).find(":selected").val();
			modal.inputLabel.text(modal.regional.inputLabel[type]);
			modal.dateLabel.empty();
			modal.dateInterval.empty();
			if(total){modal.dateInput.empty();}
			if(modal.hDate !== null){
				if(total){
					modal.dateInput.val(modal.hDate.getCanonicalInput());
					modal.typeSelector.val(modal.hDate._type);
				}
				modal.dateLabel.text(modal.hDate.getLabel());
				modal.dateInterval.text(modal.hDate.getInterval());
			}
			modal.validateButton.button("enable").removeClass('ui-state-error');
			modal.validateButton.children().first().removeClass('ui-icon-circle-close').addClass('ui-icon-check');
			modal.errorSpan.hide();
			modal.validateButton.show();

			// if date value is empty validation icon isn't displayed
			if(modal.dateInput.val() === "" ){
				modal.validateButton.hide();
			}
			else if(modal.errors.length > 0 ){
				modal.validateButton.button("disable").addClass('ui-state-error');
				modal.validateButton.children().first().removeClass('ui-icon-check').addClass('ui-icon-circle-close');
				modal.errorSpan.show();
				modal.errorSpan.text(modal.errors[0]);
			}
		};

		// method called when date type is changed
		modal.selectorChanged =  function()
		{
			var type = $(this).find(":selected").val();
			modal.dateInput.attr("placeholder",modal.regional.placeHolders[type]);

			if (modal.hDate !== null && modal.errors.length < 1){
				modal.hDate.setType(type);
				modal.dateInput.val(modal.hDate.getCanonicalInput());
				modal.refresh();
			}
			else{
				modal.inputChanged();
			}
		};

		modal.inputChanged = function() 
		{
			var type = modal.typeSelector.find(":selected").val();
			var sDate = modal.dateInput.val();
			modal.errors=[];

			modal.hDate = null;
			var date = null;
			if(type == "bounded"){
				var regex = new RegExp("^([^;]+);([^;]+)$");
				var regexArray = regex.exec(sDate);
				if(regexArray === null) {
					modal.errors.push("La valeur entrée n'est pas convertible en date (imprecise). " + 
					"Exemples de valeurs autorisées : 2/5/1985;9/6/1985,3/04/-8;2/04/-7");
					modal.refresh();	
					return;
				}

				date = myParseDate(regexArray[1],"precise",modal.errors);
				var endDate = myParseDate(regexArray[2],"precise",modal.errors);

				if(date !== null && endDate !== null){
					if(endDate.dayDiff(date) < 1){
						modal.errors.push("La date de fin doit être strictement posterieure à la date de début");
						modal.refresh();	
						return;
					}
					modal.hDate = new HDate("bounded",date,endDate);
				}
				else{
					if (date === null) modal.errors[0]=modal.errors[0].replace("La valeur entrée ", "La valeur de début ");
					else modal.errors[0]=modal.errors[0].replace("La valeur entrée ", "La valeur de fin ");
				}
			}
			else{
				date = myParseDate(sDate,type,modal.errors);
				if(date !== null) modal.hDate = new HDate(type,date);	
			}
			modal.refresh();
			return;
		};

		modal.updateElement = function()
		{
			if(modal.errors.length > 0 || modal.hDate === null ) return;
			modal.element.first().val(modal.hDate.getLabel());
			modal.element.first().attr("hdate",JSON.stringify(modal.hDate));
			modal.element.first().change();
		};
		modal.validate = function()
		{
			modal.updateElement();
			modal.mouseOn = false;
			modal.focusout();	
		};

		modal.typeSelector.on("change",function(){modal.selectorChanged();});
		modal.dateInput.on("change",function(){modal.inputChanged();});
		modal.dateInput.on("keyup", function(event) {
			if(event.keyCode === 13){modal.validate();}
			else{modal.inputChanged();}
		});
		modal.validateButton.on("click", function() {modal.validate();});
		modal.on("focusout", function(event) 
				{
			if(modal.mouseOn){
				event.stopPropagation();
				event.preventDefault();
				return;
			}
			modal.mouseOn = false;
			if(modal.element === null)return;
			var element = modal.element;
			element.attr("disabled","disabled");
			modal.unbind();
			setTimeout(function() {element.removeAttr("disabled");element.blur();}, 30);
			element.prev().click();
			element.blur();
				});
		modal.dialog("close");
		return modal;
	};
	return factories[type](modal);
};


$.widget( "hbase.hdatepicker", {
	// default options
	options: {
	},

	// The constructor
	_create: function() {
		console.log("create hdatepicker widget");
		function enableDatePicker(element){
			if(! element.hasClass("hdatepicker-enabled")){
				$.hbase.modals.hdatepicker.bind($(element));
			}
		};

		$(this.element).on("focus",function(event){enableDatePicker($(this));});
		$(this.element).on("keyup",function(event){enableDatePicker($(this));});

		$(this.element).change(function(){
			var $element = $(this).first();
			if($element.attr("hdate") === 'undefined' || $element.attr("hdate") === null || $element.attr("hdate") === "") return;
			var hDate = $.hbase.HDate.parse($element.attr("hdate"));
			var partner;
			var partnerHDate;
			var newPartnerHDate;
			if(typeof $(this).attr("hdatepicker-ender") !== 'undefined'){
				partner = $("#" + $(this).attr("hdatepicker-ender"));
				if(! partner.hasClass("hbase-hdatepicker") ) return;
				partnerHDate = null;
				newPartnerHDate = null;
				if(typeof partner.attr("hdate") !== 'undefined' && partner.attr("hdate") !== null && partner.attr("hdate") !== ""){
					partnerHDate =  $.hbase.HDate.parse(partner.attr("hdate"));
				}
				if(partnerHDate === null || partnerHDate._endDate < hDate._endDate){
					newPartnerHDate = new HDate("precise",hDate._endDate);
					partner.attr("hdate",JSON.stringify(newPartnerHDate));
					partner.val(newPartnerHDate.getLabel());
				}
			}
			else if(typeof $(this).attr("hdatepicker-beginner") !== 'undefined'){
				partner = $("#" + $(this).attr("hdatepicker-beginner"));
				if(! partner.hasClass("hbase-hdatepicker") ) return;
				partnerHDate = null;
				newPartnerHDate = null;
				if(typeof partner.attr("hdate") !== 'undefined' && partner.attr("hdate") !== null && partner.attr("hdate") !== ""){
					partnerHDate =  $.hbase.HDate.parse(partner.attr("hdate"));
				}
				if(partnerHDate === null || partnerHDate._beginDate > hDate._beginDate){
					newPartnerHDate = new HDate("precise",hDate._beginDate);
					partner.attr("hdate",JSON.stringify(newPartnerHDate));
					partner.val(newPartnerHDate.getLabel());
				}
			}
		});
		// at start an attempt is made to retrieve hdate attribute of the element an update it's value accordingly
		if(typeof this.element.attr("hdate") !== 'undefined' && this.element.attr("hdate") !== null){
			this.element.val( $.hbase.HDate.parse(this.element.attr("hdate")).getLabel());
		}
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
			var htsOptions = [hasMainEvent=false];
			var endDate = new Date();
			var beginDate = endDate.clone().addDay(-7);
			console.log("create hts2 : ");
			console.log(this.element);
			var hts = new HTimeScroller("#" + this.element.first().attr('id'),beginDate,endDate,null,null, htsOptions);
			this.element.addClass("htimescroller-enabled");
		}
	},
	// Events bound via _on are removed automatically
	// revert other modifications here
	_destroy: function() {
	}
});

$(function(){
	console.log("application des widget");
	$.hbase.modals.hdatepicker = $.hbase.modalFactory("hdatepicker");
	$(".hbase-hdatepicker").hdatepicker();
	$(".hbase-htimescroller").htimescroller();
	$(".hbase-hdatepicker").hdatepicker();

	$('.hbase-article-form').on('submit', function (event) {
		event.preventDefault();
		event.stopPropagation();
		var $this = $(this);
		var $formData = $this.serializeArray();
		var formMap = getFormMap($formData);
		var $data; 
		$this.find(".hbase-hdatepicker").each(function(index){
			if(typeof formMap[this.name] !== 'undefined'){
				$data = $formData[formMap[this.name]];
				$data.value = $(this).attr("hdate");
			}
		});
		console.log($formData);

	$.ajax({
		url : $this.attr("action"),
		type : 'POST',
		dataType : 'html',
		data : $formData
	});	


		return false;
	});
});