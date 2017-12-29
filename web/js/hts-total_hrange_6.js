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









