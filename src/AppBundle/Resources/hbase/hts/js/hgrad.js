/**
 * graduation class
 */

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