//prototype historical date class ( handle imprecise dates)
function HDate(beginDate,endDate = null){
	this.beginDate = beginDate; 
	this.endDate = endDate; 
	if(endDate == null){
		this.endDate = beginDate; 
	}
	this.intervalSize = function(){
		return endDate.dayDiff(this.beginDate);
	}
	this.isExact = function(){
		return (this.endDate.dayDiff(this.beginDate) == 0);
	}
	this.equals = function(hDate){
		if (this.beginDate == hDate.beginDate && this.endDate == hDate.endDate) return true;
		return false;
	}
	this.getBoundDate = function(bound){ // 0 is the min Date, 1 is the max Date
		if (bound == 0){
			return this.beginDate;
		}
		else if(bound == 1){
			return this.endDate;
		}
		else{
			return null;
		}
	}
}
/**
 * define the manager for events
 */

HEventManager.prototype.yMargin = 15;

function HEventManager(hts){
	
	this.hts = hts;
	this.events = [];
	this.bufferEvent = null;
	this.maxYEvent = 100;
	this.maxYArea = 50;
}

/**
 * 
 */
HEventManager.prototype.createEvent =  function(x,y,beginX=null){
	
	var type = 'attached';
	if(this.events.length === 0 ) type = 'main';
	this.bufferEvent = new HEvent(this.hts,type,null,y);
	
	if(typeof beginX !=='undefined' && beginX !== null) var selectedBeginDate = this.hts.dateScale.invert(beginX);
	else var selectedBeginDate = this.hts.dateScale.invert(x);
	
	var selectedEndDate = this.hts.dateScale.invert(x);
	
	this.bufferEvent.beginDate = new HDate(selectedBeginDate);
	this.bufferEvent.endDate = new HDate(selectedEndDate);

	this.bufferEvent.edit();
	console.log('event edité');
}

HEventManager.prototype.addEvent =  function(event){
	event.manager = this;
	this.events.push(event);
	
	var manager = this;
	this.events.sort(function(e1,e2){manager.compareRank(e1,e2);});
	console.log(this.events);
	
	this.setMaxY(event.y+this.yMargin);
}

HEventManager.prototype.compareRank = function(event1,event2){
	if(event1.type ==='main') return -1;
	if(event2.type ==='main') return 1;
	//return event1.y - event2.y;
	return event1.adjustedY - event2.adjustedY;
}


HEventManager.prototype.setMaxY =  function(newMaxY){
	var oldMaxYArea = this.maxYArea;
	var minY = 50;
	var manager = this;
	if(this.events.length > 0){
		this.events.forEach(function(event){
			minY = Math.max(minY,event.y+manager.yMargin);
		});
	}
	this.maxYArea = Math.max(newMaxY,minY);
	if(this.maxYArea !== oldMaxYArea){
		this.hts.redrawComponent('event-area');
		this.hts.redrawComponent('event-fcontainer');
		this.hts.redrawComponent('event-container');
	}
}

HEventManager.prototype.updateRender =  function(){
	var manager = this;
	this.events.sort(function(e1,e2){return manager.compareRank(e1,e2);});
	console.log(this.events);
	
	var index = 0;
	var events = this.events;
	var eventsLength = events.length;
	var deltaYMin = 30;
	var overY = 5;
	this.events.forEach(function(event){
		if(index >= events.length-1) return;
		
		events[index+1].adjustedY = events[index+1].y;
		console.log(events[index+1].adjustedY - event.adjustedY,(events[index+1].adjustedY - event.adjustedY) < deltaYMin);
		console.log(event.displayIntersect(events[index+1]));
		
		if ((events[index+1].adjustedY - event.adjustedY) < deltaYMin && event.displayIntersect(events[index+1])){
			events[index+1].adjustedY += deltaYMin - (events[index+1].adjustedY - event.adjustedY) + overY;
		}
		index++;
	})
	
	
	this.events.forEach(function(hEvent){
		hEvent.updateRender();
	});
}
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



/**
 * graduation class
 */

/**
 * constructor for graduations
 */
