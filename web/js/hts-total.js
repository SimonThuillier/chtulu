/*
A simple jQuery function that can add listeners on attribute change.
http://meetselva.github.io/attrchange/

About License:
Copyright (C) 2013 Selvakumar Arumugam
You may use attrchange plugin under the terms of the MIT Licese.
https://github.com/meetselva/attrchange/blob/master/MIT-License.txt
*/
(function($) {
function isDOMAttrModifiedSupported() {
	var p = document.createElement('p');
	var flag = false;

	if (p.addEventListener) p.addEventListener('DOMAttrModified', function() {
		flag = true;
	}, false);
	else if (p.attachEvent) p.attachEvent('onDOMAttrModified', function() {
		flag = true;
	});
	else return false;

	p.setAttribute('id', 'target');

	return flag;
}

function checkAttributes(chkAttr, e) {
	if (chkAttr) {
		var attributes = this.data('attr-old-value');

		if (e.attributeName.indexOf('style') >= 0) {
			if (!attributes['style']) attributes['style'] = {}; //initialize
			var keys = e.attributeName.split('.');
			e.attributeName = keys[0];
			e.oldValue = attributes['style'][keys[1]]; //old value
			e.newValue = keys[1] + ':' + this.prop("style")[$.camelCase(keys[1])]; //new value
			attributes['style'][keys[1]] = e.newValue;
		} else {
			e.oldValue = attributes[e.attributeName];
			e.newValue = this.attr(e.attributeName);
			attributes[e.attributeName] = e.newValue; 
		}

		this.data('attr-old-value', attributes); //update the old value object
	}	   
}

//initialize Mutation Observer
var MutationObserver = window.MutationObserver || window.WebKitMutationObserver;

$.fn.attrchange = function(o) {

	var cfg = {
			trackValues: false,
			callback: $.noop
	};

	//for backward compatibility
	if (typeof o === "function" ) { 
		cfg.callback = o; 
	} else { 
		$.extend(cfg, o); 
	}

	if (cfg.trackValues) { //get attributes old value
		$(this).each(function (i, el) {
			var attributes = {};
			for (var attr, i=0, attrs=el.attributes, l=attrs.length; i<l; i++){
				attr = attrs.item(i);
				attributes[attr.nodeName] = attr.value;
			}

			$(this).data('attr-old-value', attributes);
		});
	}

	if (MutationObserver) { //Modern Browsers supporting MutationObserver
		/*
				   Mutation Observer is still new and not supported by all browsers. 
				   http://lists.w3.org/Archives/Public/public-webapps/2011JulSep/1622.html
		 */
		var mOptions = {
				subtree: false,
				attributes: true,
				attributeOldValue: cfg.trackValues
		};

		var observer = new MutationObserver(function(mutations) {
			mutations.forEach(function(e) {
				var _this = e.target;

				//get new value if trackValues is true
				if (cfg.trackValues) {
					/**
					 * @KNOWN_ISSUE: The new value is buggy for STYLE attribute as we don't have 
					 * any additional information on which style is getting updated. 
					 * */
					e.newValue = $(_this).attr(e.attributeName);
				}

				cfg.callback.call(_this, e);
			});
		});

		return this.each(function() {
			observer.observe(this, mOptions);
		});
	} else if (isDOMAttrModifiedSupported()) { //Opera
		//Good old Mutation Events but the performance is no good
		//http://hacks.mozilla.org/2012/05/dom-mutationobserver-reacting-to-dom-changes-without-killing-browser-performance/
		return this.on('DOMAttrModified', function(event) {
			if (event.originalEvent) event = event.originalEvent; //jQuery normalization is not required for us 
			event.attributeName = event.attrName; //property names to be consistent with MutationObserver
			event.oldValue = event.prevValue; //property names to be consistent with MutationObserver 
			cfg.callback.call(this, event);
		});
	} else if ('onpropertychange' in document.body) { //works only in IE		
		return this.on('propertychange', function(e) {
			e.attributeName = window.event.propertyName;
			//to set the attr old value
			checkAttributes.call($(this), cfg.trackValues , e);
			cfg.callback.call(this, e);
		});
	}

	return this;
};
})(jQuery);	

