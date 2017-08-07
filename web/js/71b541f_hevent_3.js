/**
 * 
 */

HEvent.prototype.animationTime = 500;
HEvent.prototype.animationTextTime = 650;
HEvent.prototype.rPinPoint = 5;

//prototype events
function HEvent(hts,type,attachment=null,y=null,name=null){
	this.id=this.idGenerator();
	this.hts = hts;
	this.type = type; // is the event detailed (with article) of not ? : can be main, attached or unattached
	this.hasArticle = false; // indicate if the event has a detailed article
	this.y = (this.type === 'main')?20:y;
	this.adjustedY=y; // adjusted y to prevent event overflow when time dezoomed
	this.adjustedX=0; // adjusted x for text display
	
	this.name=name;
	this.abstract=null;
	this.rendered = false;
	this.rect = null;
	this.rectId = null;
	this.text = null;
	this.pinPoint = null;
	this.pinPointId = null;

	this.beginDate=null; // HDate
	this.hasEndDate=true; // boolean
	this.endDate=null; // HDate
	this.rendered = false;
	this.manager = null;
}

/** make the idGenerator for the event prototype */
HEvent.prototype.idGenerator = idGenerator();

HEvent.prototype.dateFormatter = myFormatPatternDate("d/m/Y");


/** function to create graphic components of events */
HEvent.prototype.render = function(){
	if(this.rendered) return;
	
	this.rectId = 'hts-event-rect-' + this.type + '-' + this.id;
	this.textId = 'hts-event-title-' + this.type + '-' + this.id;
	this.pinPointId = 'hts-event-pin-' + this.type + '-' + this.id;

	var htsEvent=this;
	var color = (this.type === 'main')?"Orange":"MediumSlateBlue";
	

	this.rect = this.hts.findComponentByName('event-area')
	.append("rect")
	.attr("id",this.rectId)
	.attr("title",this.rectId)   
	.attr("fill",color)
	.attr("opacity","1")
	.attr("cursor","pointer")
	.on('click',function(){
		console.log("edition event existant");	
		htsEvent.edit();
	d3.event.preventDefault();
	d3.event.stopPropagation();});	
	
	this.text = this.hts.findComponentByName('event-area')
	.append("text")
	.attr("id","<a href='' >" + this.textId + "</a>")
	.text(this.name);
	
	this.pinPoint = this.hts.findComponentByName('event-area')
	.append("circle")
	.attr("id",this.pinPointId)
	.attr("r",this.rPinPoint)
	.attr("fill","yellow")
	.attr("cursor","pointer")
	.attr("stroke","orange")
	.attr("stroke-width",2)
	.call(d3.drag()
		.on("start", function(){htsEvent.deltaY = htsEvent.y - d3.event.y;})
		.on("drag",  function(){	
			if((d3.event.y + htsEvent.deltaY) < htsEvent.manager.yMargin) return;
			htsEvent.y = d3.event.y + htsEvent.deltaY;
			htsEvent.adjustedY = htsEvent.y;
			htsEvent.manager.setMaxY(htsEvent.y + htsEvent.manager.yMargin);
			htsEvent.updateRender();})
		.on("end", function(){})
	)
	.on('click',function(){
		console.log("edition event existant");	
		htsEvent.edit();
	d3.event.preventDefault();
	d3.event.stopPropagation();})
	
	
	this.rendered=true;
}

/** function returning true if two events cross in time, false otherwise */
HEvent.prototype.cross = function(HEvent2){
	 if((this.getDisplayedEndDate() >= HEvent2.getDisplayedBeginDate() && 
			 this.getDisplayedBeginDate() <= HEvent2.getDisplayedEndDate()) ||
			 (this.getDisplayedBeginDate() <= HEvent2.getDisplayedEndDate() &&
			  this.getDisplayedEndDate() >= HEvent2.getDisplayedBeginDate()	)){return true;}
	return false;
}