function HGrad(hts,date,type,major){
	this.id=this.idGenerator();
	this.hts = hts;
	this.parent = hts.findComponentByName('mobile-area');
	this.date = date; 
	this.type = type;
	this.major = major;
	this.line = null;
	this.lineId = null;
	this.legend = null;
	this.legendId = null;
	this.gradHeight = 0;
	if(major == 1) {this.gradHeight=hts.htsGradMaxHeight;}
	else if (major == 0 ) {this.gradHeight=hts.htsGradMinHeight;}
	else if (major == -1 ) {this.gradHeight=hts.htsGradMinHeight;}

	if(hts !== null) render(this);

	/** make or update dom components displaying the graduation */
	function render(hGrad){
		hGrad.lineId = 'hts-grad-line-' + hGrad.type + '-' + (hGrad.findFormatDateFunction('id',0))(hGrad.date) + '-' + hGrad.id;
		hGrad.legendId = 'hts-grad-legend-' + hGrad.type + '-' + (hGrad.findFormatDateFunction('id',0))(hGrad.date) + '-' + hGrad.id;

		hGrad.line = hGrad.parent
		.append("line")
		.attr("id",hGrad.lineId)   
		.attr("stroke-opacity",0)
		.attr('class','hts-grad')
		.on('click', function(){centerHRange(hGrad,'begin');});

		hGrad.legend = hGrad.parent
		.append("text")
		.attr("id",hGrad.legendId)
		.text(hGrad.getLegend())
		.attr("fill-opacity",0)
		.attr('class','hts-grad')
		.on('click', function(){centerHRange(hGrad,'center');});

		hGrad.updateScale();

		// animation at the creation (only if visible ie custom opacity superior to 0)
		if(hGrad.legend.attr("custom-opacity") > 0){
			d3.
			select('#' + hGrad.lineId)
			.transition()
			.attr("stroke-opacity",1)
			.duration(hGrad.animationTime);

			d3.
			select('#' + hGrad.legendId)
			.attr("tr-begin",0)
			.transition()
			.attr("fill-opacity",hGrad.legend.attr("custom-opacity"))
			.attr("tr-begin",1)
			.on("end",function(){
				if(typeof this != 'undefined' && this !== null){
					this.setAttribute("fill-opacity",this.getAttribute("custom-opacity"));
				}
			})
			.duration(hGrad.animationTime);
		}
		else{
			d3.select('#' + hGrad.lineId).attr("stroke-opacity",1);
			d3.select('#' + hGrad.legendId).attr("tr-begin",1);
		}
	}
}

/** make the idGenerator for the graduation prototype */
HGrad.prototype.idGenerator = idGenerator();
/** animations time (ms) */
HGrad.prototype.animationTime = 800;

/**  make the date formatters functions according to different type/major */
HGrad.prototype.formatDateFunctions = [
	{type:'day',major:1,formatter: myFormatPatternDate("Dj/m")}	,
	{type:'day',major:0,formatter: myFormatPatternDate("Dd")},
	{type:'day',major:-1,formatter: function(){return '';}},
	{type:'week',major:1,formatter: myFormatPatternDate("M")},
	{type:'week',major:0,formatter: myFormatPatternDate("Dd")},
	{type:'week',major:-1,formatter: function(){return '';}},
	{type:'month',major:1,formatter: myFormatPatternDate("Y")},
	{type:'month',major:0,formatter: myFormatPatternDate("M")},
	{type:'month',major:-1,formatter: function(){return '';}},
	{type:'year',major:1,formatter: myFormatPatternDate("Y")},
	{type:'year',major:0,formatter: myFormatPatternDate("y")},
	{type:'year',major:-1,formatter: function(){return '';}},
	{type:'decade',major:1,formatter: myFormatPatternDate("Y")},
	{type:'decade',major:0,formatter: myFormatPatternDate("y")},
	{type:'decade',major:-1,formatter: function(){return '';}},
	{type:'century',major:1,formatter: myFormatPatternDate("Y")},
	{type:'century',major:0,formatter: myFormatPatternDate("c")},
	{type:'century',major:-1,formatter: function(){return '';}},
	{type:'id',major:0,formatter: myFormatPatternDate("d_m_Y")}	
	];

/**  callback function to find the adhoc formatter function */
HGrad.prototype.findFormatDateFunction = function(thisType,thisMajor){
	return (this.formatDateFunctions).find(function(functionArray){
		return (functionArray.type === thisType && functionArray.major === thisMajor);
	}).formatter;
};
/** return the formatted date of graduation */
HGrad.prototype.getLegend = function(){return hGradGetLegend(this);};
function hGradGetLegend(hGrad){return hGrad.findFormatDateFunction(hGrad.type,hGrad.major)(hGrad.date);}

/** trigger centering on a graduation with anchor middle ( click on text) or begin (click on line) */
function centerHRange(hGrad,anchor){
	if(hGrad.type === 'day') return; // it's not allowed to center to one day range
	var switcher = hGrad.hts.hRange.findSwitcherFunction(hGrad.type).switcher;
	var newBeginDate = hGrad.date.clone();
	var newEndDate = switcher(hGrad.date.clone(),true);
	if(anchor === 'center'){
		var dayDiff = newEndDate.dayDiff(newBeginDate);
		newBeginDate.addDay(-dayDiff/2);
		newEndDate.addDay(-dayDiff/2);
	}
	hGrad.hts.setDates(newBeginDate,newEndDate);
}

