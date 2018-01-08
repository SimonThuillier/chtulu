/**
 * harticle class
 */
"use strict";

HArticle.prototype.animationTime = 400;
HArticle.prototype.animationTextTime = 500;
HArticle.prototype.rPinPoint = 5;

//prototype events
function HArticle(hts,type,attachment=null,y=null,name=null){
    this.id=this.idGenerator();
    this.internId = null;
    this.articleParentId = null;
    this.linkId = null;
    this.url = null;
    this.hts = hts;
    this.type = type; // is the event detailed (with article) of not ? : can be main, attached or unattached
    this.hasArticle = false; // indicate if the event has a detailed article
    this.y = (this.type === 'main')?20:y;
    this.adjustedY=y; // adjusted y to prevent event overflow when time dezoomed
    this.adjustedX=0; // adjusted x for text display

    this.name=name;
    this.abstract=null;
    this.rendered = false;
    this.rect = null;
    this.rectId = null;
    this.text = null;
    this.pinPoint = null;
    this.pinPointId = null;

    this.beginDate=null; // HDate
    this.hasEndDate=true; // boolean
    this.endDate=null; // HDate
    this.rendered = false;
    this.manager = null;

    this.articleType = 1;
    this.articleSubType = 1;

    this.redirect = false;

    // to handle submission
    this.toUpdate = true;
}

/** returns true if event exists in database ( article) or false otherwise (newly created event) */
HArticle.prototype.isPersisted = function(){
    return (this.internId > 0);
}

HArticle.prototype.getLabelHtml = function(){

    if(this.url != null){
        return "<span style=\"white-space:nowrap\" \"text-anchor\"=\"start\"><a href=\"" + this.url +
            "\" title=\"" + this.name + "\" >" +
            this.name + "</a></span>";
    }
    return "<span style=\"white-space:nowrap\" \"text-anchor\",\"start\"><i><p>" +
        this.name + "</p></i></span>";
}

/** make the idGenerator for the event prototype */
HArticle.prototype.idGenerator = idGenerator();
/** form id where events are bound to */
HArticle.prototype.FORM_ID = "article_modal";

HArticle.prototype.dateFormatter = myFormatPatternDate("d/m/Y");

/** function to create graphic components of events */
HArticle.prototype.render = function(){
    if(this.rendered) return;

    this.rectId = 'hts-event-rect-' + this.type + '-' + this.id;
    this.textId = 'hts-event-title-' + this.type + '-' + this.id;
    this.pinPointId = 'hts-event-pin-' + this.type + '-' + this.id;

    var htsEvent=this;
    var color = (this.type === 'main')?"Orange":"MediumSlateBlue";


    this.rect = this.hts.findComponentByName('event-area')
        .append("rect")
        .attr("id",this.rectId)
        .attr("title",this.rectId)
        .attr("fill",color)
        .attr("opacity","1")
        .attr("cursor","pointer")
        .on('click',function(){
            htsEvent.edit();
            d3.event.preventDefault();
            d3.event.stopPropagation();
        });

    this.text = this.hts.findComponentByName('event-area')
        .append("foreignObject")
        .attr("id",this.textId)
        .attr("text-anchor","middle")
        .html(this.getLabelHtml())
        .on('click',function(){d3.event.stopPropagation();});

    this.pinPoint = this.hts.findComponentByName('event-area')
        .append("circle")
        .attr("id",this.pinPointId)
        .attr("r",this.rPinPoint)
        .attr("fill","yellow")
        .attr("cursor","pointer")
        .attr("stroke","orange")
        .attr("stroke-width",2)
        .call(d3.drag()
            .on("start", function(){htsEvent.deltaY = htsEvent.y - d3.event.y;})
            .on("drag",  function(){
                if((d3.event.y + htsEvent.deltaY) < htsEvent.manager.yMargin) return;
                htsEvent.y = d3.event.y + htsEvent.deltaY;
                htsEvent.adjustedY = htsEvent.y;
                htsEvent.manager.setMaxY(htsEvent.y + htsEvent.manager.yMargin);
                htsEvent.updateRender(0,0);})
            .on("end", function(){})
        )
        .on('click',function(){
            htsEvent.edit();
            d3.event.preventDefault();
            d3.event.stopPropagation();})


    this.rendered=true;
}

/** function returning true if two events cross in time, false otherwise */
HArticle.prototype.cross = function(HArticle2){
    if((this.getDisplayedEndDate() >= HArticle2.getDisplayedBeginDate() &&
            this.getDisplayedBeginDate() <= HArticle2.getDisplayedEndDate()) ||
        (this.getDisplayedBeginDate() <= HArticle2.getDisplayedEndDate() &&
            this.getDisplayedEndDate() >= HArticle2.getDisplayedBeginDate()	)){return true;}
    return false;
}

