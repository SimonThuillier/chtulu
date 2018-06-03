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
	if(major === 1) {this.gradHeight=hts.htsGradMaxHeight;}
	else if (major === 0 ) {this.gradHeight=hts.htsGradMinHeight;}
	else if (major === -1 ) {this.gradHeight=hts.htsGradMinHeight;}

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