/** update graduation position when hts date Scales are changed */
HGrad.prototype.updateScale = function(){
	this.line.attr("x1",this.hts.dateScale(this.date)).attr("x2",this.hts.dateScale(this.date)); 
	this.legend.attr("x",this.hts.dateScale(this.date));
	this.legend.attr("y",this.hts.htsHUpperSpace + this.hts.htsBaseHeight-2);
	var opacity = 1;

	if(this.hts.htsBaseWidth-this.legend.attr("x") < this.hts.htsPinWidth/2){opacity = 0;}
	else if(this.hts.htsBaseWidth-this.legend.attr("x") < this.hts.htsPinWidth){
		opacity = (this.hts.htsBaseWidth-this.hts.htsPinWidth/2 - this.legend.attr("x"))/(this.hts.htsPinWidth/2);
	}
	else if(this.legend.attr("x") < 0){opacity = 0;}
	else if(this.legend.attr("x") < this.hts.htsPinWidth/2){
		opacity = (this.legend.attr("x"))/(this.hts.htsPinWidth/2);
	}
	this.legend.attr("custom-opacity",opacity);
	if(this.legend.attr("tr-begin")==1) this.legend.attr("fill-opacity",opacity);
	this.line.attr("y1",this.hts.htsHUpperSpace + this.hts.htsBaseHeight/2 - opacity*this.gradHeight/2);
	this.line.attr("y2",this.hts.htsHUpperSpace + this.hts.htsBaseHeight/2 + opacity*this.gradHeight/2);	  
};

/** remove dom components of the graduations with animation*/
HGrad.prototype.remove = function(){
	if(this.hts !== null){
		d3.
		select('#' + this.lineId)
		.transition()
		.attr("opacity",0)
		.duration(this.animationTime)
		.attr("class","suppressed");
		d3.
		select('#' + this.legendId)
		.transition()
		.attr("opacity",0)
		.duration(this.animationTime)
		.attr("class","suppressed");
		delete  this.line;
		delete  this.legend;
	}
};
/**
 * this class handle the range of date graduations between a beginning date and an end date
 * Convention : date range is considered closed at the beginning and open at the end : [beginDate,endDate[
 */

function HRange(hts,beginDate,endDate){
	this.hts = hts;
	this.beginDate = beginDate;
	this.endDate = endDate;
	this.type = hRangeGetType(this.beginDate,this.endDate);
	this.grads = this.computeSubArray(this.beginDate,this.endDate, this.type);
}

/** function returning the type of range according to begin and end date */
function hRangeGetType(beginDate,endDate){
	var dayCount = endDate.dayDiff(beginDate);
	if(dayCount <1){throw('unhandled date period for date range : minimum interval is one day.');}
	else if(dayCount <50){return 'day';}
	else if(dayCount <210){return 'week';}
	else if(dayCount <1500){return 'month';}
	else if(dayCount <20000){return 'year';}
	else if(dayCount <200000){return 'decade';}
	else{return 'century';}
}

/** make the range date switcher functions according to type */
HRange.prototype.switchFunctions = [
	{type:'day',switcher:switchToNextDay,supType:'week'},
	{type:'week',switcher:switchToNextWeek,supType:'month'},
	{type:'month',switcher:switchToNextMonth,supType:'year'},
	{type:'year',switcher:switchToNextYear,supType:'decade'},
	{type:'decade',switcher:switchToNextDecade,supType:'century'},
	{type:'century',switcher:switchToNextCentury,supType:'millenia'},
	{type:'millenia',switcher:switchToNextMillenia,supType:'millenia'}	
	];

/**  callback function to find the adhoc switcher function and superior type (compound) */
HRange.prototype.findSwitcherFunction = function(thisType){
	return (this.switchFunctions).find(function(functionArray){
		return (functionArray.type === thisType);
	});
};

/** function that computes array of graduation between two dates with a given type */
HRange.prototype.computeSubArray = function(beginDate,endDate,type){
	var compoundSwitcher = this.findSwitcherFunction(type);
	type = compoundSwitcher.type;
	var switcher = compoundSwitcher.switcher;
	var supType = compoundSwitcher.supType;
	var supSwitcher = this.findSwitcherFunction(supType).switcher;
	// dates to begin with
	var currentDate = switcher(beginDate.clone());
	var currentMajorDate = supSwitcher(beginDate.clone());
	var range = [];
	var minorGradMajor = 0; // to allow minor graduations with major -1 (legend undisplayed) if too close to next major graduations
	while(currentDate < endDate || currentMajorDate < endDate){
		if(type === 'week'){if (currentDate.getDate() > 27 || currentDate.getDate() < 4 ) {minorGradMajor = -1;}else{minorGradMajor=0;}}
		if(currentDate < currentMajorDate){
			range.push(new HGrad(this.hts,currentDate.clone(),type,minorGradMajor));
			currentDate = switcher(currentDate,true);
		}
		else if(currentDate > currentMajorDate){
			range.push(new HGrad(this.hts,currentMajorDate.clone(),type,1));
			currentMajorDate = supSwitcher(currentMajorDate,true);
		}
		else{ // equal dates
			range.push(new HGrad(this.hts,currentMajorDate.clone(),type,1));
			currentDate = switcher(currentDate,true);
			currentMajorDate = supSwitcher(currentMajorDate,true);
		}
	}
	return range;
};
/** function handling HRange update according to new begin and end dates */
HRange.prototype.setDates = function(beginDate,endDate){
	var newType = hRangeGetType(beginDate,endDate);
	if(newType === this.type){ // add new elements
		this.setBeginDate(beginDate, this.type);
		this.setEndDate(endDate, this.type);
		this.beginDate = beginDate;
		this.endDate = endDate;
	}
	else{ // drop old graduations and compute new range
		this.grads.forEach(function(grad) {
			grad.remove();
		});

		this.beginDate = beginDate;
		this.endDate = endDate;
		this.type = newType;
		this.grads = this.computeSubArray(this.beginDate,this.endDate, this.type);
	}
};

