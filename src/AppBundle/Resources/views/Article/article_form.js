/** args : main|modal,begin|end,true|false */
function requirePreciseDate(formType,arg,required){
	$("#article_" + formType + "_" + arg + "Date").attr("required",arg);
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
	if($("#article_"+ formType + "_is"+ arg.capitalize() + "DateApprox").is((":checked"))){
		$("#article_" + formType + "_min" + arg.capitalize() + "Date_row").hide();
		$("#article_" + formType + "_max" + arg.capitalize() + "Date_row").hide();
	}
	else{
		$("#article_" + formType + "_" + arg + "Date_row").hide();
	}
}

var argForApprox = ['begin','end'];
instanciateFormEvent('main');

function instanciateFormEvent(formType){
	var arg = "begin";
	hideApproxDate(formType,arg);
	requireApproxDate(formType,arg,false);
	
	arg = "end";
	hideApproxDate(formType,arg);
	requireApproxDate(formType,arg,false);
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






