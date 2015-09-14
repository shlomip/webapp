//$(document).ready(function(){


$(".tab").hide();
$("#quick-reports-iframe").hide();
$("#my-team-folders-iframe").hide();
select_tab();

$("#tab-quick-reports").click(function(){
	$(".tab").hide();
	$(".tab-head").css("background-color","#525252");
	$("#quick-reports").show();
	$("#tab-quick-reports").css("background-color","#e6e6e6");
	localStorage.setItem("last-tab", "#quick-reports");
	return false;
	//hideRest("#quick-reports");
}); 
$("#tab-my-folders").click(function(){
	$(".tab").hide();
	$(".tab-head").css("background-color","#525252");
	$("#my-folders").show();
	$("#tab-my-folders").css("background-color","#e6e6e6");
	localStorage.setItem("last-tab", "#my-folders");
	return false;
	//hideRest("#my-folders");
}); 
$("#tab-my-team-folders").click(function(){
	$(".tab").hide();
	$(".tab-head").css("background-color","#525252");
	$("#my-team-folders").show();
	$("#tab-my-team-folders").css("background-color","#e6e6e6");
	localStorage.setItem("last-tab", "#my-team-folders");
	return false;
	//hideRest("#my-team-folders");
}); 
$("#tab-public-folders").click(function(){
	$(".tab").hide();
	$(".tab-head").css("background-color","#525252");
	$("#public-folders").show();
	$("#tab-public-folders").css("background-color","#e6e6e6");
	localStorage.setItem("last-tab", "#public-folders");
	return false;
	//hideRest("#public-folders");
}); 


$(".settings").click(function(e){
	 e.preventDefault();
	$(".reports-wrapper").toggle();
	$("#quick-reports-iframe").hide();
	return false;
});


$("#expend").click(function(e){
	 //e.preventDefault();
	newTab($("#quick-reports-iframe").attr("src"));
	return false;
});

$("#settings-2").click(function(e){
	 e.preventDefault();
	$(".reports-wrapper").toggle();
	$("#quick-reports-iframe").hide();
	return false;
});

$("#save-1").click(function(){
	var check = [];

	if(document.getElementById("report1_name").value=="" || document.getElementById("report1_url").value==""){
		check[0] = "false";
		$("#report1_name").css("border", "2px solid red");
		$("#report1_url").css("border", "2px solid red");
	}
	else{
		localStorage.setItem("reports1_name",$("#report1_name").val());
		localStorage.setItem("reports1_url",$("#report1_url").val());
		update_dropdown($("#report1_url").val(), $("#report1_name").val());
	}

	if(document.getElementById("report2_name").value=="" || document.getElementById("report2_url").value==""){
		check[1]="false";
		$("#report2_name").css("border", "2px solid red");
		$("#report2_url").css("border", "2px solid red");
	}
	else{
		localStorage.setItem("reports2_name",$("#report2_name").val());
		localStorage.setItem("reports2_url",$("#report2_url").val());
		update_dropdown($("#report2_url").val(), $("#report2_name").val());
	}

	if(document.getElementById("report3_name").value=="" && document.getElementById("report3_url").value==""){
		check[2]="false";
		$("#report3_name").css("border", "2px solid red");
		$("#report3_url").css("border", "2px solid red");
	}
	else{
		localStorage.setItem("reports3_name",$("#report3_name").val());
		localStorage.setItem("reports3_url",$("#report3_url").val());
		update_dropdown($("#report3_url").val(), $("#report3_name").val());
	}
	var i = 1;
	while( i<4 ){
		if(check[i-1]=="false"){
			var x = "#reports"
			x.concat(i,"_name");
			var y = "#reports";
			y.concat(i,"_url");
			$("x").css("border", "2px solid red");
			$("y").css("border", "2px solid red");
		}
		i++;
	}

	return false;
});

$("#choose-iframe").change(function(){
	//var selectedOption = $("#choose-iframe option:selected");
	$("option:selected").click($("#quick-reports-iframe").attr("src", "http://"+$("option:selected").attr("value")));
	$("#quick-reports-iframe").show();
	$(".reports-wrapper").hide();
	
});

function newTab(link){
	var win = window.open(link, '_blank');
if(win){
    //Browser has allowed it to be opened
    win.focus();
}else{
    //Broswer has blocked it
    alert('Please allow popups for this site');
}

}
function update_dropdown(url, name){
	//var x = document.getElementById("#choose-iframe");
    var option = document.createElement("option");
    option.text = name;
    option.value = url;
    document.getElementById("choose-iframe").add(option);
}

function check_input_values(){
	if(document.getElementById("report1_name").value != null && document.getElementById("report1_url").value != null)
	{
		return 1;
	}

};


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
};

var tabArray = ["#quick-reports", "#my-folders", "#my-team-folders", "#public-folders"];

function hideRest(tabName){
	
		//document.getElementById("tab-quick-reports").innerHTML = localStorage.getItem("last-tab");
		for (i=0; i < 4; i++){
			if(tabArray[i] != tabName){
				$("tabArray[i]").hide();
			}
		}
};

//}