/** function adding/removing graduations according to a new beginDate */
HRange.prototype.setBeginDate = function(beginDate,type){
	if (this.beginDate.dateEquals(beginDate)) return;
	else if (beginDate < this.beginDate){ // this case we need to add grads at the beginning of grad array
		var subArray = this.computeSubArray(beginDate,this.beginDate,type);
		this.grads = subArray.concat(this.grads);
	}
	else if (beginDate > this.endDate){
		this.grads.forEach(function(grad) {
			grad.remove();
		});
		this.grads = [];
	}
	else if (beginDate > this.beginDate){
		var index =0;
		while(this.grads[index].date < beginDate){
			this.grads[index].remove();
			index++;
		}
		this.grads.splice(0,index);
	}
	this.beginDate = beginDate;
};
/** function adding/removing graduations according to a new endDate */
HRange.prototype.setEndDate = function(endDate,type){
	if (this.endDate.dateEquals(endDate)) return;
	else if (endDate > this.endDate){ // this case we need to add grads at the end of grad array
		var subArray = this.computeSubArray(this.endDate,endDate,type);
		this.grads = this.grads.concat(subArray);
	}
	else if (endDate <= this.beginDate){
		this.grads.forEach(function(grad) {
			grad.remove();
		});
		this.grads = [];
	}
	else if (endDate < this.endDate){
		var index =this.grads.length-1;
		while(index>=0 && this.grads[index].date >= endDate){
			this.grads[index].remove();
			index--;
		}
		this.grads.splice(index+1,this.grads.length-1-index);
	}
	this.endDate = endDate;
};










/**
 * Load one hts to the div of the current page
 */
vex.defaultOptions.className = 'vex-theme-os';

var htsOptions = [hasMainEvent=false];

var d1 = new Date(1800,0,7);
d1.setHours(0,0,0,0);
var d2 = new Date(1880,0,28);
d2.setHours(0,0,0,0);
var hts = new HTimeScroller("#hts-svgcontainer",d1,d2,null, htsOptions);

console.log(hts);

$(function () {
	var prevHeight = $('div#hts-event-container').height();
	var deltaHeight = $("#hts-svgcontainer").attr("height") - prevHeight;
	$('div#hts-event-container').attrchange({
		callback: function (e) {
			var curHeight = $(this).height();            
			if (prevHeight !== curHeight) {
				$("#hts-svgcontainer").attr("height",curHeight + deltaHeight);
				hts.updateSpatialData(false);
				hts.redrawComponent('event-area');
				hts.redrawComponent('event-fcontainer');
				hts.redrawComponent('event-container');
				prevHeight = curHeight;
			}  
		}
	});
});




$("#test").click(function() {
	// var hts = hts;
	  console.log("test");
	  				for(i=0;i<hts.grads.length;i++){
						console.log("index ",i,", major : ",hts.grads[i].major,", date : ",hts.grads[i].date);
					}
	})
	
/**
 * Horizontal Time Scroller manager 
 */
/** graphic constants for time scrollers */
HTimeScroller.prototype.REL_W_MARGIN = 0.11;
HTimeScroller.prototype.REL_H_MARGIN = 0.01;	
HTimeScroller.prototype.ABS_H_MARGIN = 2.5;	
HTimeScroller.prototype.REL_WDATE_MARGIN = 0.01;
HTimeScroller.prototype.ABS_BASE_HEIGHT = 40;
HTimeScroller.prototype.REL_PIN_HEIGHT = 0.24;
HTimeScroller.prototype.ABS_PIN_HEIGHT = 60;
HTimeScroller.prototype.REL_PIN_WIDTH = 0.12;
HTimeScroller.prototype.REL_GRAD_MIN_HEIGHT = 0.3;
HTimeScroller.prototype.REL_GRAD_MAX_HEIGHT = 0.5;
HTimeScroller.prototype.REL_OVER_INTERVAL = 1.5;
HTimeScroller.prototype.REL_CHEVRON_HEIGHT = 0.02;
HTimeScroller.prototype.REL_EVENT_SELECTOR_X = 0.5;
HTimeScroller.prototype.REL_EVENT_SELECTOR_Y = 0.8;
HTimeScroller.prototype.EVENT_SELECTOR_R = 6;
HTimeScroller.prototype.ZOOM_SCALE = [0.000001,1000000];
HTimeScroller.prototype.ZOOM_ACCELERATOR = 0.5;
HTimeScroller.prototype.ABS_EVENT_HEIGHT = 5;

/** make the idGenerator for the HorizontalTimeScroller prototype */
HTimeScroller.prototype.idGenerator = idGenerator();
/** main date formatter for the time scroller */
HTimeScroller.prototype.formatBoundDates = myFormatPatternDate('d/m/Y');

