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