//prototype historical date class ( handle imprecise dates)
function HDate(type,date,endDate = null)
{
	if (this.types.indexOf(type) === -1) return null;
	this._beginDate = date; 
	this._endDate = endDate;
	this.setType(type);
	return this;
};

HDate.prototype.clone = function()
{
	return new HDate(this._type,this._beginDate.clone(),this._endDate.clone());
};

HDate.prototype.parse = function(jsonStr)
{
	var jsonObj = JSON.parse(jsonStr);
	jsonObj._beginDate = new Date(Date.parse(jsonObj._beginDate));
	jsonObj._endDate = new Date(Date.parse(jsonObj._endDate));
	return new HDate(jsonObj._type,jsonObj._beginDate,jsonObj._endDate);
};


HDate.prototype.types = ["precise","bounded","month","season","year","decade","century","millenia"];
//functions of formatting
HDate.prototype.formatters = {
		"precise":myFormatPatternDate('j F Y'),
		"bounded":myFormatPatternDate('j F Y'),
		"month":myFormatPatternDate('F Y'),
		"season":myFormatPatternDate('S Y'),
		"year":myFormatPatternDate('Y'),
		"decade":myFormatPatternDate('Y'),
		"century":myFormatPatternDate('Y'),
		"millenia":myFormatPatternDate('Y')
};
HDate.prototype.canonicalInputFormatters = {
		"precise":myFormatPatternDate('d/m/Y'),
		"bounded":myFormatPatternDate('d/m/Y'),
		"month":myFormatPatternDate('m/Y'),
		"season":myFormatPatternDate('s/Y'),
		"year":myFormatPatternDate('Y'),
		"decade":myFormatPatternDate('Y'),
		"century":myFormatPatternDate('Y'),
		"millenia":myFormatPatternDate('Y')
};
HDate.prototype._intervalFormatter = myFormatPatternDate('d/m/Y');

HDate.prototype.intervalSize = function()
{
	return this._endDate.dayDiff(this._beginDate);
};
HDate.prototype.isExact = function()
{
	return (this._endDate.dayDiff(this._beginDate) === 0);
};
HDate.prototype.equals = function(hDate)
{
	if (this._type == hDate._type && this._beginDate == hDate._beginDate && this._endDate == hDate._endDate) return true;
	return false;
};
//0 is the min Date, 1 is the max Date
HDate.prototype.getBoundDate = function(bound)
{
	if (bound === 0){
		return this._beginDate;
	}
	else if(bound == 1){
		return this._endDate;
	}
	else{
		return null;
	}
};

//returns user display of the HDate
HDate.prototype.getLabel= function()
{
	var formatter = this.formatters[this._type];
	var pieces=[];
	var label = formatter(this._beginDate,pieces);
	var BC;

	// specific code for rendering
	if(this._type == "bounded") {
		var endPieces=[];
		formatter(this._endDate,endPieces);
		var totalLabel="";
		var index = 4;
		for (index=4;index>-1;index--){
			if(pieces[index] == endPieces[index]){
				totalLabel = pieces[index] + totalLabel;
			}
			else{index++;break;}
		}
		var preBeginLabel = "",preEndLabel = "";
		for(var index2=0;index2<index;index2++){
			preBeginLabel+= pieces[index2];
			preEndLabel+= endPieces[index2];
		}
		if(preBeginLabel !== ""){totalLabel = preBeginLabel + "~" + preEndLabel + totalLabel;}
		label = totalLabel;
	}
	else if(this._type == "precise" && pieces[0] == "1") {
		pieces[0] = "1er";
		label = pieces.join('');
	}
	else if(this._type == "season" && (pieces[0]).toUpperCase() == "HIVER"){
		pieces[pieces.length-1] = pieces[pieces.length-1] + 
		((Number(pieces[pieces.length-1])>=-1)?"-":"")  + 
		(Number(pieces[pieces.length-1]) + 1);
		label = pieces.join('');
	}
	else if(this._type == "decade"){
		label = "Années " + label;
	}
	else if(this._type == "century"){
		var century = Math.floor(Number(label)/100);
		BC = century < 0;
		var absoluteCentury = BC?Math.abs(century):(century + 1);

		label = arabicToRomanNumber(absoluteCentury) +
		((absoluteCentury == 1)?"er":"e") +
		" siècle" +
		(BC?" Av. JC":"");
	}
	else if(this._type == "millenia"){
		var millenia = Math.floor(Number(label)/1000);
		BC = millenia < 0;
		var absoluteMillenia = BC?Math.abs(millenia):(millenia + 1);

		label = arabicToRomanNumber(absoluteMillenia) +
		((absoluteMillenia == 1)?"er":"e") +
		" millénaire" +
		(BC?" Av. JC":"");
	}
	return label;
};