/** function returning true if the display(text) of two events intersect */
HEvent.prototype.displayIntersect = function(HEvent2){
	var width1 = this.text.node().getBBox().width;
	var minX1 = Number(this.text.attr("x")) - width1/2;
	var maxX1 = Number(this.text.attr("x")) + width1/2;
	var width2 = HEvent2.text.node().getBBox().width;
	var minX2 = Number(HEvent2.text.attr("x")) - width2/2;
	var maxX2 = Number(HEvent2.text.attr("x")) + width2/2;
	 if((maxX1 >= minX2 && minX1 <= maxX2)|| (minX2 <= maxX1 && maxX2 >= minX1)){return true;} // check textArea
    width1 = Number(this.rect.attr("width"));
	minX1 = Number(this.rect.attr("x")) - width1/2 - this.rPinPoint/2;
	maxX1 = Number(this.rect.attr("x")) + width1/2;
	width2 = Number(HEvent2.rect.attr("width"));
	minX2 = Number(HEvent2.rect.attr("x")) - width2/2 - this.rPinPoint/2;
	maxX2 = Number(HEvent2.rect.attr("x")) + width2/2; 
	if((maxX1 >= minX2 && minX1 <= maxX2)|| (minX2 <= maxX1 && maxX2 >= minX1)){return true;} // check Rect
	return false;
}




/** function to create graphic components of events */
HEvent.prototype.updateRender = function(){
	var hEvent = this;
	
	this.pinPoint
	.transition()
	.attr("cy",this.adjustedY + this.hts.ABS_EVENT_HEIGHT/2 )
	.attr("cx",this.hts.dateScale(this.beginDate.getBoundDate(0)))
	.duration(hEvent.animationTime);
	
	this.rect
	.transition()
	.attr("x",this.hts.dateScale(this.getDisplayedBeginDate()))
	.attr("y",this.adjustedY)   
	.attr("width",this.hts.dateScale(this.getDisplayedEndDate()) - this.hts.dateScale(this.getDisplayedBeginDate()))
	.attr("height",this.hts.ABS_EVENT_HEIGHT)
	.duration(hEvent.animationTime);
	
	
	
	this.adjustedX = (this.hts.dateScale(this.getDisplayedBeginDate()) + this.hts.dateScale(this.getDisplayedEndDate()) - this.text.node().getBBox().width)/2 ; // default X
	if(this.getDisplayedBeginDate() < this.hts.beginDate && 
			this.getDisplayedEndDate() > this.hts.beginDate &&
			this.getDisplayedEndDate() < this.hts.endDate){
		this.adjustedX = Math.max(this.adjustedX,5);
	}
	else if(this.getDisplayedEndDate() > this.hts.endDate && 
			this.getDisplayedBeginDate() < this.hts.endDate &&
			this.getDisplayedBeginDate() > this.hts.beginDate){
		this.adjustedX = Math.min(this.adjustedX,this.hts.htsBaseWidth - this.text.node().getBBox().width-5);
		console.log(this.text.node().getBBox());
	}
	else if(this.getDisplayedEndDate() > this.hts.endDate && 
			this.getDisplayedBeginDate() < this.hts.beginDate){
		
		var ratio = (this.hts.endDate.dayDiff(this.hts.beginDate)) / (this.getDisplayedEndDate().dayDiff(this.getDisplayedBeginDate()));
		var offset = (this.getDisplayedEndDate().dayDiff(this.hts.endDate)) - (this.hts.beginDate.dayDiff(this.getDisplayedBeginDate()));
		
		var virtualDate = this.hts.beginDate.clone().addDay(offset);
		
		console.log(this.hts.dateScale(virtualDate),ratio);
		
		this.adjustedX = this.hts.htsBaseWidth/2 + this.hts.dateScale(virtualDate)*ratio/1.5;
		this.adjustedX = Math.max(this.adjustedX,5);
		this.adjustedX = Math.min(this.adjustedX,this.hts.htsBaseWidth - this.text.node().getBBox().width-5);
	}
	
	this.text
	.attr("text-anchor","start")  
	.attr("height",this.hts.ABS_EVENT_HEIGHT)
	.transition()
	.attr("y",this.adjustedY -5)
	.attr("x",this.adjustedX)
	.duration(hEvent.animationTextTime);
	
	
	;	
}

HEvent.prototype.getDisplayedEndDate = function(){
	return this.endDate.getBoundDate(0).clone().addDay(1);
}
HEvent.prototype.getDisplayedBeginDate = function(){
	return this.beginDate.getBoundDate(0);
}

