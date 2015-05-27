window.Parallax = window.Parallax || {};

/** a parallax object for handling one parallax scroller
*/
Parallax.Para = function(){
	
	var name = "defaultPara", // name of this object
		nav,
		navList = [],
		scrollApi,
		scrollPane = false,
		viewGroup, // list of slides in this object
		viewWidth = 0,
		viewHeight = 0,
 		scrollLeft = 0,
		scrollTop = 0,
		animateIndex = {}, // contains all animated objects lookup by slide
		animate = {}, // jui animation store
		adjust = {}, // offset of container
		settings = {}; // this parallax object settings
		
	/** find offset relative to window
	*/
	var findPos = function(obj) {
		if (!obj) { return false; }
		var curleft = curtop = 0;
		if (obj.offsetParent) {
			do {
				curleft += obj.offsetLeft;
				curtop += obj.offsetTop;
			} while (obj = obj.offsetParent);
		}
		//return [curleft,curtop];
		return {
			left : curleft, top : curtop
		}
	}
	
	/** copy one objects property into another
	*/
	var copyInto = function(objectTo, objectFrom) {
		for (var attr in objectFrom) {
		 	if (objectFrom.hasOwnProperty(attr)) {
				objectTo[attr] = objectFrom[attr];
			}
	 	}
		return objectTo;
	}

	/** get the current view port size
	*/
	var getWindowSize = function(type) {
		var height = window.innerHeight, // Safari, Opera
			width = window.innerWidth, // Safari, Opera
    		mode = document.compatMode;
        if ( (mode || !$.support.boxModel) ) { // IE, Gecko
            height = (mode == 'CSS1Compat') ? document.documentElement.clientHeight : // Standards
            	document.body.clientHeight; // Quirks
			 width = (mode == 'CSS1Compat') ? document.documentElement.clientWidth : // Standards
	            document.body.clientWidth; // Quirks
        }
		return {
			w : width, h : height
		};
	}
	
	/** acquire view position and other infos
	*/
	var getView = function(){
		if (settings.container == "window") {
			var viewSize = getWindowSize();
			viewHeight = viewSize.h; 
			viewWidth = viewSize.w;	
		} else {
			viewHeight = $(settings.containerScope).height(); 	
			viewWidth = $(settings.containerScope).width();		
		}
		adjust = findPos($(settings.containerScope)[0]); // find any margin around viewport
	}
	
	/** acquire scroll offset
	*/
	var getScrollPos = function(){
		if (settings.container == "window") {
			scrollLeft = (document.documentElement.scrollLeft ? document.documentElement.scrollLeft : document.body.scrollLeft);
			scrollTop = (document.documentElement.scrollTop ? document.documentElement.scrollTop : document.body.scrollTop);
		} else {
			 if (scrollPane) {
			 	scrollLeft = parseInt(scrollApi.getContentPositionX());
			 	scrollTop = parseInt(scrollApi.getContentPositionY());
			 } else {
				scrollLeft = $(settings.containerScope).scrollLeft();
				scrollTop = $(settings.containerScope).scrollTop();
			 }
		}
	}
	
	// set the object to not inview
	var isInview = function(item, inview){
		if (!inview) {
			$(item).data(settings.viewEvent, true);
			$(item).trigger(settings.viewEvent, [ true ]);
		}
	}
	
	// set the object to inview
	var notInview = function(item, inview){
		if (inview) {
			$(item).data(settings.viewEvent, false);
			$(item).trigger(settings.viewEvent, [ false ]);                        
		}
	}
	
	/**  find out the percentage in view generically
	*/
	var findPercent = function(data){
		var offscreenStart = 0,
			offscreenEnd = 0,
			offscreenTotal = 0,
			percent = 0,
			end = data.start + data.size - data.scroll;
			
		if (data.scroll >= data.start) {
			offscreenStart = data.scroll - data.start;
		}
		if (end > data.viewSize) {
			offscreenEnd = end - data.viewSize;
		}
		offscreenTotal = data.size - offscreenStart - offscreenEnd;
		//percent = Math.abs(Math.ceil((offscreenTotal / viewSize) * 100)); // percent occupying container
		percent = Math.abs(Math.ceil((data.size-(offscreenStart + offscreenEnd)) / data.size * 100)); // percent shown

		$(data.item).trigger(settings.percentEvent, [ percent ]);
		
		if (percent >= settings.percentThreshold ) {
			$(data.item).trigger(settings.allThereEvent, [ true ]);
		} else {
			$(data.item).trigger(settings.allThereEvent, [ false ]);
		}
		
		return percent;
	}
	
	/** inview calculations
	*/
	var findInviewItem = function(data) {
		if ((data.scroll > (data.start + data.size)) || (data.scroll + data.viewSize < data.start)) {
	        notInview(data.item, data.inview);        
	        return 0;
	    } else if (data.scroll < (data.start + data.size)) {
	        isInview(data.item, data.inview);
			var percent =  findPercent(data);
			return percent;
	    }
	}

	/** find inview items by examining the view group
	*/
	var findInview = function(){
		var inviewGroup = {};
		
		$(viewGroup).each(function() {
			var newData = {};
			newData.item = $(this); // current item
			newData.inview = newData.item.data(settings.viewEvent) || false; // inview?
			var pos = findPos($(newData.item)[0]);	// find abs pos to document
			if (scrollPane) {
				pos = $(this).position(); // scroll pane is kind of messed up
			} 

	        if (settings.direction == "vertical") {
				newData.start = pos.top - adjust.top;
				newData.size = $(newData.item).height();
				newData.scroll = scrollTop;
				newData.viewSize = viewHeight;
			} else {
				newData.start = pos.left - adjust.left,
			 	newData.size = $(newData.item).width();
				newData.scroll = scrollLeft;
				newData.viewSize = viewWidth;
			}
			
			// save this percent
			var id = $(newData.item).attr("id");
			var foundItem = findInviewItem(newData);
			inviewGroup[id] = foundItem;
		});
		
		$(nav).trigger(settings.groupPercentEvent, [ inviewGroup ]);
	}

	/** calculations for moving of parallax object
		scrollControl is the scroll direction trigger for animating
	*/
	var calculateX = function(data, scrollControl) {
		var result = -((viewWidth + scrollControl) - data.offsetX) * data.inertia - data.startX;
		if (data.xdir.toLowerCase() === "right") {
			result = result * -1;
		}
		return result;
	}
	
	var calculateY = function(data, scrollControl) {
		var result = -((viewHeight + scrollControl) - data.offsetY) * data.inertia - data.startY;
		if (data.ydir.toLowerCase() === "down") {
			result = result * -1;
		}
		return result;
	}
	
	/** move parallax objects
	*/
	var moveItem = function(data) {
		var newPos = { left : data.startX, top : data.startY }; 
		
		// fix offset used in equation
		if (data.left == 0) {
			data.offsetX = viewWidth;
		} else {
			data.offsetX = data.left;
		}
		if (data.top == 0) {
			data.offsetY = viewHeight;
		} else {
			data.offsetY =  data.top;
		}

		// find out which scroll direction controls the animation
		var scrollControl = scrollTop; 
		if (settings.direction == "horizontal") {
			scrollControl = scrollLeft;
		} 
	
		// figure out how much to move the X
		if (data.animateX) {
			newPos.left = calculateX(data, scrollControl);
			if (data.offby > 0) {
				if (settings.direction == "horizontal") {
					newPos.left = newPos.left - (viewWidth * data.inertia);
				} else {
					newPos.left = newPos.left - (data.offby * data.inertia); 
				}
			}
		}
		
		// figure out how much to move the Y
		if (data.animateY) {
			newPos.top = calculateY(data, scrollControl);
			if (data.offby > 0) {
				if (settings.direction == "horizontal") {
					newPos.top = newPos.top - (data.offby * data.inertia);
					
				} else {
					newPos.top = newPos.top - (viewHeight * data.inertia);
				}
			}
		}
		
		// set the pos
		if (animate[data.name]) { animate[data.name].stop(); } // stop previous animation if any
		
		if (data.render == "bg") {
			animate[data.name] = $(data.item).animate(
				{ backgroundPosition: newPos.left + "px " + newPos.top + "px" }, 
				{ queue:false, duration: data.speed, easing: data.easing }
			);
		} else {
			animate[data.name] = $(data.item).animate(
				{ "top" : newPos.top, "left" : newPos.left }, 
				{ queue:false, duration:data.speed, easing: data.easing }
			);
		}

	}
	
	/** move parallax objects
	*/
	var move = function() {
		$(viewGroup).each(function(i, slide) {
			// only look at inview items to move
			if ($(slide).hasClass(settings.viewEvent)) {
				var slideName = $(slide).attr("id");
				var animateObjects = animateIndex[slideName]; // look up animation todo list
				for (var itemName in animateObjects) {
					var data = animateObjects[itemName];
					if (data) {
						moveItem(data);
					}
				}
			}
		});
	}
	
	/** the view has resized
	*/
	var onViewResize = function() {
		getView();
		findInview();
		if (scrollPane) {
			scrollApi.reinitialise();
			
		}
	}
	
	/** view scrolling happened
	*/
	var onViewScroll = function() {
		getScrollPos();
		findInview();
		move();
	}
	
	/** bind this view event type when view group item is showing on screen
	*/
	var bindViewEvent = function(eventType) {
		$(viewGroup).bind(eventType, function (event, visible) {
			if (visible == true) {
				$(this).addClass(eventType);
			} else {
				$(this).removeClass(eventType);
			}
		});
	}
	
	/** put animations into starting position
	*/
	var startingPosition = function(data){
		if (data) {
			var x = data.startX;
			var y = data.startY;
			
			// if we are animating the x axis and scrolling vertically do fixs
			if (data.animateX) {
				if (settings.direction == "vertical") {
					x = data.startX - data.offby * data.inertia;
				} 
			}
			
			if (data.animateY) {
				if (settings.direction == "horizontal") {
					x = data.startX - data.offby * data.inertia;
					y = data.startY - data.offby * data.inertia;
				} 
			}
			
			if (data.render == "bg") {
				$(data.item).css("backgroundPosition", x + "px" + " " + y +"px");
			} else {
				$(data.item).css("top", y + "px");
				$(data.item).css("left", x + "px");
			}
			
		}
	};
	
	/** put data into animation index
	*/
	var populateIndex = function(data){
		var slideName = data.slideName;
		var itemName = data.itemName;
		var animationUsed = $(data.item).attr("data-animate") || data.itemName; // find animation name
		var slidePos = findPos(data.slide);
		
		animateIndex[slideName] = animateIndex[slideName] || {}; // populate slide
		
		// find animation data and make sure it's filled out
		var animateData =  Parallax.Animate[animationUsed];
		if (!animateData) {
			return false;
		}
		
		animateData.animate = animateData.animate || "y";	
		animateData.xdir = animateData.xdir || "right";
		animateData.ydir = animateData.ydir || "up";
		animateData.render = animateData.render || "foreground";
		animateData.easing = animateData.easing || "linear";
		animateData.speed = animateData.speed || 500;
		animateData.startX = animateData.startX || 0;
		animateData.startY = animateData.startY || 0;
		animateData.inertia = animateData.inertia || 0.5;
		animateData.offsetX = animateData.offsetX || 0;
		animateData.offsetY = animateData.offsetY || 0;
		
		var moreData = {
			name : itemName,
			use : animationUsed,
			top : slidePos.top,
			left : slidePos.left,
			animateX : (animateData.animate.indexOf("x") >= 0),
			animateY : (animateData.animate.indexOf("y") >= 0)
		}
		
		// copy all this data into the animate index
		animateIndex[slideName][itemName] = animateIndex[slideName][itemName] || {};
		animateIndex[slideName][itemName] = copyInto(animateIndex[slideName][itemName], animateData);
		animateIndex[slideName][itemName] = copyInto(animateIndex[slideName][itemName], data);
		animateIndex[slideName][itemName] = copyInto(animateIndex[slideName][itemName], moreData);

		startingPosition(animateIndex[slideName][itemName]); // find starting postiion
	};
	
	/** fill the nav according to how much percent of something is in view
	*/
	var fillNav = function(event, data) {
		var previous = false;
		for (myName in data) {
			var thisSpan = $('li a[href="#' + myName +'"] span', nav);
			// some percent exist
			if (data[myName] > 0) {
				// figure out which direction we are going
				var start, end, property, percent;
				if (settings.navDirection == "vertical") {
					start = "top";
					end = "bottom";
					property = "height";
				} else {
					start = "left";
					end = "right";
					property = "width";
				}
				// calculate percent or fill to full
				if (settings.navPercent) {
					if (previous) {
						$(thisSpan).css(start, "0px").css(end, "auto");
					} else {
						$(thisSpan).css(start, "auto").css(end, "0px");
					}
					percent = data[myName] + "%";
				} else {
					percent = 100 + "%";
				}
				$(thisSpan).css(property, percent).css("display", "block");
				previous = true;
				
			// no percent in view, make it not show
			} else {
				$(thisSpan).css("display", "none");
				previous = false;
			}
		}
	}
	
	/** set up gloval variables of this parallax object
	*/
	var setupEvents = function(){
		bindViewEvent(settings.viewEvent);	// detect item in viewport
		
		if (settings.container === "window") {
			$(window).scroll( onViewScroll );	// detect scroll
		} else {
			$(settings.containerScope).scroll( onViewScroll );		
		}
		
		$(window).resize( onViewResize );
		
		// the navigation is subscribed to group percent even instead of individual events
		$(nav).bind(settings.groupPercentEvent, fillNav);
	}
	
	/** set up custom events and handlers specific to this object
	*/
	var setupCustom = function() {
		$(viewGroup).bind(settings.percentEvent, function (event, percent) {
			$(".inviewPercentage:first", this).html(percent + "%");
		});
	}
	
	/** set up setting variables of this parallax object
	*/
	var setupVariables = function(newSet){
		settings = newSet; // init settings
		name = settings.name; // this parallax object name
		viewGroup = settings.viewGroup;
	
		// set default values for parallax if no exist
		settings.container = settings.container || "window";
		settings.direction = settings.direction || "vertical";
		settings.viewEvent = settings.viewEvent || "inview";
		settings.navDirection = settings.navDirection || "vertical";
		settings.navPercent = settings.navPercent || false;
		settings.navName = settings.navName || ".viewNav";
		settings.percentEvent = name + "Percent"; // event fired on calculating percent
		settings.allThereEvent = name + "AllThere"; // event fired on slide all in view
		settings.groupPercentEvent = name + "GroupPercent"; // event fired on slide all in view
		settings.percentThreshold = settings.percentThreshold || "100"; // set threshold for event default 100% there
		settings.animateObject = settings.animateObject || "hasAnimation";
		settings.containerScope = settings.container;
		
		if (settings.container === "window") {
			settings.containerScope = document; 	// the scope can not be window which is annoying
			settings.navScope = settings.navScope || document;
		} else {
			settings.navScope = settings.navScope || settings.container;
			settings.navScope = $(settings.navScope);
		}

		// find the nav
		nav = $(settings.navName + ":first", settings.navScope);
		$(nav).localScroll({ axis: "xy", target: $(settings.containerScope)});
		
		$("li", nav).each(function(k, item){
			navList[k] = item;
		});
		
		var offby = 0;
		// get every animation object ever
		$(viewGroup).each(function(i, slide) {
			var newData = { 
				slideName : $(slide).attr("id") || ("slide_" + i),
				slide : slide,
				offby : offby
			}
			
			// if this slide is to be animated insert it here
			if ($(slide).hasClass(settings.animateObject)) {
				newData.item = slide;
				newData.itemName = newData.slideName; // a slide animation has itself as item name
				populateIndex(newData);
			}
			
			// find first level animation objects for this slide
			var animateObjects = $("." + settings.animateObject, slide).not($(".hasPara ." + settings.animateObject, slide));
			$(animateObjects).each(function(j, item) {
				
				newData.item = item;
				newData.itemName = $(item).attr("id") || ("item_" + i + "_" + j);
				populateIndex(newData);
			});

			// store the offset in order of slides
			if (settings.direction == "vertical") {
				offby = offby + $(slide).height(); 
			} else {
				offby = offby + $(slide).width(); 
			}
		});
		getView(); // find out about the view port on start	
		
		// find out if this parallax object has scroll pane applied
		if ($(settings.thisPara).hasClass("scroll-pane")) {
			scrollPane = true;
			var pane = $(settings.thisPara);
			pane.jScrollPane({
				animateScroll: true,
				animateDuration: 650,
				animateEase: "easeOutExpo",
				hijackInternalLinks: true
			});
			scrollApi = pane.data('jsp');
		}	
	}
	
	// public methods
	return {
		initialize : function(newSet){
			setupVariables(newSet);
			setupEvents();
			setupCustom();
			// do a kick start for inview
			findInview();
			move();
		}
	}

};

