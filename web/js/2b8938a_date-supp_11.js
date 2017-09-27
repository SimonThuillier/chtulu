/**
 * helper functions added to javascript date prototype
 */

/** return a new date object, clone of the given one */
Date.prototype.clone = function(){return clone(this);};
function clone(date){
	var copy = new Date();
	copy.setTime(date.getTime());
	copy.setHours(0,0,0,0);
	return copy;
}
/** add to a date a certain given number of day (accept negative number of day) */
Date.prototype.addDay = function(nbDay){return addDay(this,nbDay);};
function addDay(date,nbDay){
	date.setDate(date.getDate() + nbDay);
	return date;
}
/** returns the entire number of days between two dates */
Date.prototype.dayDiff = function(beginDate) {return dayDiff(this,beginDate);};	
function dayDiff(endDate,beginDate){
	return Math.round((endDate-beginDate)/(1000*60*60*24));
}
/** returns the float number of days between two dates */
Date.prototype.floatDayDiff = function(beginDate) {return floatDayDiff(this,beginDate);};	
function floatDayDiff(endDate,beginDate){
	return ((endDate-beginDate)/(1000*60*60*24));
}
/** return true if same day, false otherwise */
Date.prototype.dateEquals= function(date){return dateEquals(this,date);};
function dateEquals(date1,date2){
	return (date1.dayDiff(date2) ===0);
}
/** alias to set time of a date to 0 */
Date.prototype.stripHours = function() {return stripHours(this);};	
function stripHours(date) {
	date.setHours(0,0,0,0);
	return date;
}
/** return day numerotation in week switched from sunday/0-saturday/6 to monday/0-sunday/6 */
Date.prototype.getFrenchDay = function() {return getFrenchDay(this);};	
function getFrenchDay(date){
	return (date.getDay() + 6) % 7;
}
/** advance the date to next day if force is true, else do nothing */
Date.prototype.switchToNextDay = function(force=false,exact=false) {return switchToNextDay(this,force,exact);};	
function switchToNextDay(date,force=false,exact=false){
	if (force===true) return date.addDay(1);
	return date;
}
/** advance the date to next Monday (default mode) ; if exact mode increment of exactly one week 
 *  if not force and date is already a monday nothing is done, exact to advance exactly of one week */