/** create the html form for the event */
HEvent.prototype.getFormHtml = function(){
	// oddly it didn't work directly selecting object args to the input, hence this trick
	var formValues = [];

	formValues["input-title-event"] = this.name;
	formValues["description-event"] = this.abstract;
	formValues["input-begin-date-precise"] = (this.beginDate != null)?this.dateFormatter(this.beginDate.getBoundDate(0)):"";
	formValues["input-begin-date-imprecise"] = (this.beginDate != null)?this.beginDate.isExact():false;
	formValues["begin-date-min"] = (this.beginDate != null)?this.dateFormatter(this.beginDate.getBoundDate(0)):""  ;
	formValues["begin-date-max"] = (this.beginDate != null)?this.dateFormatter(this.beginDate.getBoundDate(1)):"";
	// formValues[] = ;
	formValues["input-end-date-precise"] = (this.endDate != null)?this.dateFormatter(this.endDate.getBoundDate(0)):"" ;
	formValues["input-end-date-imprecise"] = (this.endDate != null)?this.endDate.isExact():false;
	formValues["end-date-min"] = (this.endDate != null)?this.dateFormatter(this.endDate.getBoundDate(0)):"";
	formValues["end-date-max"] = (this.endDate != null)?this.dateFormatter(this.endDate.getBoundDate(1)):"";
	// formValues[] = ;

	var dateRegex = "^(0?[1-9]|[1-2][0-9]|3[0-1])/(0?[1-9]|1[0-2])/(-?[1-9][0-9]*)$";

	return ['<form id="hts-form-event" action="" method="post">',
		'<div id="warning-event" />',
		'<div id="title-event"><input name="title-event" id="input-title-event" type="text" placeholder="nom" size=55 required=true value="',
		formValues["input-title-event"],
		'"></input></div>',
		'<br>',
		'<div><textarea id="description-event" rows="4" cols="80" placeholder="description" required=true value="">',
		formValues["description-event"],
		'</textarea></div>',
		'<b>Début</b><br>',
		'<div id="begin-date-precise">',
		'<input name="date" id="input-begin-date-precise" type="text" pattern="'+ dateRegex + '" placeholder="JJ/MM/AAAA" required=true value="' ,
		formValues["input-begin-date-precise"],
		'"/></div>',
		'Approx.?<input id="input-begin-date-imprecise" type="checkbox" value=',
		formValues["input-begin-date-imprecise"],
		'/>',
		'<div hidden=true id="begin-date-min">Date min estimée <input name="date" id="input-begin-date-min" type="text" pattern="'+ dateRegex + '" placeholder="JJ/MM/AAAA" value="',
		formValues["begin-date-min"],
		'" /></div>',
		'<div hidden=true id="begin-date-max">Date Max estimée <input name="date" id="input-begin-date-max" type="text" pattern="'+ dateRegex + '" placeholder="JJ/MM/AAAA" value="' ,
		formValues["begin-date-max"],
		'"/></div><br>',
		'<b>Fin</b> <input id="input-end-date-nonexists" type="checkbox" /><br>',
		'<div id="end-date-precise">',
		'<input name="date" id="input-end-date-precise" type="text" pattern="'+ dateRegex + '" placeholder="JJ/MM/AAAA" required=true value="', 
		formValues["input-end-date-precise"],
		'"/></div>',
		'Approx.?<input id="input-end-date-imprecise" type="checkbox" value=',
		formValues["input-end-date-imprecise"],
		'/>',
		'<div hidden=true id="end-date-min">Date min estimée <input name="date" id="input-end-date-min" type="text" pattern="'+ dateRegex + '" placeholder="JJ/MM/AAAA" value="', 
		formValues["end-date-min"],
		'"/></div>',
		'<div hidden=true id="end-date-max">Date Max estimée <input name="date" id="input-end-date-max" type="text" pattern="'+ dateRegex + '" placeholder="JJ/MM/AAAA" value="', 
		formValues["end-date-max"],
		'"/></div>',
		'<div hidden=true><input hidden=true type="submit" id="hts-fake-submitter" class="validateDontSubmit" value=""></div>',
		'</form>'].join('');	
}
/** define events applied to form components, once it's defined */
HEvent.prototype.addFormEvent = function(){
	// add requirement attributes according to which date inputs are relevant (precise or unprecise)
	$("#input-begin-date-imprecise").on("click",
			function() {
		if (this.checked) {
			$("#begin-date-precise").hide();
			$("#input-begin-date-precise").attr("required",false);
			$("#begin-date-min").show();
			$("#begin-date-max").show();
			$("#input-begin-date-min").attr("required",true);
			$("#input-begin-date-max").attr("required",true);
		}
		else {
			$("#begin-date-precise").show();
			$("#input-begin-date-precise").attr("required",true);
			$("#begin-date-min").hide();
			$("#begin-date-max").hide();
			$("#input-begin-date-min").attr("required",false);
			$("#input-begin-date-max").attr("required",false);
		}
	});
	$("#input-end-date-imprecise").on("click",
			function() {
		if (this.checked) {
			$("#end-date-precise").hide();
			$("#input-end-date-precise").attr("required",false);
			$("#end-date-min").show();
			$("#end-date-max").show();
			$("#input-end-date-min").attr("required",true);
			$("#input-end-date-max").attr("required",true);						
		}
		else {
			$("#end-date-precise").show();
			$("#input-end-date-precise").attr("required",true);					
			$("#end-date-min").hide();
			$("#end-date-max").hide();
			$("#input-end-date-min").attr("required",false);
			$("#input-end-date-max").attr("required",false);	
		}
	});
}



