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










