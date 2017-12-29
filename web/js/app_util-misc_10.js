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
};

function arabicToRomanNumber(number){
	number = Number(number);
	var reste = number;
	var characters = ["M","D","C","L","X","V","I"];
	var values = [1000,500,100,50,10,5,1];
	var nos = [0,0,0,0,0,0,0];
	var index=0,index2=0;
	var romanNo ="";

	for(index=0;index<7;index++){
		reste-= (nos[index] = Math.floor(reste/values[index])) *values[index];
		
		if(index== 6 && nos[index]== 4){
			if(nos[index-1]>0){romanNo = romanNo.substr(0,romanNo.length-1) + "IX";}
			else{romanNo +="IV";}
		}
		else if(index== 4 && nos[index]== 4){
			if(nos[index-1]>0){romanNo = romanNo.substr(0,romanNo.length-1) + "XC";}
			else{romanNo +="XL";}
		}
		else if(index== 2 && nos[index]== 4){
			if(nos[index-1]>0){romanNo = romanNo.substr(0,romanNo.length-1) + "CM";}
			else{romanNo +="CD";}
		}
		else{
			for(index2=0;index2<nos[index];index2++){
				romanNo += characters[index];
			}
		}	
	}
	return romanNo;
};

/** util function to capitalize strings */ 
String.prototype.capitalize = function() { 
    return this.charAt(0).toUpperCase() + this.slice(1); 
}

/**
* functions returning an array of field name => index for a symfony serialized form
*/
function getFormMap(formData)
{
	var map = [];
	$(Object.keys(formData)).each(function(key){
		map[formData[key].name] = key;
	});
	return map;
}