/** constructor for horizontal time scroller 
 * parentId must be existing id of an SVG component */
function HTimeScroller(parentId,beginDate,endDate,eBeginDate,eEndDate,options) {
	this.id=this.idGenerator();
	this.parentId = parentId;
	this.parent = d3.select(this.parentId); 
	this.domComponents = []; // array of DOM components (except parent) with update functions

	this.eventInitialized = false; // to check if event was initialized
	this.eventContainer = null;

	this.updateSpatialData();

	this.options = options;
	this.beginDate = beginDate;
	this.endDate = endDate;

	this.options = options; // options of the hts (hasMainEvent, ...)
	
	// create event manager
	this.eventManager = new HEventManager(this);

	render(this); // render permanent element

	this.dateScale = d3.scaleTime(); // the scale will be used to render elements
	this.setScale(); // updates scale and trigger update of time mobile components
	this.hRange = new HRange(this,this.beginDate.clone(),this.endDate.clone()); // make HRange
	this.setDates(this.beginDate,this.endDate); // update dates


	/** function that creates the DOM components of the HTimeScroller inside the provided globalArea */ 
	function render(hts){
		renderGlobalArea(hts);
		renderBoundDatesContainers(hts);
		renderMobileArea(hts);
		renderEventArea(hts);
		hts.updateSpatialData(); // draw the static (responsive) components

		/** function that creates the first static DOM components of the HTimeScroller*/ 
		function renderGlobalArea(hts){
			// left chevron
			var component = hts.parent.append("path")
			.attr("id","hts-chevron-left")
			.attr("class","hts-svg-chevron")
			.on('click',function() { hts.switchDateArea(-1);});
			var drawer = function(hts,component){
				var x1 = hts.htsWMargin - hts.htsWDateMargin/2;
				var y1 = hts.htsHUpperSpace + 0.35*hts.htsBaseHeight/2;
				var x2 = hts.htsWMargin - hts.htsWDateMargin/2 - 2*hts.htsWDateMargin;
				var y2 = hts.htsHUpperSpace + hts.htsBaseHeight/2;
				var pathPoints = htsChevron(x1,y1,x2,y2);
				component.attr('d',pathPoints);
			};
			hts.domComponents.push({name:'chevron-left',component:component,drawer:drawer});
			// right chevron
			component = hts.parent.append("path")
			.attr("id","hts-chevron-right")
			.attr("class","hts-svg-chevron")
			.on('click',function() { hts.switchDateArea(1);});
			drawer = function(hts,component){
				var x1 = hts.parent.attr("width")-hts.htsWMargin;
				var y1 = hts.htsHUpperSpace + 0.35*hts.htsBaseHeight/2;
				var x2 = hts.parent.attr("width")-hts.htsWMargin + 2*hts.htsWDateMargin;
				var y2 = hts.htsHUpperSpace + hts.htsBaseHeight/2;
				var pathPoints = htsChevron(x1,y1,x2,y2);
				component.attr('d',pathPoints);
			};
			hts.domComponents.push({name:'chevron-right',component:component,drawer:drawer});

			console.log(hts.findComponentByName('chevron-right').attr("id"));
		}

		/** function that creates the bound dates DOM components of the HTimeScroller */ 
		function renderBoundDatesContainers(hts){
			// date input left
			var component = hts.parent.append("foreignObject")
			.attr("id","hts-date-input-container-left");
			var drawer = function(hts,component){
				component
				.attr('x',hts.htsWMargin*0.05)
				.attr("y", hts.htsHUpperSpace + hts.htsBaseHeight/2 - 10)
				.attr("class", "hts-date-input")
				.attr("height",20)
				.attr("width", hts.htsWMargin*0.75);
			};
			hts.domComponents.push({name:'date-input-container-left',component:component,drawer:drawer});

			component = component.append("xhtml:div")
			.append("input")
			.attr('id','hts-date-input-left')
			.attr('class','hts-date-input')
			.attr('placeholder','JJ/MM/AAAA')
			.attr('regex',dateRegex())
			.on('change',function() { hts.setBoundDates(-1);});
			drawer = function(hts,component){};
			component = $("#hts-date-input-left");
			component.val(hts.formatBoundDates(hts.beginDate));
			hts.domComponents.push({name:'date-input-left',component:component,drawer:drawer});

			// date input right
			component = hts.parent.append("foreignObject")
			.attr("id","hts-date-input-container-right");
			drawer = function(hts,component){
				component
				.attr('x',hts.parent.attr("width")-0.8*hts.htsWMargin)
				.attr("y", hts.htsHUpperSpace + hts.htsBaseHeight/2 - 10)
				.attr("text-align",'center')
				.attr("class", "hts-date-input")
				.attr("height",20)
				.attr("width", hts.htsWMargin*0.75);
			};
			hts.domComponents.push({name:'date-input-container-right',component:component,drawer:drawer});

			component = component.append("xhtml:div")
			.append("input")
			.attr('id','hts-date-input-right')
			.attr('class','hts-date-input')
			.attr('placeholder','JJ/MM/AAAA')
			.attr('regex',dateRegex())
			.on('change',function() { hts.setBoundDates(1);});

			drawer = function(hts,component){};
			component = $("#hts-date-input-right");
			component.val(hts.formatBoundDates(hts.endDate));
			hts.domComponents.push({name:'date-input-right',component:component,drawer:drawer});
		}

		/** function that creates the mobile graduations area DOM components of the HTimeScroller */
		function renderMobileArea(hts){
			// append mobile area
			var component = hts.parent.append("svg")
			.attr("x",hts.htsWMargin)
			.attr("y",0)
			.attr("width",hts.htsBaseWidth)
			.attr("height",hts.parentHeight);
			var drawer = function(hts,component){
				component
				.attr("x",hts.htsWMargin)
				.attr("y",0)
				.attr("width",hts.htsBaseWidth)
				.attr("height",hts.parentHeight);
			};
			hts.domComponents.push({name:'mobile-area',component:component,drawer:drawer});

			// main arrow body 
			var subComponent = component
			.append("path")
			.attr("title","time-arrow-body")
			.attr("class","hts-time-arrow")
			.attr("id","hts-time-arrow-body")
			.call(d3.drag()
					.on("start", function(){return hts.dateDragStarted(d3.event,hts);})
					.on("drag",  function(){return hts.dateDragged(d3.event,hts);})
					.on("end", function(){return hts.dateDragEnded(d3.event,hts);})
			)
			.call(d3.zoom()
					.scaleExtent(hts.ZOOM_SCALE)
					.on("start", function(){return hts.dateZoomStarted(d3.event,hts);})
					.on("zoom",  function(){return hts.dateZoomed(d3.event,hts);})
					.on("end", function(){return hts.dateZoomEnded(d3.event,hts);})
			);
			drawer = function(hts,component){
				var x1 = 0;
				var y1 = hts.htsHUpperSpace;
				var x2 = hts.htsBaseWidth-hts.htsPinWidth;
				var y2 = hts.htsHUpperSpace - hts.htsSemiPinHeight;
				var x3 = hts.htsBaseWidth;
				var y3 = hts.htsHUpperSpace + hts.htsBaseHeight/2;
				var pathPoints = htsArrow(x1,y1,x2,y2,x3,y3);		
				component
				.attr('d',pathPoints);
			};
			hts.domComponents.push({name:'main-arrow',component:subComponent,drawer:drawer});
		}

		/** function that creates the event DOM components of the HTimeScroller **/
		function renderEventArea(hts){
			// scrollable div for events
			var component = 
				hts.parent
				.append("foreignObject")
				.attr("id", "hts-event-fcontainer")
				.attr("border","solid")
				.attr("max-width",3000)
				.attr("max-height",6000);
			var drawer = function(hts,component){
				component
				.attr("x", hts.htsWMargin)
				.attr("y", hts.htsHUpperSpace + hts.htsBaseHeight + hts.htsSemiPinHeight + hts.htsHMargin)
				.attr("width",hts.htsBaseWidth + 5)
				.attr("height",hts.parent.attr("height") - 
						(hts.htsHUpperSpace + hts.htsBaseHeight + hts.htsSemiPinHeight + hts.htsHMargin));
			};
			hts.domComponents.push({name:'event-fcontainer',component:component,drawer:drawer});

			component= 
				component
				.append("xhtml:div")
				.attr("class","hts-event-container")
				.attr("id", "hts-event-container");
			drawer = function(hts,component){
				component
				.attr("x", 0)
				.attr("y", 0)
				.attr("width",hts.htsBaseWidth);
				/*.attr("height", hts.parent.attr("height") - 
						(hts.htsHUpperSpace + hts.htsBaseHeight + hts.htsSemiPinHeight + hts.htsHMargin))
				.attr("max-height", hts.parent.attr("height") - 
						(hts.htsHUpperSpace + hts.htsBaseHeight + hts.htsSemiPinHeight + hts.htsHMargin))		
			*/};
			hts.domComponents.push({name:'event-container',component:component,drawer:drawer});

			component= 
				component
				.append("svg")
				.attr("class","hts-event-container")
				.attr("id", "hts-event-area")
				.on("mousedown",function(event) {
					var eventContainer = hts.findComponentByName('event-container');
					var coords = d3.mouse(this);
					hts.beginRelativeX = coords[0];
				})
				.on("click",function() {
					console.log("creation event");
					var coords = d3.mouse(this);
					var eventContainer = hts.findComponentByName('event-container');
					hts.eventManager.createEvent(coords[0],coords[1],hts.beginRelativeX);
				});
			drawer = function(hts,component){
				component
				.attr("x", 0)
				.attr("y", 0)
				.attr("width", hts.htsBaseWidth)
				.attr("height", Math.max(hts.eventManager.maxYArea,hts.parent.attr("height") - 
						(hts.htsHUpperSpace + hts.htsBaseHeight + hts.htsSemiPinHeight + hts.htsHMargin)-15));
			};
			hts.domComponents.push({name:'event-area',component:component,drawer:drawer});



		}
	}
}

