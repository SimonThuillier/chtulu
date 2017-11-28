/**
 * helper functions added to javascript date prototype
 */

Date.prototype.correctYear = function(year)
{
	this.setFullYear(year);
	return this;
};

/** return a new date object, clone of the given one */
Date.prototype.clone = function(){return clone(this);};
function clone(date)
{
	var copy = new Date();
	copy.setTime(date.getTime());
	copy.setHours(0,0,0,0);
	return copy;
}
/** add to a date a certain given number of day (accept negative number of day) */
Date.prototype.addDay = function(nbDay){return addDay(this,nbDay);};
function addDay(date,nbDay)
{
	date.setDate(date.getDate() + nbDay);
	return date;
}
/** returns the entire number of days between two dates */
Date.prototype.dayDiff = function(beginDate){return dayDiff(this,beginDate);};	
function dayDiff(endDate,beginDate)
{
	return Math.round((endDate-beginDate)/(1000*60*60*24));
}
/** returns the float number of days between two dates */
Date.prototype.floatDayDiff = function(beginDate) {return floatDayDiff(this,beginDate);};	
function floatDayDiff(endDate,beginDate)
{
	return ((endDate-beginDate)/(1000*60*60*24));
}
/** return true if same day, false otherwise */
Date.prototype.dateEquals= function(date){return dateEquals(this,date);};
function dateEquals(date1,date2)
{
	return (date1.dayDiff(date2) ===0);
}
/** alias to set time of a date to 0 */
Date.prototype.stripHours = function(){return stripHours(this);};	
function stripHours(date) 
{
	date.setHours(0,0,0,0);
	return date;
}
/** return day numerotation in week switched from sunday/0-saturday/6 to monday/0-sunday/6 */
Date.prototype.getFrenchDay = function(){return getFrenchDay(this);};	
function getFrenchDay(date)
{
	return (date.getDay() + 6) % 7;
}
/** return season number of date : 0 winter,1 spring, 2 summer, 3 fall */
Date.prototype.getSeason = function(){return getSeason(this);};
function getSeason(date)
{
	var season = Math.floor(date.getMonth()/3);
	var isChangingMonth = ((date.getMonth()+1)%3) === 0;
	if (isChangingMonth && date.getDate() > 20 )  season++;
	return season%4;
}

/** rewind a date first day of its current season */

Date.prototype.rewindToMonthFirst= function(){return rewindToMonthFirst(this);};	
function rewindToMonthFirst(date)
{
	date.setDate(1);
	return date;
}

Date.prototype.rewindToSeasonFirst= function(){return rewindToSeasonFirst(this);};	
function rewindToSeasonFirst(date)
{
	var month;
	var isChangingYear = date.getMonth() == 11 && date.getDate() > 20;
	if (isChangingYear){
		month = 11;
	}
	else{
		var season = date.getSeason();
		month = season*3 - 1;
	}
	date.setMonth(month);
	date.setDate(21);
	return date;
}

Date.prototype.rewindToYearFirst= function(){return rewindToYearFirst(this);};	
function rewindToYearFirst(date)
{
	date.setDate(1);
	date.setMonth(0);
	return date;
}

Date.prototype.rewindToDecadeFirst= function(){return rewindToDecadeFirst(this);};	
function rewindToDecadeFirst(date)
{
	date.setDate(1);
	date.setMonth(0);
	date.setFullYear(Math.floor(date.getFullYear()/10)*10);
	return date;
}

Date.prototype.rewindToCenturyFirst= function(){return rewindToCenturyFirst(this);};
function rewindToCenturyFirst(date)
{
    date.setDate(1);
    date.setMonth(0);
    date.setFullYear(Math.floor(date.getFullYear()/100)*100);
    return date;
}

Date.prototype.rewindToMilleniaFirst= function(){return rewindToMilleniaFirst(this);};	
function rewindToMilleniaFirst(date)
{
	date.setDate(1);
	date.setMonth(0);
	date.setFullYear(Math.floor(date.getFullYear()/1000)*1000);
	return date;
}


/** advance the date to next day if force is true, else do nothing */
Date.prototype.switchToNextDay = function(force=false,exact=false){return switchToNextDay(this,force,exact);};	
function switchToNextDay(date,force=false,exact=false)
{
	if (force===true) return date.addDay(1);
	return date;
}
/** advance the date to next Monday (default mode) ; if exact mode increment of exactly one week 
 *  if not force and date is already a monday nothing is done, exact to advance exactly of one week */
Date.prototype.switchToNextWeek = function(force=false,exact=false) {return switchToNextWeek(this,force,exact);};	
function switchToNextWeek(date,force=false,exact=false)
{
	if (exact) return date.addDay(7); 
	var originDay = date.getFrenchDay();
	if(force || originDay  !== 0){
		date.addDay(7 - originDay);
	}
	return date;
}
/** advance the date to first day of next month (default) ; if exact mode increment of exactly one month
 * if not force and date is already first day of month nothing is done */
