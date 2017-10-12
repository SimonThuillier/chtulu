/** args : main|modal,begin|end,true|false */
function requirePreciseDate(formType,arg,required){
	$("#article_" + formType + "_" + arg + "Date").attr("required",required);
}
/** args : main|modal,begin|end,true|false */
function requireApproxDate(formType,arg,required){
	$("#article_" + formType + "_min" + arg.capitalize() + "Date").attr("required",required);
	$("#article_" + formType + "_max" + arg.capitalize() + "Date").attr("required",required);
}
/** args : main|modal,begin|end,true|false */
function requireDate(formType,arg,required){
	if(required){
		if($("#article_"+ formType + "_is"+ arg.capitalize() + "DateApprox").is((":checked"))){
			$("#article_" + formType + "_min" + arg.capitalize() + "Date").attr("required",required);
			$("#article_" + formType + "_max" + arg.capitalize() + "Date").attr("required",required);
		}
		else{
			$("#article_" + formType + "_" + arg + "Date").attr("required",arg);
		}
	}
	else{
		$("#article_" + formType + "_" + arg + "Date").attr("required",required);
		$("#article_" + formType + "_min" + arg.capitalize() + "Date").attr("required",required);
		$("#article_" + formType + "_max" + arg.capitalize() + "Date").attr("required",required);
	}
}

/** args : main|modal,begin|end */
function hidePreciseDate(formType,arg){
	$("#article_" + formType + "_" + arg + "Date_row").hide();
}
/** args : main|modal,begin|end*/
function showPreciseDate(formType,arg){
	$("#article_" + formType + "_" + arg + "Date_row").show();
}

/** args : main|modal,begin|end */
function hideApproxDate(formType,arg){
	$("#article_" + formType + "_min" + arg.capitalize() + "Date_row").hide();
	$("#article_" + formType + "_max" + arg.capitalize() + "Date_row").hide();
}
/** args : main|modal,begin|end */
function showApproxDate(formType,arg){
	$("#article_" + formType + "_min" + arg.capitalize() + "Date_row").show();
	$("#article_" + formType + "_max" + arg.capitalize() + "Date_row").show();
}
/** args : main|modal,begin|end*/
function showDate(formType,arg){
	$("#article_"+ formType + "_is"+ arg.capitalize() + "DateApprox_row").show();
	if($("#article_"+ formType + "_is"+ arg.capitalize() + "DateApprox").is((":checked"))){
		$("#article_" + formType + "_min" + arg.capitalize() + "Date_row").show();
		$("#article_" + formType + "_max" + arg.capitalize() + "Date_row").show();
	}
	else{
		$("#article_" + formType + "_" + arg + "Date_row").show();
	}
}
/** args : main|modal,begin|end*/
function hideDate(formType,arg){
	$("#article_"+ formType + "_is"+ arg.capitalize() + "DateApprox_row").hide();
	$("#article_" + formType + "_min" + arg.capitalize() + "Date_row").hide();
	$("#article_" + formType + "_max" + arg.capitalize() + "Date_row").hide();
	$("#article_" + formType + "_" + arg + "Date_row").hide();
}

function autoloadSubType(formType){
	var idType =  $("select#article_" + formType + "_type").find(":selected").val();
	var array = JSON.parse($("#type_subtype_array").val());
	var availableSubTypes = array[idType];
	var reSelect = true;
	$("select#article_" + formType + "_subType > option").each(function() {
		if($.inArray($(this).val(),availableSubTypes) < 0 ){
			$(this).hide();
		}
		else{
			if (reSelect){
				$("select#article_" + formType + "_subType").val($(this).val()).change();
				reSelect= false;
			}
			$(this).show();
		}
	});
}

function finalizeFormState(formType){
	var creation = $("input#article_" + formType + "_title").val() === null;
	
	if($("#article_"+ formType + "_isBeginDateApprox").is((":checked"))){
		requirePreciseDate(formType,'begin',false);
		hidePreciseDate(formType,'begin');
		requireApproxDate(formType,'begin',true);
		showApproxDate(formType,'begin');
	}
	else{
		requirePreciseDate(formType,'begin',true);
		showPreciseDate(formType,'begin');
		requireApproxDate(formType,'begin',false);
		hideApproxDate(formType,'begin');
	}
	if($("#article_" + formType + "_hasNotEndDate").is((":checked"))){
		requireDate(formType,'end',false);
		hideDate(formType,'end');
	}
	else{
		if($("#article_"+ formType + "_isEndDateApprox").is((":checked"))){
			requirePreciseDate(formType,'end',false);
			hidePreciseDate(formType,'end');
			requireApproxDate(formType,'end',true);
			showApproxDate(formType,'end');
		}
		else{
			requirePreciseDate(formType,'end',true);
			showPreciseDate(formType,'end');
			requireApproxDate(formType,'end',false);
			hideApproxDate(formType,'end');
		}
	}
}

function finalizeFormEvent(formType){
	$("#article_" + formType + "_type").change(function(){
		autoloadSubType(formType);
	});

	var arg = "end";
	$("#article_" + formType + "_hasNotEndDate").on("click",
			function() {
		if (this.checked) {
			hideDate(formType,arg);
			requireDate(formType,arg,false);
		}
		else {
			showDate(formType,arg);
			requireDate(formType,arg,true);
		}
	});

	var argForApprox = ['begin','end'];
	argForApprox.forEach(function(arg){
		$("#article_" + formType + "_is" + arg.capitalize() + "DateApprox").on("click",
				function() {
			if (this.checked) {
				hidePreciseDate(formType,arg);
				requirePreciseDate(formType,arg,false);
				showApproxDate(formType,arg);
				requireApproxDate(formType,arg,true);
			}
			else {
				showPreciseDate(formType,arg);
				requirePreciseDate(formType,arg,true);
				hideApproxDate(formType,arg);
				requireApproxDate(formType,arg,false);
			}
		});
	});
}

function finalizeForm(formType){
	finalizeFormState(formType);
	finalizeFormEvent(formType);
}








