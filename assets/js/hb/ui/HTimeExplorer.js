/**
 * @package HTimeExplorer.js
 * @doc HTimeExplorer.js :
 */

const _ZOOM_SCALE = [0.000001,1000000];
let _zoomAccelerator = d3.scaleLinear()
    .domain([0,1,7,20,40,80,1000,10000*365.25,12000*365.25])
    .range([15, 10,5,3,1.8,1,0.5,0.2]);
const _DATE_MIN = (new Date('9999-01-01')).setFullYear(-9999);
const _DATE_MAX = new Date();

/**
 * @doc setDefaultOption for HTimeExplorer
 * @param option
 * @returns {object}
 * @private
 */
let _setDefaultOption = function(option) {
    return option;
};
/**
 * @doc apply options to HArticleModal
 * @private
 */
let _applyOption = function(modal){

};

let _svgDrawer = function(explorer,drawGroups=['all']){
    explorer.d3SvgContainer.attr("width","100%").attr("height","100");
    console.log(explorer.$centralContainer.width());

    let hScale = d3.scaleLinear()
        .domain([0, 100])
        .range([0, explorer.$centralContainer.width()]);
    console.log(hScale);

    //let path = hb.util.geom.getTriangleDefPoints(100,10,150,50);
    let relPath = "M 2% 50 L 7% 10 L 7% 30 L 90% 30 L "
        + "90% 10 L 98% 50 L 90% 90 L 90% 70 L " +
        "7% 70 L 7% 90 Z";

    let absPath = hb.util.geom.hScalePath(relPath,hScale);




    explorer.d3SvgTimeArrow= explorer.d3SvgContainer.append("path");
    explorer.d3SvgTimeArrow.attr("fill","LightBlue")
        .attr("stroke","LightBlue").attr("stroke-width",1)
        .attr("d",absPath)
        .call(d3.drag()
            .on("start", function(){return _dateDragStarted(d3.event,explorer);})
            .on("drag",  function(){return _dateDragged(d3.event,explorer);})
            .on("end", function(){return _dateDragEnded(d3.event,explorer);})
        )
        .call(d3.zoom()
            .scaleExtent(_ZOOM_SCALE)
            .on("start", function(){return _dateZoomStarted(d3.event,explorer,d3.mouse(this));})
            .on("zoom",  function(){return _dateZoomed(d3.event,explorer);})
            .on("end", function(){return _dateZoomEnded(d3.event,explorer);})
        );

    explorer.$articleContainer = $("<div class='hb-hte-articles'/>").appendTo(explorer.$centralContainer);
    console.log(explorer.d3SvgContainer.style("width"));
    explorer.$articleContainer.height("50").width(hb.util.geom.getPathMaxX(explorer.d3SvgTimeArrow.attr('d')));

    explorer.d3ArticleContainer = d3.select(explorer.$articleContainer.get(0));

    explorer.d3SvgArticleContainer = explorer.d3ArticleContainer.append("svg").attr("width","100%")
        .attr("height","100");

    explorer.timeScale.range([
        hb.util.geom.getPathMinX(explorer.d3SvgTimeArrow.attr('d')),
        hb.util.geom.getPathMaxX(explorer.d3SvgTimeArrow.attr('d'))]);

    let date = new Date(2000,6,24);


    explorer.d3SvgArticleTest = explorer.d3SvgArticleContainer.append("circle")
        .attr("r",5)
        .attr("fill","yellow")
        .attr("cursor","pointer")
        .attr("stroke","orange")
        .attr("stroke-width",2)
        .attr("cx",explorer.timeScale(date))
        .attr('cy',30);

    explorer.hTimeRange = new hb.util.HTimeRange(explorer);
    explorer.hTimeRange.setHDate(explorer.hDate);

    explorer.$centralContainer.on("hb.hresize",function(event,ratio){
        explorer.timeScale.range([
            hb.util.geom.getPathMinX(explorer.d3SvgTimeArrow.attr('d')),
            hb.util.geom.getPathMaxX(explorer.d3SvgTimeArrow.attr('d'))*ratio]);

        /*console.log(explorer.$centralContainer.width());
        console.log(explorer.d3SvgTimeArrow.style("width"));
        console.log(ratio);*/
        explorer.d3SvgTimeArrow.attr("transform","scale(" + ratio + ",1)");
        explorer.d3SvgArticleTest.attr("cx",explorer.timeScale(date));
        explorer.$articleContainer.width(hb.util.geom.getPathMaxX(explorer.d3SvgTimeArrow.attr('d'))*ratio);
        explorer.hTimeRange.setHDate(explorer.hDate);
    });
};

/**
 * @doc builds explorer main object
 * @private
 */
let _build = function(explorer) {
    let $container = explorer.$target.parent().parent();
    console.log($container.find("label"));
    $container.find("label").each(function(){
        $(this).remove();
        $(this).parent().remove();
    });

    explorer.$header = $("<div class=\"row\"</div>").appendTo($container);
    let $inputContainer = $("<div class=\"col-xs-10 col-xs-offset-1" +
        " col-sm-8 col-sm-offset-2" +
        " col-md-4 col-md-offset-4 +" +
        " col-lg-4 col-lg-offset-4\"></div>").appendTo(explorer.$header);

    explorer.$target.parent().detach();
    $inputContainer.append(explorer.$target.detach());

    explorer.$body = $("<div class=\"row\"</div>").appendTo($container);

    explorer.$centralContainer = $("<div class=\"col-xs-12 col-sm-12 col-md-12 col-lg-12 hb-hte-container\" " +
        "style=\"white-space: nowrap;display: inline-block;" +
        "float: none;padding:0px 30px 0px;\"></div>").appendTo(explorer.$body);

    let d3CentralContainer = d3.select(explorer.$centralContainer.get(0));
    explorer.d3SvgContainer = d3CentralContainer.append("svg");
    _svgDrawer(explorer);


    return $container;
};