Date.prototype.switchToNextMonth = function(force=false,exact=false) {return switchToNextMonth(this,force,exact);};	
function switchToNextMonth(date,force=false,exact=false)
{
	if (exact) return date.setMonth(date.getMonth()+1);
	if(force || (date.getDate() !==1) ){
		date.setMonth(date.getMonth()+1,1);
	}
	return date;
}
/** advance the date to first day of next season (default) ; if exact mode increment of exactly one season (3 months)
 * if not force and date is already first day of season nothing is done */
Date.prototype.switchToNextSeason = function(force=false,exact=false) {return switchToNextSeason(this,force,exact);};	
function switchToNextSeason(date,force=false,exact=false)
{
	if (exact) return date.setMonth(date.getMonth()+3);
	var isChangingMonth = ((date.getMonth()+1)%3) === 0;
	var newMonth = date.getMonth()-((date.getMonth()+1)%3) + 3;

	date.setDate(21);
	if(force || ! (date.getDate() <22 && isChangingMonth) ){
		date.setMonth(newMonth);
	}
	return date;
}

/** advance the date to first day of next year ; if exact mode increment of exactly one year
 * if not force and date is already first day of year nothing is done */
Date.prototype.switchToNextYear = function(force=false,exact=false) {return switchToNextYear(this,force,exact);};
function switchToNextYear(date,force=false,exact=false)
{
	if (exact) return date.setFullYear(date.getFullYear()+1);
	if(force || (! (date.getMonth() === 0 && date.getDate() === 1)) ){
		date.setFullYear(date.getFullYear()+1,0,1);
	}
	return date;
}
/** advance the date to first day of next decade, if exact mode increment of exactly one decade
 * if not force and date is already first day of decade nothing is done */
Date.prototype.switchToNextDecade = function(force=false,exact=false) {return switchToNextDecade(this,force,exact);};
function switchToNextDecade(date,force=false,exact=false)
{
	if (exact) return date.setFullYear(date.getFullYear()+10);
	var year = date.getFullYear();
	var decade = (Math.floor(year/10))*10;
	if(force || (! ( (year-decade)===0 && date.getMonth() === 0 && date.getDate() ===1)) ){
		date.setFullYear(decade+10,0,1);
	}
	return date;
}
/** advance the date to first day of next century, if exact mode increment of exactly one century
 *  if not force and date is already first day of century nothing is done */
Date.prototype.switchToNextCentury = function(force=false,exact=false) {return switchToNextCentury(this,force,exact);};
function switchToNextCentury(date,force=false,exact=false)
{
	if (exact) return date.setFullYear(date.getFullYear()+100);
	var year = date.getFullYear();
	var century = (Math.floor(year/100))*100;

	if(force ||  (! ( (year-century)===0 && date.getMonth() === 0 && date.getDate() ===1)) ){
		date.setFullYear(century+100,0,1);
	}
	return date;
}
/** advance the date to first day of next millenia, if exact mode increment of exactly one millenia
 *  if not force and date is already first day of millenia nothing is done */
Date.prototype.switchToNextMillenia = function(force=false,exact=false) {return switchToNextMillenia(this,force,exact);};
function switchToNextMillenia(date,force=false,exact=false)
{
	if (exact) return date.setFullYear(date.getFullYear()+1000);
	var year = date.getFullYear();
	var millenia = (Math.floor(year/1000))*1000;

	if(force || (! ( (year-millenia)=== 0 && date.getMonth() === 0 && date.getDate() ===1)) ){
		date.setFullYear(millenia+1000,0,1);
	}
	return date;
}

/**
 * format given date using a simplified personal pattern expression (php inspired) 
 * ## DAYS ##
 * [d] : day month n° with initial zero, [j] : day month n° without initial zero, [l] : textual day, [D] : abridged textual day
 * ## MONTHS ##
 * [m] : month number with initial zero, [n] : month number without initial zero, [F] : textual month, [M] : abridged textual month, 
 * [S] : textual season, [s] : season index (1-4)
 * ## YEARS ##
 * [Y] : complete year, [y] year on two numbers, [z] : last digit of year, [c] century of the year (3 digit or 0 if first Gregorian year), 
 * for negative years the - is displayed if the year is originally on the requested size
 * ## SEPARATORS ##
 * separators can be [/][_][:][a space] or nothing
 */
