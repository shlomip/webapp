$(document).ready(function(){

const TAB_LIST = ['#quick-reports', '#my-folders', '#my-team-folders', '#public-folders'];
const QUICK_REPORTS = 0;
const MY_FOLDERS = 1;
const MY_TEAM_FOLDERS = 2;
const PUBLIC_FOLDERS = 3;
const NO_OPEN_TAB = 4;
var Tabs = $(".tab-headers li");
var CurrentTab = NO_OPEN_TAB; 
const SITE_TABS = [ 'FirstTab', 'SecondTab', 'ThirdTab'];

function load_settings(){

	//var name, url;
	var Storage = GetStorage(); 
	/*$(window).unload(function() {
		UpdateStorage( CurrentTab, "LastTab" );
	});*/
	$(".tab").hide();
	$(".expand").hide();
	$("#quick-reports").find(".iframe-build").hide();
	$("#my-team-folders").find(".iframe-build").hide();
	location.hash = Storage.LastTab;
	CurrentTab = Storage.LastTab;
	console.log(CurrentTab);

	//location.hash = TAB_LIST[0];
		// There is no storage
	if(Storage == {})
	{
		location.hash = TAB_LIST[0];
		console.log("empty");
		return;
	}

	if(Storage.LastTab == undefined)
	{
		// open first tab
		console.log(Storage.LastTab);
		location.hash = TAB_LIST[0];
	}
	else	
	{
		// open last active tab
		location.hash = Storage.LastTab;
		CurrentTab = Storage.LastTab;
	}

	// There is storage in the first tab
	if(Storage["FirstTab"] != undefined)
	{
		SitesList = $("#FirstList fieldset");
		for (var i = 0; i < Storage["FirstTab"].length; i++) 
		{
			var SiteValue = $(SitesList[i]).find("input");
			SiteValue[0].value = Storage["FirstTab"][i].site;
			SiteValue[1].value = Storage["FirstTab"][i].url;
		};
		if( Storage["FirstTab"].length > 0 )
			UpdateSitesTab(QUICK_REPORTS);
	}

	// There is storage in the third tab
	if(Storage["ThirdTab"] != undefined)
	{
		SitesList = $("#SecondList fieldset");
		for (var i = 0; i < Storage["ThirdTab"].length; i++) 
		{
			var SiteValue = $(SitesList[i]).find("input");
			SiteValue[0].value = Storage["ThirdTab"][i].site;
			SiteValue[1].value = Storage["ThirdTab"][i].url;
		};
		if(Storage["ThirdTab"].length > 0)
			UpdateSitesTab(MY_TEAM_FOLDERS);
	}
	/*$.ajax({
        type:'GET',
        url: 'C:\Users\shlomi\Documents\GitHub\webapp\data\config.json',
        contentType: 'plain/text; charset=UTF-8',
        dataType: 'json',
        success: function(data){

        },
        error: function(jqXHR, textStatus, errorThrown){

        },
        complete: function(jqXHR, textStatus){

            initConfig($.parseJSON(jqXHR.responseText));
        }
    });*/

	return;
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

function select_tab () {
	for(var i=0; i<TAB_LIST.length; i++){
		if(CurrentTab == TAB_LIST[i])
			location.hash = TAB_LIST[i];
	}
}

function GetStorage(){
	var Storage = localStorage.getItem("webapp");
	if( Storage == null )
	{
		localStorage.setItem( "webapp", JSON.stringify({}) );			
		Storage = localStorage.getItem("webapp");
	}
	return JSON.parse(Storage);
}

function UpdateStorage( SiteValue, TabName ){
	var Storage = GetStorage(); 
	Storage[TabName] = SiteValue;
	localStorage.setItem("webapp", JSON.stringify(Storage));
}

function SaveSites( SitesList ){ 
	var ValidEntry = [];
	var EntryFlag = false;
	//var SitesList = $(SitesForm).find("report"); 
	//console.log(SitesList.length);

	for (var i = 0; i < SitesList.length; i++) {
		var Entry = $(SitesList[i]).find("input");
		//console.log(Enrty);

		SiteEntry = $(Entry[0]);
		URLEntry = $(Entry[1]);
		
		Name = Entry[0];
		URL = Entry[1];

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
			//console.log(Name.value, SiteName);
			SiteEntry.removeClass('red-border');
			URLEntry.removeClass('red-border');
			var option = document.createElement("option");
		    option.text = Name.value;
			option.value = URL.value;
			if(CurrentTab=="#quick-reports"){
				//$(CurrentTab).find(".choose-iframe-select").add(option);
				document.getElementById("choose-iframe").add(option);
			}
			else {//if(CurrentTab=="#my-team-folders"){
				document.getElementById("team-choose-iframe").add(option);
			}
			
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
	};

	UpdateStorage( ValidEntry, CurrentTab );			
	if(EntryFlag) 
	{
		UpdateTabSites(CurrentTab); //CurrentTab == #xxxxx
		var TabSelect = $(CurrentTab);	
		TabSelect.find("select").show();		
		//console.log(TabSelect);
	}
	else
	{ 
		var TabSelect = $(CurrentTab);
		TabSelect.find("iframe").hide(); 
		TabSelect.find("select").hide();
		TabSelect.find(".expend").hide(); 
	}
}

function hideRest(){
	//var storage = GetStorage();

	$(".tab").hide();
	$(".tab-head").css("background-color","#525252");
	$(CurrentTab).show();
	$(CurrentTab).css("background-color","#e6e6e6");
	//localStorage.setItem("CurrentTab", tabName);
	return;
}

load_settings();	

$(window).on('hashchange', function(){
	var TabNumber = TAB_LIST.indexOf(location.hash.slice(1));
	var TabSelect = $(CurrentTab);
	if( CurrentTab != TabNumber){
		TabSelect = $(CurrentTab);
		if( TabNumber == QUICK_REPORTS || TabNumber == MY_TEAM_FOLDERS ){
			TabSelect.find(".settings").focus();
		}
		else{
			TabSelect.find(".expand").focus();
		}
	}
});

$("#tab-quick-reports").click(function(){
	CurrentTab = "#quick-reports";
	location.hash = "quick-reports"
	var Storage = GetStorage();
	Storage.LastTab = CurrentTab;
	console.log(Storage.LastTab);
	$(".tab").hide();
	$(".tab-head a").css("background-color","#525252");
	$("#quick-reports").show();
	$("#tab-quick-reports").css("background-color","#e6e6e6");
	//localStorage.setItem("CurrentTab", "#quick-reports");
	//hideRest("#quick-reports");
	return false;
}); 

$("#tab-my-folders").click(function(){
	CurrentTab = "#my-folders";
	location.hash = "my-folders";
	$(".tab").hide();
	$(".tab-head a").css("background-color","#525252");
	$(".first-tab a").css("background-color","#525252");
	$("#my-folders").show();
	$("#tab-my-folders").css("background-color","#e6e6e6");
	//localStorage.setItem("last-tab", "#my-folders");
	return false;
	//hideRest("#my-folders");
}); 

$("#tab-my-team-folders").click(function(){
	CurrentTab = "#my-team-folders";
	location.hash = "my-team-folders";
	$(".tab").hide();
	$(".tab-head a").css("background-color","#525252");
	$(".first-tab a").css("background-color","#525252");
	$("#my-team-folders").show();
	$("#tab-my-team-folders").css("background-color","#e6e6e6");
	//localStorage.setItem("last-tab", "#my-team-folders");
	return false;
	//hideRest("#my-team-folders");
}); 

$("#tab-public-folders").click(function(){
	CurrentTab = "#public-folders";
	location.hash = "public-folders";
	$(".tab").hide();
	$(".tab-head a").css("background-color","#525252");
	$(".first-tab a").css("background-color","#525252");
	$("#public-folders").show();
	$("#tab-public-folders").css("background-color","#e6e6e6");
	//localStorage.setItem("last-tab", "#public-folders");
	return false;
	//hideRest("#public-folders");
}); 

$(".settings").click(function(e){
	e.preventDefault();
	$(CurrentTab).find(".reports-wrapper").toggle();
	//$("#quick-reports-iframe").hide();
	return false;
});

$(".expend").click(function(e){
	e.preventDefault();
	newTab($("#quick-reports-iframe").attr("src"));
	return false;
});

$(".save").click(function(){
	var SelectedTab = $(CurrentTab);
	console.log(CurrentTab);
	var SitesList = $(CurrentTab).find("form"); 
	SaveSites(SitesList);
	//console.log(SitesList.length);
	return false;
});

$(".cancel").click(function() {
		var TabSelect = $('#' + (TAB_LIST[CurrentTab]));
		TabSelect.find(".list-form").slideUp();
		TabSelect.find(".settings").focus();
});

$("#choose-iframe").change(function(){
	//var selectedOption = $("#choose-iframe option:selected");
	//console.log("test");
	$("option:selected").click($("#quick-reports-iframe").attr("src", $("option:selected").attr("value")));
	$("#quick-reports-iframe").show();
	$(".reports-wrapper").hide();
	
});

})
