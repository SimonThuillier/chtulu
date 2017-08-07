/**
 * Load one hts to the div of the current page
 */
vex.defaultOptions.className = 'vex-theme-os';

var htsOptions = [hasMainEvent=false];

var d1 = new Date(1800,0,7);
d1.setHours(0,0,0,0);
var d2 = new Date(1880,0,28);
d2.setHours(0,0,0,0);
var hts = new HTimeScroller("#hts-svgcontainer",d1,d2,null, htsOptions);

console.log(hts);

$(function () {
	var prevHeight = $('div#hts-event-container').height();
	var deltaHeight = $("#hts-svgcontainer").attr("height") - prevHeight;
	$('div#hts-event-container').attrchange({
		callback: function (e) {
			var curHeight = $(this).height();            
			if (prevHeight !== curHeight) {
				$("#hts-svgcontainer").attr("height",curHeight + deltaHeight);
				hts.updateSpatialData(false);
				hts.redrawComponent('event-area');
				hts.redrawComponent('event-fcontainer');
				hts.redrawComponent('event-container');
				prevHeight = curHeight;
			}  
		}
	});
});




$("#test").click(function() {
	// var hts = hts;
	  console.log("test");
	  				for(i=0;i<hts.grads.length;i++){
						console.log("index ",i,", major : ",hts.grads[i].major,", date : ",hts.grads[i].date);
					}
	})
	