//returns user display of the HDate interval for control
HDate.prototype.getInterval= function()
{
	var formatter = this._intervalFormatter;
	return "[" + formatter(this._beginDate) + " ; " + formatter(this._endDate) + "]";
};

//return the canonical input for the HDate
HDate.prototype.getCanonicalInput = function()
{
	var formatter = this.canonicalInputFormatters[this._type];

	if(this._type == "bounded"){
		return (formatter(this._beginDate) + ";" + formatter(this._endDate));
	}
	else if(this._type == "seasoen"){
		return formatter(this._beginDate.clone().switchToNextMonth(true));
	}
	else{
		return formatter(this._beginDate);
	}
};

//convert the object to the wanted type, adjusting its begin and endDate
HDate.prototype.setType = function(type)
{
	switch(type){
	case "precise":
		this._endDate = this._beginDate.clone();
		break;
	case "bounded":
		this._endDate = (this._endDate !== null)?this._endDate:this._beginDate.clone();
		if(this._endDate.dayDiff(this._beginDate) === 0) this._endDate.addDay(1);
		break;	
	case "month":
		this._beginDate.rewindToMonthFirst(); 
		this._endDate = this._beginDate.clone().switchToNextMonth(true).addDay(-1);
		break;	
	case "season":
		this._beginDate = this._beginDate.rewindToSeasonFirst(); 
		this._endDate = this._beginDate.clone().switchToNextSeason(true).addDay(-1);
		break;		
	case "year":
		this._beginDate.rewindToYearFirst(); 
		this._endDate = this._beginDate.clone().switchToNextYear(true).addDay(-1);
		break;
	case "decade":
		this._beginDate.rewindToDecadeFirst(); 
		this._endDate = this._beginDate.clone().switchToNextDecade(true).addDay(-1);
		break;	
	case "century":
		this._beginDate.rewindToCenturyFirst(); 
		this._endDate = this._beginDate.clone().switchToNextCentury(true).addDay(-1);
		break;	
	case "millenia":
		this._beginDate.rewindToMilleniaFirst(); 
		this._endDate = this._beginDate.clone().switchToNextMillenia(true).addDay(-1);
		break;			
	default:break;
	}
	this._type = type;
};











function HEventFactory(hts,parentId=null){
	this.hts = hts;
	this.parentId = parentId;
}

/**
*/
HEventFactory.prototype.newInstance = function(dto){
	var event = new HEvent(this.hts,'attached',null,dto.y,dto.title);
	this.setData(event,dto);
	return event;
}	