/** function returning true if the display(text) of two events intersect */
HArticle.prototype.displayIntersect = function(HArticle2){
    var width1 = this.text.node().getBBox().width;
    var minX1 = Number(this.text.attr("x")) - width1/2;
    var maxX1 = Number(this.text.attr("x")) + width1/2;
    var width2 = HArticle2.text.node().getBBox().width;
    var minX2 = Number(HArticle2.text.attr("x")) - width2/2;
    var maxX2 = Number(HArticle2.text.attr("x")) + width2/2;
    if((maxX1 >= minX2 && minX1 <= maxX2)|| (minX2 <= maxX1 && maxX2 >= minX1)){return true;} // check textArea
    width1 = Number(this.rect.attr("width"));
    minX1 = Number(this.rect.attr("x")) - width1/2 - this.rPinPoint/2;
    maxX1 = Number(this.rect.attr("x")) + width1/2;
    width2 = Number(HArticle2.rect.attr("width"));
    minX2 = Number(HArticle2.rect.attr("x")) - width2/2 - this.rPinPoint/2;
    maxX2 = Number(HArticle2.rect.attr("x")) + width2/2;
    if((maxX1 >= minX2 && minX1 <= maxX2)|| (minX2 <= maxX1 && maxX2 >= minX1)){return true;} // check Rect
    return false;
}




/** function to create graphic components of events */
HArticle.prototype.updateRender = function(animationTime = this.animationTime,animationTextTime = this.animationTextTime){
    var HArticle = this;

    this.pinPoint
        .transition()
        .attr("cy",this.adjustedY + this.hts.ABS_EVENT_HEIGHT/2 )
        .attr("cx",this.hts.dateScale(this.beginDate.getBoundDate(0)))
        .duration(animationTime);

    this.rect
        .transition()
        .attr("x",this.hts.dateScale(this.getDisplayedBeginDate()))
        .attr("y",this.adjustedY)
        .attr("width",this.hts.dateScale(this.getDisplayedEndDate()) - this.hts.dateScale(this.getDisplayedBeginDate()))
        .attr("height",this.hts.ABS_EVENT_HEIGHT)
        .duration(animationTime);



    this.adjustedX = (this.hts.dateScale(this.getDisplayedBeginDate()) + this.hts.dateScale(this.getDisplayedEndDate()) - this.text.node().getBBox().width)/2 ; // default X
    if(this.getDisplayedBeginDate() < this.hts.beginDate &&
        this.getDisplayedEndDate() > this.hts.beginDate &&
        this.getDisplayedEndDate() < this.hts.endDate){
        this.adjustedX = Math.max(this.adjustedX,5);
    }
    else if(this.getDisplayedEndDate() > this.hts.endDate &&
        this.getDisplayedBeginDate() < this.hts.endDate &&
        this.getDisplayedBeginDate() > this.hts.beginDate){
        this.adjustedX = Math.min(this.adjustedX,this.hts.htsBaseWidth - this.text.node().getBBox().width-5);
        console.log(this.text.node().getBBox());
    }
    else if(this.getDisplayedEndDate() > this.hts.endDate &&
        this.getDisplayedBeginDate() < this.hts.beginDate){

        var ratio = (this.hts.endDate.dayDiff(this.hts.beginDate)) / (this.getDisplayedEndDate().dayDiff(this.getDisplayedBeginDate()));
        var offset = (this.getDisplayedEndDate().dayDiff(this.hts.endDate)) - (this.hts.beginDate.dayDiff(this.getDisplayedBeginDate()));

        var virtualDate = this.hts.beginDate.clone().addDay(offset);

        this.adjustedX = this.hts.htsBaseWidth/2 + this.hts.dateScale(virtualDate)*ratio/1.5;
        this.adjustedX = Math.max(this.adjustedX,5);
        this.adjustedX = Math.min(this.adjustedX,this.hts.htsBaseWidth - this.text.node().getBBox().width-5);
    }

    this.text
        .attr("height",this.hts.ABS_EVENT_HEIGHT)
        .transition()
        .attr("y",this.adjustedY -20)
        .attr("x",this.adjustedX - 10)
        .duration(animationTextTime);
}

HArticle.prototype.getDisplayedEndDate = function(){
    if(this.endDate === null) return new Date();
    return this.endDate.getBoundDate(0).clone().addDay(1);
}
HArticle.prototype.getDisplayedBeginDate = function(){
    return this.beginDate.getBoundDate(0);
}

/** create the html form for the event */
HArticle.prototype.getFormHtml = function(){
    var regexp = new RegExp('id="' + this.FORM_ID,'g');
    return regexp[Symbol.replace]($("#" + this.FORM_ID).html(), 'id="' + this.FORM_ID + '_live');
}