/**  callback function to redraw the wanted component */
HTimeScroller.prototype.redrawComponent = function(thisName){
	var compoundComponent =  this.domComponents.find(function(functionArray){
		return (functionArray.name === thisName);
	});
	var component = compoundComponent.component;
	var drawer = compoundComponent.drawer;
	drawer(hts,component);
};

/**  callback function to find the adhoc formatter function */
HTimeScroller.prototype.findComponentByName = function(thisName){
	return (this.domComponents).find(function(functionArray){
		return (functionArray.name === thisName);
	}).component;
};

/** this function computes spatial datas used for rendering,can be used at the beginning of class or in case of redimensionning to be responsive */
HTimeScroller.prototype.updateSpatialData = function(redrawAll=true){
	this.htsWMargin = this.REL_W_MARGIN*this.parent.attr("width");
	this.htsWDateMargin = this.REL_WDATE_MARGIN*this.parent.attr("width");
	this.htsBaseHeight = this.ABS_BASE_HEIGHT;
	this.htsPinHeight = this.ABS_PIN_HEIGHT;
	this.htsPinWidth = this.REL_PIN_WIDTH*this.parent.attr("height");
	this.htsGradMinHeight = this.REL_GRAD_MIN_HEIGHT*this.htsBaseHeight;
	this.htsGradMaxHeight = this.REL_GRAD_MAX_HEIGHT*this.htsBaseHeight;
	this.htsSemiPinHeight = (this.htsPinHeight - this.htsBaseHeight)/2;
	this.htsBaseWidth = this.parent.attr("width") - 2*(this.htsWMargin);
	this.htsHMargin = this.ABS_H_MARGIN ;
	this.htsHUpperSpace = this.htsHMargin + this.htsSemiPinHeight;	
	var hts = this;
	if(redrawAll){
		this.domComponents.forEach(function(compoundComponent){
			var component = compoundComponent.component;
			var drawer = compoundComponent.drawer;
			drawer(hts,component);
		});	
	}
};