function myFormatPatternDate(pattern,date,pieces=[])
{
	var regexCharacterAvailable = "([d|j|l|D|m|n|F|M|Y|c|y|z|S|s])";
	var regexSeparatorAvailable = "([/|_|:| ])";
	var regexPattern = ["^",
		regexCharacterAvailable, regexSeparatorAvailable,"{0,1}",
		regexCharacterAvailable, "*",regexSeparatorAvailable,"{0,1}",
		regexCharacterAvailable, "*",regexSeparatorAvailable,"{0,1}",
		regexCharacterAvailable, "*","$"].join('');
	var regexObject = new RegExp(regexPattern);

	var regexArray = regexObject.exec(pattern);
	var formatArray = [null,null,null,null,null,null,null,null]; // contains final format functions
	if (regexArray === null){
		throw ['The given pattern : \"',pattern,'\" isn\'t a valid date pattern.'].join('');
	}
	// determine the required data and max index to loop on for the format function
	var maxIndex=7;
	if (typeof regexArray[maxIndex] ==='undefined') maxIndex=5;
	if (typeof regexArray[maxIndex] ==='undefined') maxIndex=3;
	if (typeof regexArray[maxIndex] ==='undefined') maxIndex=1;

	for(var index = 1;index<=maxIndex;index++){
		// 0 is always the total regex match
		// stuff the separator : undefined is rendered as ""
		if(typeof regexArray[index] === 'undefined') regexArray[index]='';

		if(regexArray[index] === 'd' || regexArray[index] === 'j' ||
				regexArray[index] === 'l' || regexArray[index] === 'D'){
			myFormatDay = function(pattern,date){
				var DAY_NAMES = ['Dimanche','Lundi','Mardi','Mercredi','Jeudi','Vendredi','Samedi'];
				var ABG_DAY_NAMES = ['D','L','M','M','J','V','S'];

				// d : day month with initial zero, j : day month without initial zero, l : textual day, D : abridged textual day
				// * Y : year on 4 number include - for negative years, y year on two numbers, z : last digit of year
				switch (pattern){
				case 'd':
					return function(date){return (date.getDate() < 10)?('0' + date.getDate()):date.getDate();};
				case 'j':
					return function(date){return date.getDate();};
				case 'l':
					return function(date){return DAY_NAMES[date.getDay()];};
				case 'D':
					return function(date){return ABG_DAY_NAMES[date.getDay()];};
				default:
					break;
				}
				return function(date){return '';};
			};
			formatArray[index] = myFormatDay(regexArray[index]);
		}
		else if(regexArray[index] === 'm' || regexArray[index] === 'n' ||
				regexArray[index] === 'F' || regexArray[index] === 'M' || 
				regexArray[index] === 'S' || regexArray[index] === 's'){
			myFormatMonth = function(pattern,date){
				var MONTH_NAMES = ['Janvier','Fevrier','Mars','Avril','Mai','Juin','Juillet','Aout','Septembre','Octobre','Novembre','Decembre'];
				var ABG_MONTH_NAMES = ['Janv.','Fev.','Mars','Avr.','Mai','Juin','Juil.','Aout','Sept.','Oct.','Nov.','Dec.'];
				var SEASON_NAMES = ['Hiver','Printemps','Eté','Automne'];
				// m : month number with initial zero, n : month number without initial zero, F : textual month, M : abridged textual month
				// S : textual season, s : season index (1 winter ; 4 fall)
				switch (pattern){
				case 'm':
					return function(date){return ((date.getMonth()+1) < 10)?('0' + (date.getMonth()+1)):(date.getMonth()+1);};
				case 'n':
					return function(date){return (date.getMonth()+1);};
				case 'F':
					return function(date){return MONTH_NAMES[date.getMonth()];};
				case 'M':
					return function(date){return ABG_MONTH_NAMES[date.getMonth()];}; 
				case 'S':
					return function(date){return SEASON_NAMES[date.getSeason()];}; 
				case 's':
					return function(date){return (date.getSeason() +1 );}; 	
				default:
					break;
				}
				return function(date){return '';};
			};
			formatArray[index] = myFormatMonth(regexArray[index]);
		}
		else if(regexArray[index] === 'Y' || regexArray[index] === 'y' ||
				regexArray[index] === 'z' || regexArray[index] === 'c'){
			myFormatYear = function(pattern,date){
				var regexYear = new RegExp("(-*)(\\d+)");
				// Y : complete year, y year on two numbers, z : last digit of year,c century of the year (3 digit or 0 if first gregorian year), for negative years the - is displayed if the year is originally on the requested size
				switch (pattern){
				case 'Y':
					return function(date){
					return date.getFullYear();};
				case 'c':
					return function(date){
					var arrayDate = regexYear.exec(date.getFullYear());
					if (arrayDate[2].length > 3){
						return arrayDate[2].substring(arrayDate[2].length-3);
					}
					return arrayDate[1] + arrayDate[2];
				};  
				case 'y':
					return function(date){
					var arrayDate = regexYear.exec(date.getFullYear());
					if (arrayDate[2].length > 2){
						return arrayDate[2].substring(arrayDate[2].length-2);
					}
					return arrayDate[1] + arrayDate[2];
				};
				case 'z':
					return function(date){
					var arrayDate = regexYear.exec(date.getFullYear());
					if (arrayDate[2].length > 1){
						return arrayDate[2].substring(arrayDate[2].length-1);
					}
					return arrayDate[1] + arrayDate[2];
				};
				default:
					break;
				}
				return function(date){return '';};
			};
			formatArray[index] = myFormatYear(regexArray[index]);
		}
		else if(regexArray[index] === '' || regexArray[index] === '/' ||
				regexArray[index] === ':' || regexArray[index] === '_' || regexArray[index] === ' ') formatArray[index] = regexArray[index];
	} 

	/**
	 * format given date using a simplified personal pattern expression (php inspired)
	 * d : day month with initial zero, j : day month without initial zero, l : textual day, D : abridged textual day
	 * m : month number with initial zero, n : month number without initial zero, F : textual month, M : abridged textual month, S season
	 * Y : complete year, y year on two numbers, z : last digit of year,c century of the year (3 digit or 0 if first gregorian year), for negative years the - is displayed if the year is originally on the requested size
	 * separators can be /,-,:,a space or nothing
	 */
	function myFormatDate(date,pieces=[]){
		for(var index=1;index<=maxIndex;index++){
			if(typeof formatArray[index] === 'function'){
				pieces[index-1] = formatArray[index](date);
			}
			else{
				pieces[index-1] = formatArray[index];
			}
		}

		return pieces.join('');
	};
	return myFormatDate;
};