/** bind a form of given id with the data from this HArticle object */
HArticle.prototype.bindToForm = function(formId){
    $("input#" + formId + "_title").val(this.name);
    $("select#" + formId + "_type").val(this.articleType).change();
    $("select#" + formId + "_subType").val(this.articleSubType).change();
    $("input#" + formId + "_title").val(this.name);
    $("textarea#" + formId + "_abstract").val(this.abstract);
    $("textarea#" + formId + "_abstract").removeClass('hmaxlength-enabled');

    $("input#" + formId + "_beginDateLabel").attr("hdate",(this.beginDate != null)?JSON.stringify(this.beginDate):"");
    $("input#" + formId + "_beginDateLabel").val((this.beginDate != null)?this.beginDate.getLabel():"");
    $("input#" + formId + "_hasEndDate").attr('checked',this.hasEndDate);
    $("input#" + formId + "_endDateLabel").attr("hdate",(this.endDate != null)?JSON.stringify(this.endDate):"");
    $("input#" + formId + "_endDateLabel").val((this.endDate != null)?this.endDate.getLabel():"");

    $("input#" + formId + "_y").val(this.y);
}

/** @doc returns normalized associative array of the HArticle */
HArticle.prototype.normalize = function(){
    var dto = {};
    dto.title = this.name;
    dto.type = this.articleType;
    dto.subType = this.articleSubType;
    dto.abstract = this.abstract;

    dto.beginDateLabel = (this.beginDate != null)?JSON.Stringify(this.beginDate):"";
    dto.hasEndDate = this.hasEndDate;
    dto.endDateLabel = (this.endDate != null)?JSON.Stringify(this.endDate):"";

    dto.y = this.y;
    dto.id = this.internId;
    dto.parentId = this.articleParentId;
    dto.linkId = this.linkId;

    return dto;
}


/** update the object from the form of given Id */
HArticle.prototype.updateFromForm = function(formId){
    this.name = $("input#" + formId + "_title").val();
    this.articleType = $("select#" + formId + "_type").find(":selected").val();
    this.articleSubType = $("select#" + formId + "_subType").find(":selected").val();
    this.abstract = $("textarea#" + formId + "_abstract").val();

    var strHDate = $("input#" + formId + "_beginDateLabel").attr("hdate");
    this.beginDate = null;
    if(typeof strHDate !== 'undefined' && strHDate !== null && strHDate !== ''){
        this.beginDate = HDate.prototype.parse(strHDate);
    }
    this.hasEndDate = ($("input#" + formId + "_hasEndDate").is(":checked"));
    this.endDate = null;
    strHDate = $("input#" + formId + "_endDateLabel").attr("hdate");
    if(this.hasEndDate && typeof strHDate !== 'undefined' && strHDate !== null && strHDate !== ''){
        this.endDate = HDate.prototype.parse(strHDate);
    }
}

/** check if event form is valid : returns true or false */
HArticle.prototype.checkFormValidity = function(formId){
    if(! document.getElementById(formId).checkValidity()){
        $("#" + formId + "_fake_submitter").click();
        return false;
    }
    return true;
}

/** function to handle event edition (with modal display) */
HArticle.prototype.edit = function(){
    var message= 'Edition de l\'évenement';
    if(! this.rendered){
        message = 'Ajoutez des événements liés';
        if(this.type === 'main'){
            message = 'Définissez votre événement';
        }
    }

    var htsEvent = this;
    var formId = htsEvent.FORM_ID + '_live';
    var form = vex.dialog.open({
        className: 'vex-theme-os',
        message: message,
        input: htsEvent.getFormHtml(formId),
        defaultOptions:{escapeButtonCloses: false,showCloseButton: true},
        buttons: [
            $.extend({}, vex.dialog.buttons.YES, { id: 'hts-event-add', text: 'Ajouter' }),
            $.extend({}, vex.dialog.buttons.NO, { text: 'Annuler' })
        ],
        callback: function (value) {
            if (value == 0) return; // cancel button

            if(! htsEvent.checkFormValidity(formId)){
                throw new Error("form is not valid"); // prevent callback return and hence modal closing
            }
            else{
                console.log("form is valid");
                htsEvent.updateFromForm(formId);

                if (! htsEvent.rendered) htsEvent.render();
                htsEvent.text.html(htsEvent.getLabelHtml());
                htsEvent.toUpdate = true;
                htsEvent.updateRender();
                if(htsEvent.manager === null) htsEvent.hts.eventManager.addEvent(htsEvent);
                return true;
            }
        }
    });
    this.bindToForm(formId);
    console.log("appel apply");
    $.hbase.func.hbaseApply($("#" + formId));
    console.log("test");
    // add form  and initial state
    finalizeForm('modal_live');

}


