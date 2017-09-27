/**
 * this file contains some useful general purpose functions
 */

/** function to be used as id generator (pseudo static variable) */
function idGenerator() {
	var id = -1;
	return function() {
		id++;
		return id;
	};
};
function dateRegex(){
	return "^(0?[1-9]|[1-2][1-9]|3[0-1])/(0?[1-9]|1[0-2])/(-?[1-9][0-9]*)$";
}

/** util function to capitalize strings */
String.prototype.capitalize = function() {
    return this.charAt(0).toUpperCase() + this.slice(1);
}