var dataset = [ 0, 0, 0, 0, 0, 0, 0,0];
// retrieve data from form if it exists
try {
    for(i=0;i<8;i++){
    	dataset[i] = document.getElementById('entitybundle_evolution_domain_' + i).value;
    }
}
catch(err) {
    
}



var nbDomains = dataset.length; 
var layoutDataset = [ "Geologie", "Biologie", "Société", "Economie", "Politique", "Guerre", "Culture","Technique"];
var finalDragRoseV = 0;
var margin = 40;


var svg = d3.select("svg.rose"),
    width = +svg.attr("width"),
    height = +svg.attr("height"),
    rCursorPoint = width/80,
	rFontSize = width/33,
    outerRadius = Math.min(width, height) * 0.5 - margin,
    innerRadius = outerRadius - 30;
	
		// Append a defs (for definition) element to your SVG
	var defs = svg.append("defs");
	
	// functions giving coordinates on the circle according to domain index and
	// radius
function xCircle(i,r){
	return (width/2) + r * Math.cos((i/nbDomains)*2*Math.PI);
}	
function yCircle(i,r){
	return (height/2) - r * Math.sin((i/nbDomains)*2*Math.PI);
}
	// function giving radial absciss of pin points according to the value
	function pinValue2radialAbs(v){
		return 0.06 + 0.94*(v/100);
	}
	// function giving value according to radial absciss of pin points
	function radialAbs2pinValue(r){
		return (r - 0.05)/0.95 *100;
	}
	// function giving y in function of x
	function x2y(x,i){
		return (height/2) - (x-width/2)*Math.tan(i*2*Math.PI/nbDomains);
	}
	// function giving x in function of y
	function y2x(y,i){
		return (width/2) + (height/2-y)/Math.tan(i*2*Math.PI/nbDomains);
	}
	// function returning the [x,y] to choose from the [x,y] of the mouse and
	// index
	// when called this function also updates polylines coordinates
	function finalPin(x,y,i){
	// first bound the x and y to their min/max values
		x = Math.min(Math.max(x,dragMinXBound),dragMaxXBound);
		y = Math.min(Math.max(y,dragMinYBound),dragMaxYBound);
		var r;
		var v;
		// treatment of simple cases
		if (Math.abs(Math.tan(i*2*Math.PI/nbDomains))<0.01){
			r = (Math.abs(x - width/2))/innerRadius;
			v = radialAbs2pinValue(r);
			polyPoints[i] = makePolyPoints(v,i);
			finalDragRoseV = v;
			return [x,height/2,v];
		}
		else if(Math.abs(Math.tan(i*2*Math.PI/nbDomains))>100){
			r = (Math.abs(height/2 - y))/innerRadius;
			v = radialAbs2pinValue(r);
			polyPoints[i] = makePolyPoints(v,i);
			finalDragRoseV = v;
			return [width/2,y,v];
		}
		
		// treatment of complicated cases
		// get their coordinates relative to circle center
		var rx;
		var ry;
		r = (Math.sqrt(Math.pow(rx,2)+Math.pow(ry,2)))/innerRadius;
		v = radialAbs2pinValue(r);
		polyPoints[i] = makePolyPoints(v,i);
		var res = [0,0];
		if (Math.abs((height/2 - y)/(x - width/2))>=1){
			x = y2x(y,i);
			var rx = x - width/2;
			var ry = height/2 - y;
			r = (Math.sqrt(Math.pow(rx,2)+Math.pow(ry,2)))/innerRadius;
			v = radialAbs2pinValue(r);
			polyPoints[i] = makePolyPoints(v,i);
			finalDragRoseV = v;
			return [x,y,v];
		}
		else{
			y = x2y(x,i);
			var rx = x - width/2;
			var ry = height/2 - y;
			r = (Math.sqrt(Math.pow(rx,2)+Math.pow(ry,2)))/innerRadius;
			v = radialAbs2pinValue(r);
			polyPoints[i] = makePolyPoints(v,i);
			finalDragRoseV = v;
			return [x,y,v];
		}
	}
	// initializing the polylines points
	function makePolyPoints(d,i){
	var test = 0.5+i;
	console.log(test);
	return [[xCircle(i,0),yCircle(i,0)], // base
		[xCircle(i-0.5,pinValue2radialAbs(d/2)*innerRadius),yCircle(i-0.5,pinValue2radialAbs(d/2)*innerRadius)], // intermediate
																													// 1
		[xCircle(i,pinValue2radialAbs(d)*innerRadius),yCircle(i,pinValue2radialAbs(d)*innerRadius)], // max
		[xCircle(i*1+0.5,pinValue2radialAbs(d/2)*innerRadius),yCircle(i*1+0.5,pinValue2radialAbs(d/2)*innerRadius)] // intermediate
																													// 2
		// [xCircle(i,0),yCircle(i,0)] // base to close
		]
}
	function getPolyPoints(d,i){
	var pts = polyPoints[i];
	var res = pts[0][0] + "," + pts[0][1] + "\n"
	+ pts[1][0] + "," + pts[1][1]+ "\n"
	+ pts[2][0] + "," + pts[2][1]+ "\n"
	+ pts[3][0] + "," + pts[3][1] + "\n";
	// + pts[4][0] + "," + pts[4][1] + "\n";
	return res;
}
	var polyPoints = [];
	for(i=0;i<nbDomains;i++){
		polyPoints.push(makePolyPoints(dataset[i],i));
	}	
	
