/**
 * @package HTimeGrad.js
 * @doc HTimeGrad.js :
 */

/** make the idGenerator for graduations */
let _idGenerator = hb.util.cmn.getIdGenerator();
/** animations time (ms) */
let _animationTime = 300;
let _gradMinHeight = 15;
let _gradMaxHeight = 25;

let _opacity = d3.scaleLinear()
    .domain([-100000,0,5,8,92,95,100,100000])
    .range([0,0,0.5,1,1,0.5,0,0]);

/**  make the date formatters functions according to different type/major */
let _formatDateFunctions = [
    {type:'day',major:1,formatter: hb.util.date.getFormatterFromPattern("Dj/m")},
    {type:'day',major:0,formatter: hb.util.date.getFormatterFromPattern("Dd")},
    {type:'day',major:-1,formatter: function(){return '';}},
    {type:'week',major:1,formatter: hb.util.date.getFormatterFromPattern("M")},
    {type:'week',major:0,formatter: hb.util.date.getFormatterFromPattern("Dd")},
    {type:'week',major:-1,formatter: function(){return '';}},
    {type:'month',major:1,formatter: hb.util.date.getFormatterFromPattern("Y")},
    {type:'month',major:0,formatter: hb.util.date.getFormatterFromPattern("M")},
    {type:'month',major:-1,formatter: function(){return '';}},
    {type:'year',major:1,formatter: hb.util.date.getFormatterFromPattern("Y")},
    {type:'year',major:0,formatter: hb.util.date.getFormatterFromPattern("y")},
    {type:'year',major:-1,formatter: function(){return '';}},
    {type:'decade',major:1,formatter: hb.util.date.getFormatterFromPattern("Y")},
    {type:'decade',major:0,formatter: hb.util.date.getFormatterFromPattern("y")},
    {type:'decade',major:-1,formatter: function(){return '';}},
    {type:'century',major:1,formatter: hb.util.date.getFormatterFromPattern("Y")},
    {type:'century',major:0,formatter: hb.util.date.getFormatterFromPattern("c")},
    {type:'century',major:-1,formatter: function(){return '';}},
    {type:'millennium',major:1,formatter: hb.util.date.getFormatterFromPattern("Y")},
    {type:'millennium',major:0,formatter: hb.util.date.getFormatterFromPattern("c")},
    {type:'millennium',major:-1,formatter: function(){return '';}},
    {type:'id',major:0,formatter: hb.util.date.getFormatterFromPattern("d_m_Y")}
];

/**  callback function to find the adhoc formatter function */
let _findFormatDateFunction = function(thisType,thisMajor){
    return (_formatDateFunctions).find(function(functionArray){
        return (functionArray.type === thisType && functionArray.major === thisMajor);
    }).formatter;
};

/**
 * @doc
 * @module hb/util/HTimeGrad
 * @class hb.util.HTimeGrad
 */
let HTimeGrad = function(parent,date,type,major){
    this.id=_idGenerator();
    this.parent = parent;
    this.date = date;
    this.type = type;
    this.major = major;
    if(major === 1) {this.gradHeight=_gradMaxHeight;}
    else if (major === 0 ) {this.gradHeight=_gradMinHeight;}
    else if (major === -1 ) {this.gradHeight=_gradMinHeight;}

    if(parent !== null && typeof parent.d3SvgTimeArrow !== 'undefined') this.render();
};

Object.assign(HTimeGrad.prototype,{
    line:null,
    lineId:null,
    legend:null,
    legendId:null,
    gradHeight:0,
    rendered:false,
    getLegend: function(){
        return _findFormatDateFunction(this.type,this.major)(this.date);
    },
    /** make or update dom components displaying the graduation */
    render: function(){
        if(this.rendered) return;
        this.lineId = 'hte-grad-line-' + this.type + '-' + (_findFormatDateFunction('id',0))(this.date) + '-' + this.id;
        this.legendId = 'hte-grad-legend-' + this.type + '-' + (_findFormatDateFunction('id',0))(this.date) + '-' + this.id;

        this.line = this.parent.d3SvgContainer
            .append("line")
            .attr("id",this.lineId)
            .attr("stroke-opacity",0)
            .attr('class','hte-grad');

        let hGrad = this;
        this.legend = this.parent.d3SvgContainer
            .append("text")
            .attr("id",this.legendId)
            .text(this.getLegend())
            .attr("fill-opacity",0)
            .attr('class','hte-grad')
            .on('click', function(){
                let explorer = hGrad.parent;
                explorer.setHDate(explorer.hTimeRange.getHDateFromGrad(hGrad));
                explorer.$target.first().val(explorer.hDate.getLabel());
                explorer.$target.first().attr("data-hb-value",JSON.stringify(explorer.hDate));
            });

        this.rendered= true;
        this.updateScale();

        // animation at the creation (only if visible ie custom opacity superior to 0)
        if(this.legend.attr("custom-opacity") > 0){
            this.line
                .transition()
                .attr("stroke-opacity",1)
                .duration(_animationTime);

            this.legend
                .attr("tr-begin",0)
                .transition()
                .attr("fill-opacity",this.legend.attr("custom-opacity"))
                .attr("tr-begin",1)
                .on("end",function(){
                    if(typeof this !== 'undefined' && this !== null){
                        this.setAttribute("fill-opacity",this.getAttribute("custom-opacity"));
                    }
                })
                .duration(_animationTime);
        }
        else{
            this.line.attr("stroke-opacity",1);
            this.legend.attr("tr-begin",1);
        }
    },
    updateScale : function(){
        //console.log(this.parent.timeScale(this.date));
        this.line.attr("x1",this.parent.timeScale(this.date)).attr("x2",this.parent.timeScale(this.date));
        this.legend.attr("x",this.parent.timeScale(this.date));
        this.legend.attr("y",65);
        let opacity = _opacity(this.parent.relativeTimeScale(this.date));

        /*if(this.parent.parentBaseWidth-this.legend.attr("x") < this.parent.parentPinWidth/2){opacity = 0;}
        else if(this.parent.parentBaseWidth-this.legend.attr("x") < this.parent.parentPinWidth){
            opacity = (this.parent.parentBaseWidth-this.parent.parentPinWidth/2 - this.legend.attr("x"))/(this.parent.parentPinWidth/2);
        }
        else if(this.legend.attr("x") < 0){opacity = 0;}
        else if(this.legend.attr("x") < this.parent.parentPinWidth/2){
            opacity = (this.legend.attr("x"))/(this.parent.parentPinWidth/2);
        }*/
        this.legend.attr("custom-opacity",opacity);
        if(this.legend.attr("tr-begin")==1) this.legend.attr("fill-opacity",opacity);
        this.line.attr("y1",45 - opacity*this.gradHeight/2);
        this.line.attr("y2",45 + opacity*this.gradHeight/2);
    },
    /** remove dom components of the graduations with animation*/
    remove : function(){
        console.log("grad in remove");
        if(this.parent !== null){
            this.line
                .transition()
                .attr("opacity",0)
                .duration(this.animationTime)
                .attr("class","suppressed");
            this.legend
                .transition()
                .attr("opacity",0)
                .duration(this.animationTime)
                .attr("class","suppressed");

            $(this.line).detach();
            $(this.legend).detach();
            delete this.line;
            delete this.legend;
            this.parent = null;
            this.lineId = null;
            this.legendId = null;
        }
    }
});

module.exports = HTimeGrad;