/** handle form submission and create the event */
HEvent.prototype.setForm = function(){
	this.checkFormValidity();
}



//check if event form is valid : returns true or false
HEvent.prototype.checkFormValidity = function(){
	// control begin Date
	if (! $("#input-begin-date-imprecise:checked").length>0){
		if (myParseDate($("#input-begin-date-min").val()) === null) $("#input-begin-date-min").val(null);
		if (myParseDate($("#input-begin-date-max").val()) === null) $("#input-begin-date-max").val(null);
	}
	else{			
		if (myParseDate($("#input-begin-date-precise").val()) === null) $("#input-begin-date-precise").val(null);					
	}
	// control end date
	if (! $("#input-end-date-imprecise:checked").length>0){
		if (myParseDate($("#input-end-date-min").val()) === null) $("#input-end-date-min").val(null);
		if (myParseDate($("#input-end-date-max").val()) === null) $("#input-end-date-max").val(null);
	}
	else{				
		if (subDate = myParseDate($("#input-end-date-precise").val()) === null) $("#input-end-date-precise").val(null);					
	}

	if(! document.getElementById("hts-form-event").checkValidity()){
		$("#hts-fake-submitter").click();
		return false;
	}

	return true;
}


//function to handle event edition (with modal display)
HEvent.prototype.edit = function(){
	var message= 'Edition de l\'évenement';
	if(! this.rendered){
		message = 'Ajoutez des événements liés';
		if(this.type === 'main'){
			message = 'Définissez votre événement';
		}
	}

	var htsEvent = this;
	var form = vex.dialog.open({
		className: 'vex-theme-os',
		message: message,
		input: htsEvent.getFormHtml(),
		defaultOptions:{escapeButtonCloses: false,showCloseButton: true},
		buttons: [
			$.extend({}, vex.dialog.buttons.YES, { id: 'hts-event-add', text: 'Ajouter' }),
			$.extend({}, vex.dialog.buttons.NO, { text: 'Annuler' })
			],
			callback: function (value) {
				if (value == 0) return; // cancel button

				if(! htsEvent.checkFormValidity()){
					throw new Error("form is not valid"); // prevent callback return and hence modal closing
				}
				else{
					console.log("form is valid");
					htsEvent.name = $("#input-title-event").val();
					htsEvent.abstract = $("#description-event").val();
					console.log(htsEvent.abstract);		        		  if ($("#input-begin-date-imprecise:checked").length>0){
						htsEvent.beginDate = new HDate(myParseDate($("#input-begin-date-min").val()),
								myParseDate($("#input-begin-date-max").val()));
					}
					else{	
						htsEvent.beginDate = new HDate(myParseDate($("#input-begin-date-precise").val()));					
					}
					if ($("#input-end-date-imprecise:checked").length>0){
						htsEvent.endDate = new HDate(myParseDate($("#input-end-date-min").val()),
								myParseDate($("#input-end-date-max").val()));
					}
					else{	
						htsEvent.endDate = new HDate(myParseDate($("#input-end-date-precise").val()));					
					}
					
					if (! htsEvent.rendered) htsEvent.render();
					htsEvent.updateRender();
					if(htsEvent.manager === null) htsEvent.hts.eventManager.addEvent(htsEvent);
					return true;
				}



			}
	});	
	// add form event
	this.addFormEvent();
	
}


