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
			.attr('class','hts-date-input hts-border-date-input')
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
			.attr('class','hts-date-input hts-border-date-input')
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