//function that updates date scales used by different elements to update their positions when dates/hts dimension are changed 
HTimeScroller.prototype.setScale = function(){
	// the scale will be used to render elements
	this.dateScale
	.domain([this.beginDate,this.endDate])
	.range([0,this.htsBaseWidth]);
	// then update grads and event position
	if (typeof this.hRange !== 'undefined' && this.hRange !== null){
		this.hRange.grads.forEach(function(hGrad){
			hGrad.updateScale();
		});
	}
	this.eventManager.updateRender();
};

//function that updates range, graduations and event positions when begin and/or end date are changed 
HTimeScroller.prototype.setDates = function(beginDate,endDate){
	this.beginDate = beginDate;
	this.endDate = endDate;
	var dayNumber = this.endDate.dayDiff(this.beginDate);
	if(dayNumber <4) throw('unhandled date period for horizontal time scroller : minimum interval is four days.');
	// allow to compute a range slightly larger to precompute graduations before the beginDate / after the endDate 
	this.calcBeginDate = beginDate.clone().addDay( - Math.floor((this.REL_OVER_INTERVAL-1)/2*dayNumber));
	this.calcEndDate = endDate.clone().addDay(Math.floor((this.REL_OVER_INTERVAL-1)/2*dayNumber));
	this.setScale(); // updates scales
	this.hRange.setDates(this.calcBeginDate.clone(),this.calcEndDate.clone()); // update hRange

	this.findComponentByName('date-input-left').val(this.formatBoundDates(this.beginDate));
	this.findComponentByName('date-input-right').val(this.formatBoundDates(this.endDate));
	this.ratio =  (this.endDate.dayDiff(this.beginDate))/(this.htsBaseWidth - 2*this.htsWDateMargin);
};

HTimeScroller.prototype.dateDragStarted =function (event,hts){
	hts.initialDrag = event.x;
	hts.deltaJ = 0;
};
HTimeScroller.prototype.dateDragged = function (event,hts) {
	var dx = event.x - hts.initialDrag;
	var dj = - (hts.deltaJ  + hts.dateScale.invert(event.x).floatDayDiff(hts.dateScale.invert(hts.initialDrag)));
	var intDJ = Math.floor(dj);

	hts.deltaJ  = intDJ -dj;
	hts.initialDrag = event.x;

	if(intDJ !== 0) hts.setDates(hts.beginDate.addDay(intDJ), hts.endDate.addDay(intDJ));

	if(hts.eventInitialized){
		hts.renderEvent();
	}	
};
HTimeScroller.prototype.dateDragEnded = function (event,hts) {} ;

