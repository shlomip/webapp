//$(document).ready(function(){

var tabArray = ["#quick-reports", "#my-folders", "#my-team-folders", "#public-folders"];

/*function hide-rest(var tabName){
	
	int i=0;
	if (typeof(Storage) != "undefined") {
		// Retrieve
		//document.getElementById("tab-quick-reports").innerHTML = localStorage.getItem("last-tab");
		for (i; i < tabArray.length(); i++){
			if(tabArray[i]!=tabName)
				$("tabArray[i]").hide();
		}
		
	} else {
	//	document.getElementById("result").innerHTML = "Sorry, your browser does not support Web Storage...";
	}
}*/

$(".tab").hide();

select_tab();

$("#tab-quick-reports").click(function(){
	$(".tab").hide();
	$(".tab-head").css("background-color","e6e6e6");
	$("#quick-reports").show();
	$("#tab-quick-reports").css("background-color","#e6e6e6");
	localStorage.setItem("last-tab", "#quick-reports");
	hide-rest("#quick-reports");
}); 
$("#tab-my-folders").click(function(){
	$(".tab").hide();
	$(".tab-head").css("background-color","#525252");
	$("#my-folders").show();
	$("#tab-my-folders").css("background-color","#e6e6e6");
	localStorage.setItem("last-tab", "#my-folders");
	hide-rest("#my-folders");
}); 
$("#tab-my-team-folders").click(function(){
	$(".tab").hide();
	$(".tab-head").css("background-color","#525252");
	$("#my-team-folders").show();
	$("#tab-my-team-folders").css("background-color","#e6e6e6");
	localStorage.setItem("last-tab", "#my-team-folders");
	hide-rest("#my-team-folders");
}); 
$("#tab-public-folders").click(function(){
	$(".tab").hide();
	$(".tab-head").css("background-color","#525252");
	$("#public-folders").show();
	$("#tab-public-folders").css("background-color","#e6e6e6");
	localStorage.setItem("last-tab", "#public-folders");
	hide-rest("#public-folders");
}); 

$("#settings").click(function(){
	$(".reports-wrapper").toggle();

});


function select_tab () {
	// body...
if(localStorage.getItem("last-tab")=="#quick-reports")
	$("#quick-reports").show();
else if(localStorage.getItem("last-tab")=="#my-folders")
	$("#my-folders").show();
else if(localStorage.getItem("last-tab")=="#my-team-folders")
	$("#my-team-folders").show();
else if(localStorage.getItem("last-tab")=="#public-folders")
	$("#public-folders").show();
else 
	$("#quick-reports").show(); 
}
//}
