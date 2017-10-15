/**
 * 
 */

HEvent.prototype.animationTime = 400;
HEvent.prototype.animationTextTime = 500;
HEvent.prototype.rPinPoint = 5;

//prototype events
function HEvent(hts,type,attachment=null,y=null,name=null){
	this.id=this.idGenerator();
	this.internId = null;
	this.articleParentId = null;
	this.linkId = null;
	this.url = null;
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
	this.hasNotEndDate=false; // boolean
	this.endDate=null; // HDate
	this.rendered = false;
	this.manager = null;

	this.articleType = 1;
	this.articleSubType = 1;

	this.redirect = false;

	// to handle submission
	this.toUpdate = true;
}

/** returns true if event exists in database ( article) or false otherwise (newly created event) */
HEvent.prototype.isPersisted = function(){
	return (this.internId > 0);
}

HEvent.prototype.getLabelHtml = function(){

	if(this.url != null){
		return "<span style=\"white-space:nowrap\" \"text-anchor\"=\"start\"><a href=\"" + this.url + 
		"\" title=\"" + this.name + "\" >" + 
		this.name + "</a></span>";
	}
	return "<span style=\"white-space:nowrap\" \"text-anchor\",\"start\"><i><p>" + 
	this.name + "</p></i></span>";
}	