// function returning the color for each domain
function domainColor(i){
	if(i==0){return "SlateGray";}
	else if(i==1){return "ForestGreen";}
	else if(i==2){return "Peru";}
	else if(i==3){return "Orange";}
	else if(i==4){return "Purple";}
	else if(i==5){return "Red";}
	else if(i==6){return "DarkTurquoise";}
	else if(i==7){return "SaddleBrown";}
	else {return "Black";}
}
// function returning the gradient percentage for x1 in each domain
function gradientOrientationX1(i){
	if(i==0){return "0%";}
	else if(i==1){return "0%";}
	else if(i==2){return "0%";}
	else if(i==3){return "100%";}
	else if(i==4){return "100%";}
	else if(i==5){return "100%";}
	else if(i==6){return "0%";}
	else if(i==7){return "0%";}
	else {return "Black";}
}
// function returning the gradient percentage for y1 in each domain
function gradientOrientationY1(i){
	if(i==0){return "0%";}
	else if(i==1){return "100%";}
	else if(i==2){return "100%";}
	else if(i==3){return "100%";}
	else if(i==4){return "0%";}
	else if(i==5){return "0%";}
	else if(i==6){return "0%";}
	else if(i==7){return "0%";}
	else {return "Black";}
}
// function returning the gradient percentage for x2 in each domain
function gradientOrientationX2(i){
	if(i==0){return "100%";}
	else if(i==1){return "100%";}
	else if(i==2){return "0%";}
	else if(i==3){return "0%";}
	else if(i==4){return "0%";}
	else if(i==5){return "0%";}
	else if(i==6){return "0%";}
	else if(i==7){return "100%";}
	else {return "Black";}
}
// function returning the gradient percentage for y2 in each domain
function gradientOrientationY2(i){
	if(i==0){return "0%";}
	else if(i==1){return "0%";}
	else if(i==2){return "0%";}
	else if(i==3){return "0%";}
	else if(i==4){return "0%";}
	else if(i==5){return "100%";}
	else if(i==6){return "100%";}
	else if(i==7){return "100%";}
	else {return "Black";}
}

// function giving base percentage of gradient according to the value
	function gradientBasePercentage(v){
		return (Math.floor(60 - 0.6*v)) + "%";
	}

	// adding linear gradients
// Append a linearGradient element to the defs and give it a unique id
    defs.selectAll("gradient")
	.data(layoutDataset)
	.enter()
	.append("linearGradient")
    .attr("id", function(d,i){
		return "gradient_crystal_"+ i;
	})
    .attr("x1", function(d,i){
		return gradientOrientationX1(i);
	})
    .attr("y1", function(d,i){
		return gradientOrientationY1(i);
	})
    .attr("x2", function(d,i){
		return gradientOrientationX2(i);
	})
    .attr("y2", function(d,i){
		return gradientOrientationY2(i);
	})
    .attr("spreadMethod", "pad")
	.append("stop")
    .attr("offset", function(d,i){
		return gradientBasePercentage(dataset[i]);
	})
    .attr("stop-color", "skyBlue")
	.attr("id",function(d,i){
		return "base_stop_gradient_crystal_"+ i;
	})
    .attr("stop-opacity", 0.5);
	// appending the second stop (bugs if done directly in the gradient creation
	// loop)
	layoutDataset.forEach(function(d,i){
	var color = domainColor(i);
	
	d3.select("#gradient_crystal_" + i)
	.append("stop")
    .attr("offset", "100%")
    .attr("stop-color",color )
    .attr("stop-opacity", 1)
	});
	


	// adding the main circle
	var test = svg.append("circle")
	.attr("cx",function(){
        	   return width/2;
        	   })
	.attr("cy",function(){
        	   return height/2;
        	   })	
.attr("r",function(){
        	   return innerRadius;
        	   })	
.attr("fill",function(){
        	   return "WhiteSmoke";
        	   })				   
.attr("stroke",function(){
        	   return "gray";
        	   })	
.attr("stroke-width",function(){
        	   return "2";
        	   });
			   
	// adding domains legends
