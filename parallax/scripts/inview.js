/**
 * author Remy Sharp
 * url http://remysharp.com/2009/01/26/element-in-view-event-plugin/
 * julia yu modified version 4/20/2011 
	to work in jquery 1.5 as well as fall back to 1.4
	added horizontal view event inxview
 */
(function ($) {
	
	/** find out the inview elements in this weird hacky way
	*/
	function getViewGroup(){
		var elems = [];		
		 $.each($.cache, function () {
			
			// fall back for jquery 1.4
			if (this.events  ) {
				if (this.events.inview || this.events.inxview) {
					elems.push(this.handle.elem);
				}
            } else {
				// for jquery 1.5
				var that = this;
				$.each(that, function(){
					if (this.events) {
						if (this.events.inview || this.events.inxview) {
		                	elems.push(this.handle.elem);
						}
		            }
				});
			}
			
	     });

		return elems;
	}

	/** get the current window size
	*/
	function getViewportSize(type) {
		var height = window.innerHeight; // Safari, Opera
		var width = window.innerWidth; // Safari, Opera
        var mode = document.compatMode;
        if ( (mode || !$.support.boxModel) ) { // IE, Gecko
            height = (mode == 'CSS1Compat') ?
            	document.documentElement.clientHeight : // Standards
            	document.body.clientHeight; // Quirks
			 width = (mode == 'CSS1Compat') ?
	            document.documentElement.clientWidth : // Standards
	            document.body.clientWidth; // Quirks
        }

		// return switch
		switch(type) {
			case "w":
			  return width;
			  break;
			case "h":
			  return height;
			  break;
			default:
			  return [width, height];
		}
	}
	
	/** window scroll event handler
	*/
    $(window).scroll(function () {
       	var viewSize = getViewportSize();
		var viewH = viewSize[0],
			viewW = viewSize[1],
			scrollleft = (document.documentElement.scrollLeft ?
                document.documentElement.scrollLeft :
                document.body.scrollLeft),
			scrolltop = (document.documentElement.scrollTop ?
				document.documentElement.scrollTop :
				document.body.scrollTop);
        
		var elems = getViewGroup(); // get elements with inview events
		
        $(elems).each(function () {
			var $el = $(this),
				left = $el.offset().left,
	            width = $el.width(),
	            inxview = $el.data('inxview') || false,
	            top = $el.offset().top,
	            height = $el.height(),
	            inview = $el.data('inview') || false;

			// calculation for in horizontal view
			if (scrollleft > (left + width) || scrollleft + viewW < left) {
				if (inxview) {
					$el.data('inxview', false);
					$el.trigger('inxview', [ false ]);                        
				}
            } else if (scrollleft < (left + width)) {
				if (!inxview) {
					$el.data('inxview', true);
					$el.trigger('inxview', [ true ]);
				}
			}

			// calculation for in veritcal view
           if (scrolltop > (top + height) || scrolltop + viewH < top) {
               if (inview) {
                   $el.data('inview', false);
                   $el.trigger('inview', [ false ]);                        
               }
           } else if (scrolltop < (top + height)) {
               if (!inview) {
                   $el.data('inview', true);
                   $el.trigger('inview', [ true ]);
               }
           }
			
		});
 
    });
    
    // kick the event to pick up any elements already in view.
    // note however, this only works if the plugin is included after the elements are bound to 'inview'
    $(function () {
        $(window).scroll();
    });
})(jQuery);