HEventFactory.prototype.setData = function(event,dto){
	event.hts = this.hts;
	event.url = dto.url;
	event.internId = dto.id;
	event.articleParentId = dto.parentId;
	event.linkId = dto.linkId;
	event.hts = hts;
	event.y = dto.y;

	event.name=dto.title;
	event.abstract=dto.abstract;
	
	if(dto.beginDate != null){
		dto.minBeginDate = dto.beginDate;
		dto.maxBeginDate = dto.beginDate;
	}
	if(dto.endDate != null){
		dto.minEndDate = dto.endDate;
		dto.maxEndDate = dto.endDate;
	}
	dto.minBeginDate = new Date(dto.minBeginDate.timestamp*1000);
	dto.maxBeginDate = new Date(dto.maxBeginDate.timestamp*1000);
	
	dto.minEndDate = new Date(dto.minEndDate.timestamp*1000);
	dto.maxEndDate = new Date(dto.maxEndDate.timestamp*1000);

	event.beginDate=new HDate(dto.minBeginDate,dto.maxBeginDate); // HDate
	event.hasNotEndDate=dto.hasNotEndDate;
	if(! event.hasNotEndDate) event.endDate=new HDate(dto.minEndDate,dto.maxEndDate);
	event.articleType = dto.type;
	event.articleSubType = dto.subType;
	event.toUpdate = true;
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
	this.eventFactory = new HEventFactory(hts,null);
	this.parentId = hts.articleParentId;
}

/**
 * 
 */
HEventManager.prototype.createEvent = function(x,y,beginX=null){

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
	event.articleParentId = this.parentId;
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
	//console.log(this.events);

	var index = 0;
	var events = this.events;
	var eventsLength = events.length;
	var deltaYMin = 30;
	var overY = 5;
	this.events.forEach(function(event){
		if(index >= events.length-1) return;

		events[index+1].adjustedY = events[index+1].y;
		//console.log(events[index+1].adjustedY - event.adjustedY,(events[index+1].adjustedY - event.adjustedY) < deltaYMin);
		//console.log(event.displayIntersect(events[index+1]));

		if ((events[index+1].adjustedY - event.adjustedY) < deltaYMin && event.displayIntersect(events[index+1])){
			events[index+1].adjustedY += deltaYMin - (events[index+1].adjustedY - event.adjustedY) + overY;
		}
		index++;
	});


	this.events.forEach(function(hEvent){
		hEvent.updateRender();
	});
}

/** this function check all modal sub events and serialize them to the requested form to submit them */
HEventManager.prototype.prepareSubmission = function(formId,formMainId){
	var eventCollection = {'subEventsCount' : 0, 'subEventsArray' : []};
	this.events.forEach(function(event){
		if(event.toUpdate){
			eventCollection.subEventsCount++;
			eventCollection.subEventsArray.push(event.normalize());
		}
	});
	$("#" + formMainId + "_subEvents").val(JSON.stringify(eventCollection));
}

/** this function load events in subEvents field */
HEventManager.prototype.loadSubEvents = function(formMainId){
	console.log($("#" + formMainId + "_subEvents").val());
	this.loadSubEventsFromData($("#" + formMainId + "_subEvents").val());
}