svg.selectAll("text")
		   .data(layoutDataset)
		   .enter()
		   .append("text")
		   .text(function(d,i) {
        return d;
   		})
		.attr("x",function(d,i){
        	   return xCircle(i,outerRadius);
        	   })
			   .attr("y",function(d,i){
        	   return yCircle(i,outerRadius);
        	   })
			   .attr("font-family", "sans-serif")
   		.attr("font-size", rFontSize + "px")
   		.attr("fill", "dimGray")
		.attr("text-anchor","middle");
		
		
		
		// adding axes on each domain
		var axes = svg.selectAll("line")
		.data(layoutDataset)
		.enter()
		.append("line")
       .attr("x1", function(){
        	   return width/2;
        	   })
       .attr("y1", function(){
        	   return height/2;
        	   })
      .attr("x2", function(d,i){
        	   return xCircle(i,innerRadius);
        	   })
      .attr("y2", function(d,i){
        	   return yCircle(i,innerRadius);
        	   })
      .attr("stroke-width", 1)
      .attr("stroke", "gray");
	  
	  		// adding pin point on circle
		svg.selectAll("circle").exit()
		   .data(layoutDataset)
		   .enter()
		.append("circle")
		.attr("cx",function(d,i){
        	   return xCircle(i,innerRadius);
        	   })
			   .attr("cy",function(d,i){
        	   return yCircle(i,innerRadius);
        	   })
   		.attr("r", rCursorPoint)
		.attr("fill",function(d,i){
			return domainColor(i);
		});
	  
	  // global variables for handlings bounds in dragging
	  var dragIndex;
	  var dragXBounds;
	  var dragMinXBound;
	  var dragMaxXBound;
	  var dragYBounds;
	  var dragMinYBound;
	  var dragMaxYBound;
	  
	  
	  		  // adding cristal lines (before the cursor)
		 svg.selectAll("polygon").exit()
		.data(dataset)
		.enter()
		.append("polygon")
		.attr("fill-opacity",1)
		.attr("stroke","blank")
		.attr("stroke-width",1)
		.attr("points",function(d,i){
			return getPolyPoints(d,i);})
		.attr("fill",function(d,i){
			return "url(#gradient_crystal_" + i + ")";})
		.attr("id",function(d,i){
			return "crystal_" + i;});

// d3.select("#leblop").attr("fill", "url(#gradient)");

	  
	  // adding cursor points
	  		svg.selectAll("circle").exit()
		   .data(dataset)
		   .enter()
		.append("circle")
		.attr("id", function(d,i){
        	   return "domain_cursor_" + i;
        	   })
		.attr("cx",function(d,i){
        	   return xCircle(i,innerRadius*pinValue2radialAbs(d));
        	   })
			   .attr("cy",function(d,i){
        	   return yCircle(i,innerRadius*pinValue2radialAbs(d));
        	   })
   		.attr("r", rCursorPoint)
		.attr("fill","white")
		.attr("fill-opacity",0)
		.attr("stroke-opacity",0)
		.attr("cursor","pointer")
		.attr("stroke",function(d,i){
			return domainColor(i);
		})
		.attr("stroke-width",3)
		.call(d3.drag()
          .on("start", dragstarted)
          .on("drag", dragged)
          .on("end", dragended));

		  
		 
function dragstarted(d) {
console.log(this.cx.baseVal.value);
dragIndex = this.id.substr(this.id.length - 1);
dragXBounds = [xCircle(dragIndex,innerRadius*pinValue2radialAbs(0)),xCircle(dragIndex,innerRadius*pinValue2radialAbs(100))];
dragMinXBound = Math.min(...dragXBounds);
dragMaxXBound = Math.max(...dragXBounds);
dragYBounds = [yCircle(dragIndex,innerRadius*pinValue2radialAbs(0)),yCircle(dragIndex,innerRadius*pinValue2radialAbs(100))];
dragMinYBound = Math.min(...dragYBounds);
dragMaxYBound = Math.max(...dragYBounds);
  d.fx = d.x;
  d.fy = d.y;
}

function dragged(d) {
var res = finalPin(d3.event.x,d3.event.y,dragIndex);
d3.select("#crystal_" + dragIndex).attr("points",getPolyPoints(0,dragIndex));
this.cx.baseVal.value = res[0];
this.cy.baseVal.value = res[1];
console.log(gradientBasePercentage(res[2]));
d3.select("#base_stop_gradient_crystal_"+ dragIndex).attr("offset", gradientBasePercentage(res[2]));
}

function dragended(d) {
	console.log(Math.floor(finalDragRoseV));
	document.getElementById('entitybundle_evolution_domain_' + dragIndex).value = Math.floor(finalDragRoseV);
} 