/**
 * parse string to date
 * type is one of the following : {precise,month,year,decade,century,millenia}
 * if string could not be parsed to date returns null and fills errors array
 */
function myParseDate(sDate,type,errors=[],pieces=[])
{
	var regexType = {"precise":"(\\d{1,2})\/(\\d{1,2})\/(-?\\d{1,5})$",
			"month": "\/?(\\d{1,2})\/(-?\\d{1,5})$",
			"season": "\/?(\\d{1,2})\/(-?\\d{1,5})$",
			"year": "\/?(-?\\d{1,5})$",
			"decade": "\/?(-?\\d{1,5})$",
			"century": "\/?(-?\\d{1,5})$",
			"millenia": "\/?(-?\\d{1,5})$"};

	var regex = new RegExp(regexType[type]);
	var regexArray = regex.exec(sDate);
	if (regexArray === null){
		var typeLabelArray = {"precise":"precise","month":"mois","season":"saison","year":"année",
				"decade":"decennie","century":"siècle","millenia":"milénaire"};
		var exampleLabelArray = {"precise":"1/8/1985, 01/09/573, 2/06/-582",
				"month":"8/1985,09/573,06/-582",
				"season":"1/1985 (hiver 1985),4/-582 (automne -582)",
				"year":"1985,573,-582",
				"decade":"1980,571,-580",
				"century":"1980,571,-580",
				"millenia":"1980,571,-580"};

		errors.push("La valeur entrée n'est pas convertible en date (" + 
				typeLabelArray[type] + "). Exemples de valeurs autorisées : " +
				exampleLabelArray[type]);
		return null;
	}

	var date = null;
	var day  = 1;
	var season = 1;
	var month = 1;
	var year = 1;
	var maxYear = (new Date()).getFullYear();
	switch(type){
	case "precise": 
		day = parseInt(regexArray[1]);
		month = parseInt(regexArray[2]);
		year = parseInt(regexArray[3]);
		break;
	case "month": 
		month = parseInt(regexArray[1]);
		year = parseInt(regexArray[2]);
		break;
	case "season": 
		season = parseInt(regexArray[1]);
		year = parseInt(regexArray[2]);
		month = (season-1)*3 + 1;
		break;
	case "year": 
		year = parseInt(regexArray[1]);
		break;
	case "decade": 
		year = Math.floor(parseInt(regexArray[1])/10)*10;	
		break;
	case "century": 
		year = Math.floor(parseInt(regexArray[1])/100)*100;
		break;
	case "millenia": 
		year = Math.floor(parseInt(regexArray[1])/1000)*1000;	
		break;

	default: break;
	}

	if(day<1 || day>31){errors.push("Le jour '" + day + "' est invalide");}
	if(season<1 || season>4){errors.push("La saison '" + season + "' est invalide");}
	if(month<1 || month>12){errors.push("Le mois '" + month + "' est invalide");}
	if(year<-10000 || year>maxYear){errors.push("L'année '" + year + "' est invalide : les années autorisées vont de -10000 à " + maxYear);}
	if(errors.length==0){ date = new Date(year,month-1,day).correctYear(year);}	
	return date;
}