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