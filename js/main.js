$(document).ready(function(){

const TAB_LIST = ['#quick-reports', '#my-folders', '#my-team-folders', '#public-folders', 'no-open-tabs'];
//var TabNumbers = {};
//var TabNumbers = {QUICK_REPORTS:0, MY_FOLDERS:1, MY_TEAM_FOLDERS:2, PUBLIC_FOLDERS:3, NO_OPEN_TAB:4};

var Tabs = $(".tab-headers li");
var CurrentTab = "no-open-tabs"; 
const SITE_TABS = [ 'FirstTab', 'SecondTab', 'ThirdTab'];


function load_settings(){

	//var name, url;
	//e.preventDefault();
	$(".tab").hide();
	$(".expand").hide();
	$("#quick-reports").find(".iframe-build").hide();
	$("#my-team-folders").find(".iframe-build").hide();
	var Storage = GetStorage(); 

	$(window).unload(function() {
		UpdateStorage( CurrentTab, "LastTab" );
	});
	
	//location.hash =  Storage.LastTab;
	CurrentTab = Storage.LastTab;
	$(CurrentTab).show();

	var selected = "";
	switch(CurrentTab){
		case '#quick-reports': selected = "#tab-quick-reports"; break;
		case '#my-folders': selected = "#tab-my-folders"; break;
		case '#public-folders': selected = "#tab-public-folders";break;
		case '#my-team-folders':selected = "#tab-my-team-folders";break;
	}

	$(selected).css("background-color", " rgb(230, 230, 230)");
	//console.log(selected);

	TabNum = Storage.TabNum;
	

	UpdateTabSites("#quick-reports");
	UpdateTabSites("#my-team-folders");
	//console.log("current: "+ CurrentTab);

	//location.hash = TAB_LIST[0];
		// There is no storage
	if(Storage == {})
	{
		location.hash = TAB_LIST["#quick-reports"];
		//console.log("empty");
		return;
	}

	if(Storage.LastTab == undefined)
	{
		// open first tab
	//	console.log(Storage.LastTab);
		location.hash = TAB_LIST[0];
	}
	else	
	{
		// open last active tab
		location.hash = Storage.LastTab;
		CurrentTab = Storage.LastTab;
	}

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
	function function_name (e) {
		// body...
		e.preventDefault();
	};
	var Storage = localStorage.getItem("webapp");
	//console.log("before:"+Storage);
	if( Storage == null )
	{
		localStorage.setItem( "webapp", JSON.stringify({}) );			
		Storage = localStorage.getItem("webapp");
		//console.log("after:"+Storage);
	}
	return JSON.parse(Storage);
}

function UpdateStorage( Value, TabName ){
	var Storage = GetStorage(); 
	Storage[TabName] = Value;
	localStorage.setItem("webapp", JSON.stringify(Storage));
}

function SaveSites(){ 
	var SitesList = $(CurrentTab).find("form"); 
	var ValidEntry = [];
	var Flag = false;

	//console.log(SitesList);
	//var SitesList = $(SitesForm).find("report"); 
	//console.log(CurrentTab);
	for (var i = 0; i < SitesList.length ; i++) {
		var Entry = $(SitesList[i]).find("input");
		//console.log(Enrty);

		NameEntry = $(Entry[0]);
		URLEntry = $(Entry[1]);
		
		Name = Entry[0];
		URL = Entry[1];
		//if(URL.value!=null && Name.value!=null){
		if( NameEntry.val() != "" && URLEntry.val() != "" ){
			Flag = true;
			//console.log(i);
			// add http:// if doesn't exist
			if( !URL.value.match("^http")  )
			{
				var urlVal = 'http://' + URL.value;
				URL.value = urlVal;
				//console.log(urlVal);
			}
			
			// check url
			var url_validate = /^(http:\/\/www\.|https:\/\/www\.)[a-z0-9]+([\-\.]{1}[a-z0-9]+)*\.[a-z]{2,5}(:[0-9]{1,5})?(\/.*)?$/;
			if(!url_validate.test(URL.value))
			{
				alert('invalid URL');
				URLEntry.css("border-color","red");
				return;
			}

			ValidEntry.push({'site':Name.value, 'url':URL.value});
			//console.log(Name.value, SiteName);
			NameEntry.css("border-color","inherit");
			URLEntry.css("border-color","inherit");

			var option = document.createElement("option");
		    option.text = Name.value;
			option.value = URL.value;

			if(CurrentTab=="#quick-reports"){
				//$(CurrentTab).find(".choose-iframe-select").add(option);
				document.getElementById("choose-iframe").add(option);
				console.log(CurrentTab);
			}
			else if(CurrentTab=="#my-team-folders"){
				document.getElementById("team-choose-iframe").add(option);
			}	
			// one of the entries is empty
			if( NameEntry.val() != "" && URLEntry.val() == "" ) 
			{
				NameEntry.css("border-color","red");
				URLEntry.css("border-color","red");
				URL.focus();
				return;
			}
			if( NameEntry.val() == "" && URLEntry.val() != "" ) 
			{
				URLEntry.css("border-color","inherit");
				NameEntry.css("border-color","inherit");
				Name.focus();
				return;
			}					
		}
	}
	//console.log(CurrentTab);

	//UpdateStorage( ValidEntry, SITE_TABS[CurrentTab] );
	UpdateStorage( ValidEntry, TAB_LIST[CurrentTab]);	

	if(Flag) 
	{
		UpdateTabSites(CurrentTab); //CurrentTab == #xxxxx
		$(CurrentTab).find("select").show();
		$(CurrentTab).find(".expend").show(); 	
		$(CurrentTab).find("iframe").show(); 
		$(CurrentTab).find(".reports-wrapper").toggle();
		//console.log(TabSelect);
	}
	else
	{ 
		$(CurrentTab).find("iframe").hide(); 
		$(CurrentTab).find("select").hide(); 
		//TabSelect.find("select").hide();
		$(CurrentTab).find(".expend").hide(); 
	}
	
	//UpdateTabSites(CurrentTab);
}


function UpdateTabSites(Tab){
	var Storage = GetStorage();
	var TabSelect = $(Tab);
	//var SiteValue = Storage[TAB_LIST[Tab]];	
	var SiteValue;
	var SelectFlag = true; 

	if(Tab==  "#quick-reports"){
		 SiteValue = Storage[TAB_LIST["#quick-reports"]];
	}
	else if(Tab=="#my-team-folders"){
		SiteValue = Storage[TAB_LIST["#my-team-folders"]];
	}

	//console.log("sitevalue: " +SiteValue);
	if(SiteValue!=undefined){

		if( TabSelect.find("select").length > 0 ){
			Value = $(Tab).find("select")[0];
			//console.log(Value);
		}
		else{
			//Value = document.createElement("select"); 
			SelectFlag = false;
		}

		for(var i = Value.options.length-1; i >= 0; i--) {
			Value.remove(i);
		}

		var SitesList = $(Tab).find("form"); 

		for (var i = 0; i < SiteValue.length ; i++)
		{
			
			var option = document.createElement("option");
			//console.log(Tab, SiteValue[i]);
			option.value = SiteValue[i].url;
			option.innerHTML = SiteValue[i].site;
			Value.add(option);

		if(i < SitesList.length){
			var Entry = $(SitesList[i]).find("input");

			
				var Name = Entry[0];
				var URL = Entry[1];

				//console.log(URL.value);
				URL.value = SiteValue[i].url;
				Name.value = SiteValue[i].site;
			}
		}

		if(!SelectFlag){
			TabSelect.find(".reports-wrapper").prepend(Value);
			TabSelect.find("select").change(function()
			{
				var TabSelect = $(TAB_LIST[Tab]);
				var Selected = TabSelect.find("select option:selected");
				TabSelect.find("iframe")[0].src = Selected.val();
			});
		}

		if(TabSelect.find("iframe").length > 0){
			TabIframe = TabSelect.find("iframe")[0];		
		}
		else{
			TabIframe = document.createElement("iframe");
			TabSelect.find(".iframe-build").append(TabIframe);			
		}
		if(SiteValue[0]!=null)
		TabIframe.src = SiteValue[0].url;
		//console.log(TabIframe.src);
		TabSelect.find(".expand").show();
		$(Tab).find(TabIframe).show();
	//$(CurrentTab).find("iframe-build").show();
	//TabSelect.find(".list-form").hide(); 
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
	var Tab = TAB_LIST.indexOf(location.hash.slice(1));
	var TabSelect = $(CurrentTab);
	if( CurrentTab != Tab){
		TabSelect = $(CurrentTab);
		if( Tab == "#quick-reports" || Tab == "#my-team-folders" ){
			TabSelect.find(".settings").focus();
		}
		else{
			TabSelect.find(".expand").focus();
		}
	}
});

function tabSelect (tab) {
	// body...
	$(".tab").hide();
	$(".tab-head a").css("background-color","#525252");
	$(".first-tab a").css("background-color","#525252");
	$("#" + tab).show();
	$("#tab-"+ tab).css("background-color","#e6e6e6");

	CurrentTab = "#"+tab;
	location.hash = CurrentTab;
	var Storage = GetStorage();
	Storage.LastTab = CurrentTab;
	//Storage.TabNum = TabNum;
	localStorage.setItem("webapp", JSON.stringify(Storage));

	return;

}

function Search(input) 
{
	var flag = false;
	
	if( SearchTab(input, "#quick-reports")){
		flag = true;
		var SiteNumber = SearchTab(input, "#quick-reports");
		var Tab = "#quick-reports";
		//console.log(Tab);
	}
	else if( SearchTab(input, "#my-team-folders")){
		flag = true;
		var SiteNumber = SearchTab(input, "#my-team-folders");
		var Tab = "#my-team-folders";
		///console.log(Tab);
	}
	// found input
	if(flag) {
		location.hash = Tab; 
		//var TabSelect = $('#' + (TAB_LIST[Tab]));
		var TabSelect = $(TAB_LIST[Tab]);
		TabSelect.find('select').prop('selectedIndex', SiteNumber); 
		TabSelect.find('select').trigger('change');
		$('.notifications').hide();
		TabSelect.find("select").focus();
	}
	else{
		$('.notifications').empty();
		$('.notifications').append('The searched report ' + '\'' + input + '\'' + ' does not exist.')
		$('.notifications').show();
	}
}

function SearchTab(input, Tab) {

	var Storage = GetStorage();
	var Sites = [];

	var SitesList = $(Tab).find("form"); 

	//console.log(SitesList);

	for(var i=0; i< SitesList.length; i++){
		var Entry = $(SitesList[i]).find("input");
		var Name = Entry[0];
		var URL = Entry[1];
		console.log(Name.value);
		if(input==Name.value){
			$(Tab).find("iframe-build").attr("src", URL.value);
			$(Tab).find("iframe-build").show();
			$(Tab).find(".reports-wrapper").hide();
			$(Tab).find("select").focus();
			return 0;
		}
	}
	return 1;
}

$("#tab-quick-reports").click(function(e){
	e.preventDefault();
	tabSelect("quick-reports");
	//location.preventDefault();
	//location.hash = "#quick-reports";
	return false;
}); 

$("#tab-my-folders").click(function(e){
	e.preventDefault();
	tabSelect("my-folders");
	//location.preventDefault();
	//location.hash = "#my-folders";
	return false;
}); 

$("#tab-my-team-folders").click(function(e){
	e.preventDefault();
	tabSelect("my-team-folders");
	return false;
}); 

$("#tab-public-folders").click(function(e){
	e.preventDefault();
	tabSelect("public-folders");
	return false;
}); 

$(".settings").click(function(e){
	e.preventDefault();
	$(CurrentTab).find(".reports-wrapper").toggle();
	//$("#quick-reports-iframe").hide();
	return false;
});

$(".expend").click(function(e){
	e.preventDefault();
	if(CurrentTab=="#my-folders" || CurrentTab=="#public-folders"){
		newTab($(CurrentTab).find(".iframe-build-alone").attr("src"));
	}
	else	
		newTab($(CurrentTab).find(".iframe-build").attr("src"));
	return false;
});

$(".save").click(function(){
	var SelectedTab = $(CurrentTab);
	//console.log(CurrentTab);
	//var SitesList = $(CurrentTab).find("form"); 
	/*for(var i=0; i < SitesList.length; i++){
		var Entry = $(SitesList[i]).find("input");
		if(Entry[0]=="" || Entry[1]=="")
			break;
	}*/
	SaveSites();
	//console.log(SitesList.length);
	return false;
});

$(".cancel").click(function() {
		var TabSelect = $('#' + (TAB_LIST[CurrentTab]));
		$(CurrentTab).find(".reports-wrapper").toggle();
		TabSelect.find(".settings").focus();
		return false;
});

$("#choose-iframe").change(function(){
	//var selectedOption = $("#choose-iframe option:selected");
	//console.log("test");
	$("option:selected").click($("#quick-reports-iframe").attr("src", $("option:selected").attr("value")));
	$("#quick-reports-iframe").show();
	$(".reports-wrapper").hide();
	return false;
	
});

$(".search-box").submit(function(e) {
	e.preventDefault(); 
	var input = $(this).find('input').val();
	Search(input);
	return false;
});
//keyboard navigation
$(".tab form input").keydown(function(e) {
 	if (e.keyCode == 27) 
	{
		var Tab = $(CurrentTab);
    	Tab.find(".cancel").trigger("click");
	}
});
//keyboard navigation
$(".tab form input").keydown(function(e) {
 	if (e.keyCode == 13) 
	{
		var Tab = $(CurrentTab);
    	Tab.find(".save").trigger("click");
	}
});

})
