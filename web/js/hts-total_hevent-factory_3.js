function HEventFactory(hts,parentId=null){
	this.hts = hts;
	this.parentId = parentId;
}

/**
*/
HEventFactory.prototype.newInstance = function(dto){
	var event = new HEvent(this.hts,'attached',null,dto.y,dto.title);
	this.setData(event,dto);
	return event;
}	

HEventFactory.prototype.setData = function(event,dto){
	event.hts = this.hts;
	event.url = dto.url;
	event.internId = dto.id;
	event.articleParentId = dto.parentId;
	event.linkId = dto.linkId;
	event.hts = hts;
	event.y = dto.y;

	event.name=dto.title;
	event.abstract=dto.abstract;
	
	if(dto.beginDate != null){
		dto.minBeginDate = dto.beginDate;
		dto.maxBeginDate = dto.beginDate;
	}
	if(dto.endDate != null){
		dto.minEndDate = dto.endDate;
		dto.maxEndDate = dto.endDate;
	}
	dto.minBeginDate = new Date(dto.minBeginDate.timestamp*1000);
	dto.maxBeginDate = new Date(dto.maxBeginDate.timestamp*1000);
	
	dto.minEndDate = new Date(dto.minEndDate.timestamp*1000);
	dto.maxEndDate = new Date(dto.maxEndDate.timestamp*1000);

	event.beginDate=new HDate(dto.minBeginDate,dto.maxBeginDate); // HDate
	event.hasNotEndDate=dto.hasNotEndDate;
	if(! event.hasNotEndDate) event.endDate=new HDate(dto.minEndDate,dto.maxEndDate);
	event.articleType = dto.type;
	event.articleSubType = dto.subType;
	event.toUpdate = true;
}	