HTimeScroller.prototype.dateZoomStarted =function (event,hts){
	hts.initialZoomX = event.sourceEvent.clientX - hts.htsWMargin ;
	var adjRatio=0;
	if(typeof hts.initialZoomK === 'undefined' ){adjRatio = event.transform.k;}
	else{adjRatio = hts.initialZoomK;}

	hts.initialZoomK = adjRatio;
	hts.initialZoomDate = hts.dateScale.invert(hts.initialZoomX).clone();
	hts.initialZoomDate.addDay(1);

	var nbJBegin = hts.initialZoomDate.dayDiff(hts.beginDate);
	var nbJEnd = hts.endDate.dayDiff(hts.initialZoomDate);
};
HTimeScroller.prototype.dateZoomed = function (event,hts) {
	var nbJBegin = hts.beginDate.dayDiff(hts.initialZoomDate);
	var nbJEnd = hts.endDate.dayDiff(hts.initialZoomDate);
	var adjRatio = 1 + (event.transform.k - 1)*hts.ZOOM_ACCELERATOR;

	// new day count from zoom date
	var newNbJBegin = Math.round(nbJBegin * hts.initialZoomK /adjRatio);
	var newNbJEnd = Math.round(nbJEnd * hts.initialZoomK /adjRatio);

	// we limit to a minimum of 4 days the zoom (if zoom still go in)
	var initialDayDiff = hts.endDate.dayDiff(hts.beginDate);
	if (newNbJEnd - newNbJBegin < 4  && adjRatio> hts.ratio ) return;

	if (adjRatio < hts.ratio && newNbJBegin===nbJBegin && newNbJEnd===nbJEnd) {
		newNbJBegin= newNbJBegin;
		newNbJEnd++;
	}

	hts.setDates(hts.initialZoomDate.clone().addDay(newNbJBegin),
			hts.initialZoomDate.clone().addDay(newNbJEnd));

	hts.initialZoomK = adjRatio;
	hts.ratio = adjRatio;
};

HTimeScroller.prototype.dateZoomEnded = function (event,hts) {
	hts.initialZoomK=1;
	event.transform.k=1;
};

HTimeScroller.prototype.switchDateArea = function(sens){
	var nbJ = this.endDate.dayDiff(this.beginDate);
	if(sens==-1) this.setDates(this.beginDate.addDay(-nbJ), this.endDate.addDay(-nbJ));
	else if (sens==1) this.setDates(this.beginDate.addDay(nbJ), this.endDate.addDay(nbJ));

	if(this.eventInitialized) this.renderEvent();
};

/** flag -1 : modification made from left date input, 1 from right date input */
HTimeScroller.prototype.setBoundDates = function(flag){
	var newBeginDate = myParseDate(this.findComponentByName('date-input-left').val());
	var newEndDate = myParseDate(this.findComponentByName('date-input-right').val());

	if(newBeginDate === null && newEndDate === null){
		this.findComponentByName('date-input-left').val(this.formatBoundDates(beginDate)); 
		this.findComponentByName('date-input-right').val(this.formatBoundDates(endDate)); 
		return;
	}
	else if(newBeginDate === null){
		newBeginDate = newEndDate.clone();
		newBeginDate.addDay(-30);
	}
	else if(newEndDate === null){
		newEndDate = newBeginDate.clone();
		newEndDate.addDay(30);
	}

	if(flag ===1 && newEndDate <= this.beginDate.clone().addDay(4)){
		newBeginDate = newEndDate.clone();
		newBeginDate.addDay(-30);
	}
	else if(flag ===-1 && newBeginDate >= this.endDate.clone().addDay(-4)){
		newEndDate = newBeginDate.clone();
		newEndDate.addDay(30);
	}

	this.setDates(newBeginDate, newEndDate);
	if(this.eventInitialized) this.renderEvent();
};

//TODO : refactor, function to draw events on the event area
HTimeScroller.prototype.renderEvent = function(){

	if(this.eBeginDate == null || this.eEndDate == null){
		var date = this.iDateScale(this.relativeXScale(this.REL_EVENT_SELECTOR_X));
		// console.log(date);
		this.eBeginDate = new HDate(date.clone(),date.clone());
		this.eEndDate = new HDate(date.clone(),date.clone());
	}
	// event area
	this.eventArea
	.attr("title","event-area")
	.attr("stroke","blank")
	.attr("fill","DarkOrange")
	.attr("opacity","1")
	.attr("id","hts-event-area")
	.attr("x",this.dateScale(this.eBeginDate.beginDate))
	.attr("y",this.htsHUpperSpace)
	.attr("width",this.dateScale(this.eEndDate.endDate)-this.dateScale(this.eBeginDate.beginDate))
	.attr("height",this.htsBaseHeight)
	.on("click",function(d){
		console.log(handler.resize);
		if(! handler.resize){
			handler.eventEdition();
		}
	})
	.call(d3.drag()
			.on("start", function(){return handler.dateDragStarted(d3.event,handler);})
			.on("drag",  function(){return handler.dateDragged(d3.event,handler);})
			.on("end", function(){return handler.dateDragEnded(d3.event,handler);})
	)
	.call(d3.zoom()
			.scaleExtent(handler.ZOOM_SCALE)
			.on("start", function(){return handler.dateZoomStarted(d3.event,handler);})
			.on("zoom",  function(){return handler.dateZoomed(d3.event,handler);})
			.on("end", function(){return handler.dateZoomEnded(d3.event,handler);})
	);				

};