/** set up all parallax
*/
Parallax.Main = function(){
	var ParaPara = {}; // collection of para objects saved for later use?
	
	var setupEveryParallax = function(){
		$(".hasPara").each(function(count){
			var thisName = $(this).attr("id") || "defaultWindow"; // if no id, parallax name is defaultwindow
			var thisSetting =  Parallax.Setting[thisName] || null; // check if this has settings
			
			// if we have a setting start making objects
			if (thisSetting !== null) {
				thisSetting.viewClass = thisSetting.viewClass || ".viewGroup";	// over ride default parallax classes
				thisSetting.viewItemClass = thisSetting.viewItemClass || ".viewGroupItem";
				thisSetting.viewGroup = $(thisSetting.viewClass + ":first > " + thisSetting.viewItemClass + "", this);
				thisSetting.thisPara = this;
				
				// make objects if we have an associated viewgroup
				if (thisSetting.viewGroup.length) {
					thisSetting.name = thisName;
					ParaPara[thisName] = new Parallax.Para();
					ParaPara[thisName].initialize(thisSetting);	
				}				
			}
		});
	}

	return {
		initialize : function(){
			setupEveryParallax();
		}
	}		
}();

/**
	Fire up the global initialization.
*/
$(document).ready(Parallax.Main.initialize);
