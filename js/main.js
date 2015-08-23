
var EventHandler = {
    bind:function(el, ev, fn){
        if(window.addEventListener){ // modern browsers including IE9+
            el.addEventListener(ev, fn, false);
        } else if(window.attachEvent) { // IE8 and below
            el.attachEvent('on' + ev, fn);
        } else {
            el['on' + ev] = fn;
        }
    },
 
    unbind:function(el, ev, fn){
        if(window.removeEventListener){
            el.removeEventListener(ev, fn, false);
        } else if(window.detachEvent) {
            el.detachEvent('on' + ev, fn);
        } else {
            elem['on' + ev] = null; 
        }
    },
 
    stop:function(ev) {
        var e = ev || window.event;
        e.cancelBubble = true;
        if (e.stopPropagation) e.stopPropagation();
    }
}

if (document.addEventListener) {

	    var addEvent = function(elem, type, handler) {

	        elem.addEventListener(type, handler, false)

	    }

	    var removeEvent = function(elem, type, handler) {

	        elem.removeEventListener(type, handler, false)

	    }

	} else {

	    var addEvent = function(elem, type, handler) {

	        elem.attachEvent("on" + type, handler)

	    }

	    var removeEvent = function(elem, type, handler) {

	        elem.detachEvent("on" + type, handler)

	    }

	}

 
addEvent(elem, "click", function() { alert('hi') })
