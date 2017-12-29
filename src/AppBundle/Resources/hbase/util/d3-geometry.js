/**
 * this file contains usefull function to draw some simple geometrical forms with D3
 */

/** return D3 points for htsChevron
 * take in argument the upper point and the peak point*/
function htsChevron(x1,y1,x2,y2){
	return ['M',x1,y1,
		'L',x2,y2,
		'L',x1,(y1 + 2*(y2-y1)),
		'L',x1+((x2-x1)/2),y2,
		'Z'].join(' ');
}

/** return D3 points for htsTriangle (isocel)
 * take in argument the upper point and the peak point*/
function htsTriangle(x1,y1,x2,y2){
	return ['M',x1,y1,
		'L',x2,y2,
		'L',x1,(y1 + 2*(y2-y1)),
		'Z'].join(' ');
}

/** return D3 points for htsDiamond
 * take in argument the upper point and lower point coordinates and the ratio horizontal vs vertical */
function htsDiamond(x1,y1,x2,y2,ratio){
	var horizontalArrow = ratio*Math.sqrt(Math.pow(x1-x2,2)+Math.pow(y1-y2,2));
	var angle = Math.atan((x1-x2)/(y2-y1));

	var xc = x1 + (x2-x1)/2;
	var yc = y1 + (y2-y1)/2;

	var x3 = xc + 0.5*horizontalArrow * Math.cos(angle);
	var y3 = yc + 0.5*horizontalArrow * Math.sin(angle);
	var x4 = xc - 0.5*horizontalArrow * Math.cos(angle);
	var y4 = yc - 0.5*horizontalArrow * Math.sin(angle);

	return ['M',x1,y1,
		'L',x3,y3,
		'L',x2,y2,
		'L',x4,y4,
		'Z'].join(' ');
}

/** return D3 points for htsArrowPeak
 * take in argument the left upper point,the left upper peak point and the peak right point */
function htsArrow(x1,y1,x2,y2,x3,y3){
	return ['M',x1,y1,
		'L',x2,y1,
		'L',x2,y2,
		'L',x3,y3,
		'L',x2,y2+2*(y3-y2),
		'L',x2,y1+2*(y3-y1),
		'L',x1,y1+2*(y3-y1),
		'Z'].join(' ');
}