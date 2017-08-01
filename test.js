/**
 * 
 */
Date.prototype.clone = function(){
	copy = new Date();
    copy.setTime(this.getTime());
	copy.setHours(0,0,0,0);
    return copy;
}