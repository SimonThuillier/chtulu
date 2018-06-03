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