Date.prototype.switchToNextWeek = function(force=false,exact=false) {return switchToNextWeek(this,force,exact);};	
function switchToNextWeek(date,force=false,exact=false){
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
function switchToNextMonth(date,force=false,exact=false){
	if (exact) return date.setMonth(date.getMonth()+1);
	if(force || (date.getDate() !==1) ){
		date.setMonth(date.getMonth()+1,1);
	}
	return date;
}
/** advance the date to first day of next year ; if exact mode increment of exactly one year
 * if not force and date is already first day of year nothing is done */
Date.prototype.switchToNextYear = function(force=false,exact=false) {return switchToNextYear(this,force,exact);};
function switchToNextYear(date,force=false,exact=false){
	if (exact) return date.setFullYear(date.getFullYear()+1);
	if(force || (! (date.getMonth() ==0 && date.getDate() ===1)) ){
		date.setFullYear(date.getFullYear()+1,0,1);
	}
	return date;
}
/** advance the date to first day of next decade, if exact mode increment of exactly one decade
 * if not force and date is already first day of decade nothing is done */
Date.prototype.switchToNextDecade = function(force=false,exact=false) {return switchToNextDecade(this,force,exact);};
function switchToNextDecade(date,force=false,exact=false){
	if (exact) return date.setFullYear(date.getFullYear()+10);
	var year = date.getFullYear();
	var decade = (Math.floor(year/10))*10;
	if(force || (! ( (year-decade)===0 && date.getMonth() ==0 && date.getDate() ===1)) ){
		date.setFullYear(decade+10,0,1);
	}
	return date;
}
/** advance the date to first day of next century, if exact mode increment of exactly one century
 *  if not force and date is already first day of century nothing is done */
Date.prototype.switchToNextCentury = function(force=false,exact=false) {return switchToNextCentury(this,force,exact);};
function switchToNextCentury(date,force=false,exact=false){
	if (exact) return date.setFullYear(date.getFullYear()+100);
	var year = date.getFullYear();
	var century = (Math.floor(year/100))*100;

	if(force ||  (! ( (year-century)===0 && date.getMonth() ==0 && date.getDate() ===1)) ){
		date.setFullYear(century+100,0,1);
	}
	return date;
}
/** advance the date to first day of next millenia, if exact mode increment of exactly one millenia
 *  if not force and date is already first day of millenia nothing is done */
Date.prototype.switchToNextMillenia = function(force=false,exact=false) {return switchToNextMillenia(this,force,exact);};
function switchToNextMillenia(date,force=false,exact=false){
	if (exact) return date.setFullYear(date.getFullYear()+1000);
	var year = date.getFullYear();
	var millenia = (Math.floor(year/1000))*1000;

	if(force || (! ( (year-millenia)===0 && date.getMonth() ==0 && date.getDate() ===1)) ){
		date.setFullYear(millenia+1000,0,1);
	}
	return date;
}

/**
 * format given date using a simplified personal pattern expression (php inspired) 
 * ## DAYS ##
 * [d] : day month n° with initial zero, [j] : day month n° without initial zero, [l] : textual day, [D] : abridged textual day
 * ## MONTHS ##
 * [m] : month number with initial zero, [n] : month number without initial zero, [F] : textual month, [M] : abridged textual month
 * ## YEARS ##
 * [Y] : complete year, [y] year on two numbers, [z] : last digit of year, [c] century of the year (3 digit or 0 if first Gregorian year), 
 * for negative years the - is displayed if the year is originally on the requested size
 * ## SEPARATORS ##
 * separators can be [/][_][:][a space] or nothing
 */
function myFormatPatternDate(pattern,date){

	var regexCharacterAvailable = "([d|j|l|D|m|n|F|M|Y|c|y|z])";
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
				regexArray[index] === 'F' || regexArray[index] === 'M'){
			myFormatMonth = function(pattern,date){
				var MONTH_NAMES = ['Janvier','Fevrier','Mars','Avril','Mai','Juin','Juillet','Aout','Septembre','Octobre','Novembre','Decembre'];
				var ABG_MONTH_NAMES = ['Janv.','Fev.','Mars','Avr.','Mai','Juin','Juil.','Aout','Sept.','Oct.','Nov.','Dec.'];
				// m : month number with initial zero, n : month number without initial zero, F : textual month, M : abridged textual month
				switch (pattern){
				case 'm':
					return function(date){return ((date.getMonth()+1) < 10)?('0' + (date.getMonth()+1)):(date.getMonth()+1);};
				case 'n':
					return function(date){return (date.getMonth()+1);};
				case 'F':
					return function(date){return MONTH_NAMES[date.getMonth()];};
				case 'M':
					return function(date){return ABG_MONTH_NAMES[date.getMonth()];}; 
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
	 * m : month number with initial zero, n : month number without initial zero, F : textual month, M : abridged textual month
	 * Y : complete year, y year on two numbers, z : last digit of year,c century of the year (3 digit or 0 if first gregorian year), for negative years the - is displayed if the year is originally on the requested size
	 * separators can be /,-,:,a space or nothing
	 */
	function myFormatDate(date){
		var sDate = '';
		for(var index=1;index<=maxIndex;index++){
			if(typeof formatArray[index] === 'function'){
				sDate=sDate + formatArray[index](date);
			}
			else{
				sDate=sDate + formatArray[index];
			}
		}
		return sDate;
	}
	return myFormatDate;
}

//TODO : rewrite and make generic
function myParseDate(sDate){
	var date = null;
	var arrayString = sDate.split("/"); 
	if (arrayString.length != 3) return date;
	var day = parseInt(arrayString[0]);
	var month = parseInt(arrayString[1]);
	var year = parseInt(arrayString[2]);

	if(isNaN(day) || isNaN(month) || isNaN(year)){return date;}
	if ((day<1 || day>31) || (month<1 || month>12)){return date;}
	return new Date(year,month-1,day);
}



