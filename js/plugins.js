/**
 * JS Library v0
 */

var UTILS = (function () {



    return {
        /**
         * Check if a given value is a plain Object
         *
         * @param  {*}       o Any value to be checked
         * @return {Boolean}   true if it's an Object
         */
        isObject: function (o) {
            var toString = Object.prototype.toString;
            return (toString.call(o) === toString.call({}));
        },



        addEvent: function ( obj, type, handler ) {
            if ( obj.attachEvent ) {
            obj['e'+type+handler] = handler;
            obj[type+handler] = function(){
                obj['e'+type+handler]( window.event );
                };
            obj.attachEvent( 'on'+type, obj[type+handler] );
            } else
            obj.addEventListener( type, handler, false );
        },


        removeEvent: function( obj, type, handler ) {
            if ( obj.detachEvent ) {
                obj.detachEvent( 'on'+type, obj[type+handler] );
                obj[type+handler] = null;
            } else
            obj.removeEventListener( type, handler, false );
        },

        set_tab: function(tab_container_id, tab_id){
        //  Remove class "active" from currently active tab
        $('#' + tab_container_id + ' ul li a').removeClass('tab-active');
 
        //  Now add class "active" to the selected/clicked tab
        $('#' + tab_container_id + ' a[rel="'+tab_id+'"]').addClass("tab-active");
 
        // hide all tabs
        $('#' + tab_container_id + '_content .tab').addClass('hidden');
 
        //  Show the selected tab content
        $('#' + tab_container_id + '_content #' + tab_id).removeClass('hidden');
    },

        get_hash: function(){
        if (window.location.hash) {
            //  Get the hash from URL
            var url = window.location.hash;
            //  Remove the #
            var current_hash = url.substring(1);
            //  activate tab
            UTILS.set_tab('tabs-list', current_hash);

        }
    },

    // Get active tab index
    getSelectedTabIndex: function(TabsList) {
        for (var i = 0; i < TabsList.length; i++) {
        if(TabsList[i].getAttribute('class') == 'tab-active'){
            return i;
        }
        }
    },

    // on keypress navigate through tabs
    TabsKeyNavigation: function(e) {
    var tabslist = document.getElementById("tabs-list").getElementsByTagName("a");
    var selectedTabIndex = UTILS.getSelectedTabIndex(tabslist);
    switch (e.keyCode) {
        case 38:{
                if(selectedTabIndex !== 0 ){
                window.location.hash = tabslist[parseInt(selectedTabIndex) - 1].getAttribute('rel');
                }
            break;
            }
        case 40:{
                if(selectedTabIndex !== tabslist.length - 1 ){
                window.location.hash = tabslist[parseInt(selectedTabIndex) + 1].getAttribute('rel');
                }
            break;
            }
                    }
        },

        quickReportSettingsButton: function(e){

        $(e.target).toggleClass('active');
        $('#quick-reports-settings-form').toggleClass('hidden');
    },

    teamCancelButton: function(e){
        e.preventDefault();
        $('#btnSettings-myteamfolders').click();
    },
    teamSettingsButton: function(e){

        $(e.target).toggleClass('active');
        $('#settings-my-team-folders').toggleClass('hidden');
    },

    quickReportCancelButton: function(e){
        e.preventDefault();
        $('#btnSettings-quickreports').click();
    },

    setIframe: function(val,id){
        $('.iframe-'+id).attr( 'src' , val );
        $('#expand-'+id).attr( 'href', val );
    },
    selectOptionChange: function(e){
        e.preventDefault();
        var target = e.target;
        var optionValue = target.options[target.selectedIndex].value;
        var id = $('#'+target.id).parent().parent().find("form").first().attr('id');
        UTILS.setIframe(optionValue,id);
        
    },
    showSelectButtonAndIframe: function(id){
        $('#bookmarks-' + id + ', .content-' + id + ', #expand-' + id).removeClass('hidden');
    },

    hideSelectButtonAndIframe: function(id){
        $('#bookmarks-' + id + ', .content-' + id + ', #expand-' + id).addClass('hidden');
    },

    saveToLocalStorage: function(){
        if (Modernizr.localstorage) {

            var arr = [];

            $('.frmSettings').each( function(index, element){
                
                $inputsName = $(this).find('input[type="text"]'),
                $inputsUrl = $(this).find('input[type="url"]');
                var formId = $(this).attr('id');
                for (var i = 0; i < $inputsName.length; i++) {

                url = $inputsUrl.eq(i).val();
                name = $inputsName.eq(i).val();
                nameElemId = $inputsName.eq(i).attr('id');
                urlElemId = $inputsUrl.eq(i).attr('id');

                arr.push({
                    formId: formId,
                    name: name,
                    url: url,
                    nameElemId: nameElemId,
                    urlElemId : urlElemId
                });


                }


            
            });

            localStorage.setItem('storage', JSON.stringify(arr));

        }
        else{
            console.log("Browser doesn't support local storage")
        }
    },

        loadFromLocalStorage: function(){
        if (Modernizr.localstorage) {
        var storageData = JSON.parse(localStorage.getItem('storage'));

        if(storageData !== null){
            for(var i=0; i<storageData.length; i++){
                $('#'+storageData[i].nameElemId).val(storageData[i].name);
                $('#'+storageData[i].urlElemId).val(storageData[i].url);
            }
        }



        }
        else{
            console.log("Browser doesn't support local storage")
        }
    },

    submitForm: function(e){
        e.preventDefault();
        var $form = $(e.target),
            $bookmark = $( '#bookmarks-' + $form.attr('id') ).eq(0),
            $inputsName = $form.find('input[type="text"]'),
            $inputsUrl = $form.find('input[type="url"]');

            var nameVal , urlVal, emptyCounter = 0;
            
            //reset bookmark
            $bookmark.find('option').remove();

            for (var i = 0; i < $inputsName.length; i++) {
            url = $inputsUrl.eq(i).val();
            name = $inputsName.eq(i).val();
            

            // check if not empty and add to bookmark
            if(name !== '' && url !== '' ){
                UTILS.addSelectToDropDownList($bookmark,name,url);
            }
            else{
                emptyCounter++;
            }

            }// end for

            // show bookmark - iframe - expand in case emptyCounter is not zero
                if(emptyCounter != 3){

                    $bookmark.focus();
                    UTILS.setIframe($bookmark.children(0).attr('value'), $form.attr('id'));
                    $('#btnSettings-'+ $form.attr('id')).click();
                    UTILS.showSelectButtonAndIframe($form.attr('id'));
                }
                else{
                    $bookmark.find('option').remove();
                    UTILS.hideSelectButtonAndIframe($form.attr('id'));
                }

            UTILS.saveToLocalStorage();

            return true;


    },

    addSelectToDropDownList : function($selectElement ,name,url){
        var $option = $( '<option></option>' );
        $option.attr( 'value',url );
        $option.text(name);
        $selectElement.append($option);
    },

    initRequiredInputsDependencies: function(form){

            var $form = $(form),
            $inputsName = $form.find('input[type="text"]'),
            $inputsUrl = $form.find('input[type="url"]');

            for (var i = 0; i < $inputsName.length; i++) {

            $inputsUrl.eq(i).bind('input', { inputsName: $inputsName, i: i } ,function(e) {
                if( $(this).val() !== '') 
                    e.data.inputsName.eq(e.data.i).prop('required',true);
                else
                    e.data.inputsName.eq(e.data.i).prop('required',false);
            });

            $inputsName.eq(i).bind('input', { inputsUrl: $inputsUrl, i: i } ,function(e) { 
                if( $(this).val() !== '')
                    e.data.inputsUrl.eq(e.data.i).prop('required',true);
                else
                    e.data.inputsUrl.eq(e.data.i).prop('required',false);
            });             

            }


    },

    init: function(){

    $('#btnSettings-quickreports').click(UTILS.quickReportSettingsButton);
    $('#btnSettings-myteamfolders').click(UTILS.teamSettingsButton);
    $('#cancel-quick-reports').click(UTILS.quickReportCancelButton);
    $('#cancel-my-team-folders').click(UTILS.teamCancelButton);
    UTILS.initRequiredInputsDependencies('.frmSettings');
    $('.frmSettings').submit(UTILS.submitForm);

    for(var i = 0; i < 2; i++){
        $('.bookmarks').eq(i).change(UTILS.selectOptionChange);
    }

    UTILS.loadFromLocalStorage();

    }



    
    };


}());

$(document).ready(function(){

 //  Called when page is first loaded or refreshed
    UTILS.get_hash();
    //  Looks for changes in the URL hash
    $(window).bind('hashchange', function(e) {
        e.preventDefault();
        UTILS.get_hash();
    });
    //  Called when we click on the tab itself
    $('#tabs-list ul li').click(function() {
        var tab_id = $(this).children('a').attr('rel');
        //  Update the hash in the url
        window.location.hash = tab_id;
        //  Do nothing when tab is clicked
        return false;
    });

    document.onkeydown = UTILS.TabsKeyNavigation;


    //INITIALIZE EVENTS
    UTILS.init();

    // GET AJAX NOTIFICATION
    
        $.ajax({

            url: 'data/config.json',
            dataType: "json"

        })
        .done(function (response) {
            if (response && response !== '') {
                $('.notifications').removeClass('hidden');
                $('.notifications').text(response.notification);
            }
        });


});