let _dateDragStarted =function (event,explorer){
    explorer.dragData = {initialX:event.x,delta:0};
};
let _dateDragged = function (event,explorer) {
    let ud = hb.util.date;
    //let dx = event.x - explorer.dragData.initialX;
    let delta = - (explorer.dragData.delta + hb.util.date.floatDayDiff(explorer.timeScale.invert(event.x),
        explorer.timeScale.invert(explorer.dragData.initialX)));
    let intDelta = Math.floor(delta);

    explorer.dragData.delta  = intDelta -delta;
    explorer.dragData.initialX = event.x;

    if(intDelta !== 0){
        let newBeginDate = hb.util.date.addDay(hb.util.date.clone(explorer.hDate.beginDate),intDelta);
        let newEndDate = hb.util.date.addDay(hb.util.date.clone(explorer.hDate.endDate),intDelta);

        if(newBeginDate < _DATE_MIN) newBeginDate = ud.clone(_DATE_MIN);
        if(newEndDate > _DATE_MAX) newEndDate = ud.clone(_DATE_MAX);

        explorer.setHDate(new hb.util.HDate(2,newBeginDate,newEndDate));

        explorer.$target.first().val(explorer.hDate.getLabel());
        explorer.$target.first().attr("data-hb-value",JSON.stringify(explorer.hDate));
    }
    /*if(hts.eventInitialized){
        hts.renderEvent();
    }*/
};
let _dateDragEnded = function (event,explorer) {} ;

let _dateZoomStarted = function (event,explorer,mousePos){
    let ud = hb.util.date;

    explorer.zoomData = explorer.zoomData || {};
    let adjRatio=explorer.zoomData.initialZoomK || event.transform.k;

    explorer.zoomData = {initialZoomX:mousePos[0],initialZoomK:adjRatio};

    explorer.zoomData.initialZoomDate = ud.addDay(
        ud.clone(explorer.timeScale.invert(explorer.zoomData.initialZoomX)),1);
};

let _dateZoomed = function (event,explorer) {
    let ud = hb.util.date;

    let hDate = explorer.hDate;
    let zoomData = explorer.zoomData;
    let nbJBegin = hb.util.date.dayDiff(hDate.beginDate,zoomData.initialZoomDate);
    let nbJEnd = hb.util.date.dayDiff(hDate.endDate,zoomData.initialZoomDate);

    // acceleration varies with the number of day
    let intervalSize = explorer.hDate.getIntervalSize();
    console.log(intervalSize );
    console.log(_zoomAccelerator(intervalSize));
    let adjRatio = 1 + (event.transform.k - 1)*_zoomAccelerator(intervalSize);

    // new day count from zoom date
    let newNbJBegin = Math.round(nbJBegin * zoomData.initialZoomK /adjRatio);
    let newNbJEnd = Math.round(nbJEnd * zoomData.initialZoomK /adjRatio);

    let newBeginDate = ud.addDay(ud.clone(zoomData.initialZoomDate),newNbJBegin);
    let newEndDate = ud.addDay(ud.clone(zoomData.initialZoomDate),newNbJEnd);

    if(newBeginDate < _DATE_MIN) newBeginDate = ud.clone(_DATE_MIN);
    if(newEndDate > _DATE_MAX) newEndDate = ud.clone(_DATE_MAX);

    explorer.setHDate(new hb.util.HDate(2,newBeginDate,newEndDate));
    explorer.$target.first().val(explorer.hDate.getLabel());
    explorer.$target.first().attr("data-hb-value",JSON.stringify(explorer.hDate));



    zoomData.initialZoomK = adjRatio;
};

let _dateZoomEnded = function (event,explorer) {
    explorer.zoomData.initialZoomK=1;
    event.transform.k=1;
};

/**
 * @module hb/ui/HTimeExplorer
 * @class hb.ui.HTimeExplorer
 */
let HTimeExplorer = function($target,option = {}){
    this.$target=$target;

    this.option = _setDefaultOption(option);
    _applyOption(this);

    console.log($target.first().val());
    console.log(hb.util.HDate.prototype.parseFromJson($target.first().val()));

    this.hDate = hb.util.HDate.prototype.parseFromJson($target.first().val());

    //this.hDate = new hb.util.HDate(2,new Date(2000,0,1),new Date(2001,0,1));

    this.timeScale = d3.scaleTime().domain([this.hDate.beginDate,this.hDate.endDate]);
    this.relativeTimeScale = d3.scaleTime()
        .range([0,100])
        .domain([this.hDate.beginDate,this.hDate.endDate]);
    _build(this);

    let $this = this;
    this.$target.on("change",function(){
        $this.setHDate(hb.util.HDate.prototype.parseFromJson($target.first().attr("data-hb-value")));
    });

    return this;
};

Object.assign(HTimeExplorer.prototype,{
    setHDate:function(hDate){
        this.hDate = hDate;
        this.timeScale.domain([this.hDate.beginDate,this.hDate.endDate]);
        this.relativeTimeScale.domain([this.hDate.beginDate,this.hDate.endDate]);
        this.hTimeRange.setHDate(this.hDate);
    }
});


module.exports = HTimeExplorer;
