$(document).ready(function(){



const TAB_LIST = ['quick-reports', 'my-folders', 'my-team-folders', 'public-folders'];
const NO_OPEN_TAB = 4;
var CurrentTab = NO_OPEN_TAB; 
const SITE_TABS = [ 'FirstTab', 'SecondTab', 'ThirdTab'];


function on_start_up(){
	

	$(window).unload(function() {
		UpdateStorage( CurrentTab, "LastTab" );
	});

	$(".tab").hide();
	select_tab();

}

function load_settings(){

	var name, url;
	var Storage = GetStorage(); 
	//Storage[TabName] = SiteValue;
	name = localStorage.getItem("reports1_name",$("#report1_name").val());
	url = localStorage.getItem("reports1_url",$("#report1_url").val());
	update_dropdown(url, name);


	name = localStorage.getItem("reports2_name",$("#report2_name").val());
	url = localStorage.getItem("reports2_url",$("#report2_url").val());
	update_dropdown(url, name);

	name = localStorage.getItem("reports3_name",$("#report3_name").val());
	url = localStorage.getItem("reports3_url",$("#report3_url").val());
	update_dropdown(url, name);

	return 0;
}

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

	var ValidEntry = [];
	//var x = document.getElementById("#choose-iframe");
    var option = document.createElement("option");
    option.text = name;
    option.value = url;
    document.getElementById("choose-iframe").add(option);


}

function check_input_values(Site){

	var Entry = $(Site).find("input");
		
	SiteEntry = $(Entry[0]);
	URLEntry = $(Entry[1]);
	
	Name = Entry[0];
	URL = Entry[1];
	
	// both entries are not empty
	if( SiteEntry.val() != "" && URLEntry.val() != "" ) 
	{
		EntryFlag = true;
		// add http:// if doesn't exist
		if( !URL.value.match("^http") )
		{
			var SiteName = 'http://' + URL.value;
		}
		else
		{
			var SiteName = URL.value;
		}
		
		// check url validity
		var url_validate = /^(http:\/\/www\.|https:\/\/www\.)[a-z0-9]+([\-\.]{1}[a-z0-9]+)*\.[a-z]{2,5}(:[0-9]{1,5})?(\/.*)?$/;
		if(!url_validate.test(SiteName))
		{
			alert('invalid URL');
			URLEntry.addClass('red-border');
			return;
		}

		ValidEntry.push({'site':Name.value, 'url':SiteName});
		SiteEntry.removeClass('red-border');
		URLEntry.removeClass('red-border');
	}		
	
	// one of the entries is empty
	if( SiteEntry.val() != "" && URLEntry.val() == "" ) 
	{
		SiteEntry.removeClass('red-border');
		URLEntry.addClass('red-border');
		URL.focus();
		return;
	}
	if( SiteEntry.val() == "" && URLEntry.val() != "" ) 
	{
		URLEntry.removeClass('red-border');
		SiteEntry.addClass('red-border');
		Name.focus();
		return;
	}			

	return 0;			

}


function select_tab () {

	var Storage = GetStorage();
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

	return 0;
};


function GetStorage()
{
		var Storage = localStorage.getItem("webapp");
		if( Storage == null )
		{
			localStorage.setItem( "webapp", JSON.stringify({}) );			
			Storage = localStorage.getItem("webapp");
		}
		return JSON.parse(Storage);
}

function UpdateStorage( SiteValue, TabName )
{
	var Storage = GetStorage(); 
	Storage[TabName] = SiteValue;
	localStorage.setItem("webapp", JSON.stringify(Storage));
}

function SaveSites( SitesForm )
{ 
	var ValidEntry = [];
	var EntryFlag = false;
	var SitesList = $(SitesForm).find(".report"); 

	for (var i = 0; i < SitesList.length; i++) 
	{
		if(check_input_values(SitesList[i]))
			return;
	};

	UpdateStorage( ValidEntry, SITE_TABS[CurrentTab] );			
	if(EntryFlag) 
	{
		UpdateSitesTab(CurrentTab); 
		var TabSelect = $('#' + (TAB_LIST[CurrentTab]));			
	}
	else
	{ 
		var TabSelect = $('#' + (TAB_LIST[CurrentTab]));
		TabSelect.find("iframe").hide(); 
		TabSelect.find("select").hide();
		TabSelect.find(".expand").hide(); 
	}
}


function UpdateSitesTab(TabNumber){

	var Storage = GetStorage();
	var TabSelect = $('#' + (TAB_LIST[TabNumber]));
	var SiteValue = Storage[SITE_TABS[TabNumber]];	
	var SelectFlag = true; 

	if( TabSelect.find("select").length > 0 )
	{
		Value = TabSelect.find("select")[0];
	}
	else
	{
		Value = document.createElement("select"); 
		SelectFlag = false;
	}

	for(var i = Value.options.length-1; i >= 0; i--) 
	{
		Value.remove(i);
	}

	for (var i = 0; i < SiteValue.length; i++) //create new option
	{
		var Site = document.createElement("option");
		Site.value = SiteValue[i].url;
		Site.innerHTML = SiteValue[i].site;
		Value.add(Site);
	};

	if(!SelectFlag)
	{
		TabSelect.find(".inside-tabs").prepend(Value);
		TabSelect.find("select").change(function()
		{
			var TabSelect = $('#' + (TAB_LIST[CurrentTab]));
			var Selected = TabSelect.find("select option:selected");
			TabSelect.find("iframe")[0].src = Selected.val();
		});
	}

	if(TabSelect.find("iframe").length > 0)
	{
		TabIframe = TabSelect.find("iframe")[0];		
	}
	else
	{
		TabIframe = document.createElement("iframe");
		TabSelect.find(".tab-iframe").append(TabIframe);			
	}

	TabIframe.src = SiteValue[0].url;
	TabSelect.find(".expand").show();
	TabSelect.find(".list-form").hide(); 
}
	


load_settings();	
on_start_up();

function hideRest(tabName){
	var storage = GetStorage();

	$(".tab").hide();
	$(".tab-head").css("background-color","#525252");
	$("#quick-reports").show();
	$("#tab-quick-reports").css("background-color","#e6e6e6");
	localStorage.setItem("CurrentTab", tabName);

}

$("#tab-quick-reports").click(function(){
	$(".tab").hide();
	$(".tab-head").css("background-color","#525252");
	$("#quick-reports").show();
	$("#tab-quick-reports").css("background-color","#e6e6e6");
	localStorage.setItem("CurrentTab", "#quick-reports");
	hideRest("#quick-reports");
	return false;
	
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
	$(".tab-head a").css("background-color","#525252");
	$("#public-folders").show();
	$("#tab-public-folders").css("background-color","#e6e6e6");
	localStorage.setItem("last-tab", "#public-folders");
	return false;
	//hideRest("#public-folders");
}); 


$(".settings").click(function(e){
	 e.preventDefault();
	$(".reports-wrapper").toggle();
	//$("#quick-reports-iframe").hide();
	return false;
});


$("#expend").click(function(e){
	 //e.preventDefault();
	newTab($("#quick-reports-iframe").attr("src"));
	return false;
});


$("#save").click(function(){
	var check = [];

	var TabSelect = $('#' + (TAB_LIST[CurrentTab]));
	SaveSites(TabSelect.find("form"));

	return false;
});

$(".cancel").click(function() {
		var TabSelect = $('#' + (TAB_LIST[CurrentTab]));
		TabSelect.find(".list-form").slideUp();
		TabSelect.find(".settings").focus();
	});

$("#choose-iframe").change(function(){
	//var selectedOption = $("#choose-iframe option:selected");
	
	$("option:selected").click($("#quick-reports-iframe").attr("src", "http://"+$("option:selected").attr("value")));
	$("#quick-reports-iframe").show();
	$(".reports-wrapper").hide();
	
});

})