/** this function load events in subEvents field */
HEventManager.prototype.loadSubEventsFromData = function(data){
	var array = JSON.parse(data);
	var event = null;
	var manager = this;
	
	array.subEventsArray.forEach(function(eventDTO){
		console.log(eventDTO);
		event = manager.eventFactory.newInstance(eventDTO);
		console.log(event);
		if (! event.rendered) event.render();
		event.text.html(event.getLabelHtml());
		event.updateRender();
		manager.addEvent(event);
	});
	
	manager.updateRender();
}
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
function HTimeScroller(elementId,beginDate,endDate,eBeginDate,eEndDate,articleParentId,options) {
	this.id=this.idGenerator();
	this.articleParentId = articleParentId;
	this.div = d3.select(elementId); 
	this.parent = this.div.append("svg")
	.attr("id","hts-" + this.id + "-svgcontainer")
	.attr("width",1150)
	.attr("height",150);
	
	this.scope = [null,null]; // contains begin and end Date of scope
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
			.attr('class','hts-date-input hts-border-date-input hbase-hdatepicker')
			.attr('hdatepicker-ender','hts-date-input-right')
			.attr('placeholder','JJ/MM/AAAA')
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
			.attr('class','hts-date-input hts-border-date-input hbase-hdatepicker')
			.attr('placeholder','JJ/MM/AAAA')
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
					.on("start", function(){return hts.dateZoomStarted(d3.event,hts,d3.mouse(this));})
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
			
			// scope rectangle : appears when date are selected ( function setScope)
			subComponent = component
			.append("rect")
			.attr("title","time-arrow-scope")
			.attr("class","hts-time-arrow-scope")
			.attr("id","hts-time-arrow-scope");
			
			drawer = function(hts,component){
				var x = -10;
				var y = - 10;
				var width = 0;
				var height = 0;
				if(hts.scope[0] !== null & hts.scope[1] !== null){
					y = hts.htsHUpperSpace;
					height = hts.htsBaseHeight;
					x = hts.dateScale(hts.scope[0]);
					width = hts.dateScale(hts.scope[1]) - x;
				}
				component.attr("x",x).attr("width",width).attr("y",y).attr("height",height);	
			};
			hts.domComponents.push({name:'scope-rectangle',component:subComponent,drawer:drawer});
			
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
}

/**  callback function to redraw the wanted component */
HTimeScroller.prototype.redrawComponent = function(thisName){
	var compoundComponent =  this.domComponents.find(function(functionArray){
		return (functionArray.name === thisName);
	});
	var component = compoundComponent.component;
	var drawer = compoundComponent.drawer;
	drawer(this,component);
};

/**  callback function to find the adhoc formatter function */
HTimeScroller.prototype.findComponentByName = function(thisName){
	return (this.domComponents).find(function(functionArray){
		return (functionArray.name === thisName);
	}).component;
};

/** this function computes spatial datas used for rendering,can be used at the beginning of class
 *  or in case of redimensionning to be responsive */
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

/** function that updates date scales used by different elements to update their positions when dates/hts dimension are changed */
HTimeScroller.prototype.setScale = function(){
	// the scale will be used to render elements
	this.dateScale
	.domain([this.beginDate,this.endDate])
	.range([0,this.htsBaseWidth]);
	// then update grads and event position and redraw
	if (typeof this.hRange !== 'undefined' && this.hRange !== null){
		this.hRange.grads.forEach(function(hGrad){
			hGrad.updateScale();
		});
	}
	// redraw scope area
	this.redrawComponent('scope-rectangle');
	// redraw events
	this.eventManager.updateRender();
};

/**  function that updates active scope and display it */
HTimeScroller.prototype.setScope = function(beginDate,endDate){
	this.scope[0] = beginDate;
	this.scope[1] = endDate;
	// redraw scope area
	this.redrawComponent('scope-rectangle');
}

/**  function that updates range, graduations and event positions when begin and/or end date are changed */
HTimeScroller.prototype.setDates = function(beginDate,endDate){
	this.beginDate = beginDate;
	this.endDate = endDate;
	var dayNumber = this.endDate.dayDiff(this.beginDate);
	if(dayNumber <3) {this.endDate = this.beginDate.clone().addDay(3);};
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

HTimeScroller.prototype.dateZoomStarted =function (event,hts,mousePos){
	console.log(mousePos);
	hts.initialZoomX = mousePos[0];
	var adjRatio=0;
	if(typeof hts.initialZoomK === 'undefined' ){adjRatio = event.transform.k;}
	else{adjRatio = hts.initialZoomK;}

	hts.initialZoomK = adjRatio;
	hts.initialZoomDate = hts.dateScale.invert(hts.initialZoomX).clone();
	console.log(' - ',hts.initialZoomX," - ",hts.htsWMargin," - ",hts.parent.x," - ",hts.dateScale.invert(hts.initialZoomX).clone());
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

//TODO : DEPRECATED with scope system to delete later
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