/** make the idGenerator for the event prototype */
HEvent.prototype.idGenerator = idGenerator();
/** form id where events are bound to */
HEvent.prototype.FORM_ID = "article_modal";

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
		htsEvent.edit();
		d3.event.preventDefault();
		d3.event.stopPropagation();
	});

	this.text = this.hts.findComponentByName('event-area')
	.append("foreignObject")
	.attr("id",this.textId)
	.attr("text-anchor","middle")
	.html(this.getLabelHtml())
	.on('click',function(){d3.event.stopPropagation();});

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
				htsEvent.updateRender(0,0);})
				.on("end", function(){})
	)
	.on('click',function(){
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
HEvent.prototype.updateRender = function(animationTime = this.animationTime,animationTextTime = this.animationTextTime){
	var hEvent = this;

	this.pinPoint
	.transition()
	.attr("cy",this.adjustedY + this.hts.ABS_EVENT_HEIGHT/2 )
	.attr("cx",this.hts.dateScale(this.beginDate.getBoundDate(0)))
	.duration(animationTime);

	this.rect
	.transition()
	.attr("x",this.hts.dateScale(this.getDisplayedBeginDate()))
	.attr("y",this.adjustedY)   
	.attr("width",this.hts.dateScale(this.getDisplayedEndDate()) - this.hts.dateScale(this.getDisplayedBeginDate()))
	.attr("height",this.hts.ABS_EVENT_HEIGHT)
	.duration(animationTime);



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

		this.adjustedX = this.hts.htsBaseWidth/2 + this.hts.dateScale(virtualDate)*ratio/1.5;
		this.adjustedX = Math.max(this.adjustedX,5);
		this.adjustedX = Math.min(this.adjustedX,this.hts.htsBaseWidth - this.text.node().getBBox().width-5);
	}

	this.text 
	.attr("height",this.hts.ABS_EVENT_HEIGHT)
	.transition()
	.attr("y",this.adjustedY -20)
	.attr("x",this.adjustedX - 10)
	.duration(animationTextTime);	
}

HEvent.prototype.getDisplayedEndDate = function(){
	if(this.endDate === null) return new Date();
	return this.endDate.getBoundDate(0).clone().addDay(1);
}
HEvent.prototype.getDisplayedBeginDate = function(){
	return this.beginDate.getBoundDate(0);
}

/** create the html form for the event */
HEvent.prototype.getFormHtml = function(){
	var regexp = new RegExp('id="' + this.FORM_ID,'g');
	return regexp[Symbol.replace]($("#" + this.FORM_ID).html(), 'id="' + this.FORM_ID + '_live');
}

/** bind a form of given id with the data from this hevent object */
HEvent.prototype.bindToForm = function(formId){
	$("input#" + formId + "_title").val(this.name);
	$("select#" + formId + "_type").val(this.articleType).change();
	$("select#" + formId + "_subType").val(this.articleSubType).change();
	$("input#" + formId + "_title").val(this.name);
	$("textarea#" + formId + "_abstract").val(this.abstract);

	console.log("beginDateApprox", (this.beginDate != null)?!this.beginDate.isExact():false);

	$("input#" + formId + "_isBeginDateApprox").attr('checked',(this.beginDate != null)?!this.beginDate.isExact():false);
	$("input#" + formId + "_hasNotEndDate").attr('checked',this.hasNotEndDate);
	$("input#" + formId + "_isEndDateApprox").attr('checked',(this.endDate != null)?!this.endDate.isExact():false);


	$("input#" + formId + "_beginDate").val((this.beginDate != null)?this.dateFormatter(this.beginDate.getBoundDate(0)):"");
	$("input#" + formId + "_minBeginDate").val((this.beginDate != null)?this.dateFormatter(this.beginDate.getBoundDate(0)):"");
	$("input#" + formId + "_maxBeginDate").val((this.beginDate != null)?this.dateFormatter(this.beginDate.getBoundDate(1)):"");

	$("input#" + formId + "_endDate").val((this.endDate != null)?this.dateFormatter(this.endDate.getBoundDate(0)):"");
	$("input#" + formId + "_minEndDate").val((this.endDate != null)?this.dateFormatter(this.endDate.getBoundDate(0)):"");
	$("input#" + formId + "_maxEndDate").val((this.endDate != null)?this.dateFormatter(this.endDate.getBoundDate(1)):"");

	$("input#" + formId + "_y").val(this.y);
}

/** returns normalized associative array of the hevent */
HEvent.prototype.normalize = function(formId){
	var dto = {};
	dto.title = this.name;
	dto.type = this.articleType;
	dto.subType = this.articleSubType;
	dto.abstract = this.abstract;

	dto.isBeginDateApprox = (this.beginDate != null)?!this.beginDate.isExact():false;
	dto.beginDate = (this.beginDate != null)?this.dateFormatter(this.beginDate.getBoundDate(0)):"";
	dto.minBeginDate = (this.beginDate != null)?this.dateFormatter(this.beginDate.getBoundDate(0)):"";
	dto.maxBeginDate = (this.beginDate != null)?this.dateFormatter(this.beginDate.getBoundDate(1)):"";

	dto.hasNotEndDate = this.hasNotEndDate;
	dto.isEndDateApprox = (this.endDate != null)?!this.endDate.isExact():false;
	dto.endDate = (this.endDate != null)?this.dateFormatter(this.endDate.getBoundDate(0)):"";
	dto.minEndDate = (this.endDate != null)?this.dateFormatter(this.endDate.getBoundDate(0)):"";
	dto.maxEndDate = (this.endDate != null)?this.dateFormatter(this.endDate.getBoundDate(1)):"";

	dto.y = this.y;
	dto.id = this.internId;
	dto.parentId = this.articleParentId;
	dto.linkId = this.linkId;

	return dto;
}


/** update the object from the form of given Id */
HEvent.prototype.updateFromForm = function(formId){
	this.name = $("input#" + formId + "_title").val();
	this.articleType = $("select#" + formId + "_type").find(":selected").val();
	this.articleSubType = $("select#" + formId + "_subType").find(":selected").val();
	this.abstract = $("textarea#" + formId + "_abstract").val();

	if ($("input#" + formId + "_isBeginDateApprox").is(":checked")){
		this.beginDate = new HDate(myParseDate($("input#" + formId + "_minBeginDate").val()),
				myParseDate($("input#" + formId + "_maxBeginDate").val()));
	}
	else{	
		this.beginDate = new HDate(myParseDate($("input#" + formId + "_beginDate").val()));					
	}

	this.hasNotEndDate = ($("input#" + formId + "_hasNotEndDate").is(":checked"));
	this.endDate = null;
	if(! this.hasNotEndDate){
		if ($("input#" + formId + "_isEndDateApprox").is(":checked")){
			this.endDate = new HDate(myParseDate($("input#" + formId + "_minEndDate").val()),
					myParseDate($("input#" + formId + "_maxEndDate").val()));
		}
		else{	
			this.endDate = new HDate(myParseDate($("input#" + formId + "_endDate").val()));					
		}
	}
}

/** check if event form is valid : returns true or false */
HEvent.prototype.checkFormValidity = function(formId){
	// control begin Date
	var selector;
	if ($("input#" + formId + "_isBeginDateApprox").is(":checked")){
		selector = "input#" + formId + "_minBeginDate";
		if (myParseDate($(selector).val()) === null) $(selector).val(null);
		selector = "input#" + formId + "_maxBeginDate";
		if (myParseDate($(selector).val()) === null) $(selector).val(null);
	}
	else{	
		selector = "input#" + formId + "_beginDate";
		if (myParseDate($(selector).val()) === null) $(selector).val(null);				
	}
	// control end date if present
	if (! $("input#" + formId + "_hasNotEndDate").is(":checked")){
		if ($("input#" + formId + "_isEndDateApprox").is(":checked")){
			selector = "input#" + formId + "_minEndDate";
			if (myParseDate($(selector).val()) === null) $(selector).val(null);
			selector = "input#" + formId + "_maxEndDate";
			if (myParseDate($(selector).val()) === null) $(selector).val(null);
		}
		else{				
			selector = "input#" + formId + "_endDate";
			if (myParseDate($(selector).val()) === null) $(selector).val(null);						
		}
	}

	if(! document.getElementById(formId).checkValidity()){
		$("#" + formId + "_fake_submitter").click();
		return false;
	}
	return true;
}

/** function to handle event edition (with modal display) */
HEvent.prototype.edit = function(){
	var message= 'Edition de l\'évenement';
	if(! this.rendered){
		message = 'Ajoutez des événements liés';
		if(this.type === 'main'){
			message = 'Définissez votre événement';
		}
	}

	var htsEvent = this;
	var formId = htsEvent.FORM_ID + '_live';
	var form = vex.dialog.open({
		className: 'vex-theme-os',
		message: message,
		input: htsEvent.getFormHtml(formId),
		defaultOptions:{escapeButtonCloses: false,showCloseButton: true},
		buttons: [
			$.extend({}, vex.dialog.buttons.YES, { id: 'hts-event-add', text: 'Ajouter' }),
			$.extend({}, vex.dialog.buttons.NO, { text: 'Annuler' })
			],
			callback: function (value) {
				if (value == 0) return; // cancel button

				if(! htsEvent.checkFormValidity(formId)){
					throw new Error("form is not valid"); // prevent callback return and hence modal closing
				}
				else{
					console.log("form is valid");
					htsEvent.updateFromForm(formId);

					if (! htsEvent.rendered) htsEvent.render();
					htsEvent.text.html(htsEvent.getLabelHtml());
					htsEvent.toUpdate = true;
					htsEvent.updateRender();
					if(htsEvent.manager === null) htsEvent.hts.eventManager.addEvent(htsEvent);
					return true;
				}
			}
	});	

	// bind new form to Hevent
	this.bindToForm(formId);
	// add form  and initial state
	finalizeForm('modal_live');
}


