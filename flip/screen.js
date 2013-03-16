window.SYFY = window.SYFY || {};

SYFY.Hex = function(){
	var Z_INDEX_BACK = 4,
		Z_INDEX_FRONT = 5,
		FLIP_SPEED = 2000,
		FADE_SPEED = 500,
		AUTO_FLIP = 40000,
	
		need,
		want,
		hex, 
		currentSide,
		oppositeSide,
		
		front = true,
		animating = false,	
		isNew = false,	
			
		flipSideFlags = [
			'currentFlipped',
			'oppositeFlipped',
			'currentFaded',
			'currentReverted',
			'oppositeReverted'
		], 
		
		flipReplaceFlags = [			
			'hexFlipped',
			'hexReverted'
		],
		
		flag = {
			currentFlipped : false,
			oppositeFlipped : false,
			hexFlipped : false,
			currentFaded : false,
			oppositeFaded : false,
			currentTextFaded : false,
			oppositeTextFaded : false,		
			currentReverted : false,
			oppositeReverted : false,
			hexReverted : false	
		},
		
		animateDone = "hexAnimateDone_",
		allAnimateDone = "hexAllAnimateDone_",
		animateType = 'flipSide', 
		animateLookup = {
			'flipSide' : flipSideFlags,
			'flipReplace' : flipReplaceFlags
		},
			
		timeout,
		interval,
		replaceQueue = new Array(), // a queue for all replacement events
		id,
		thisFlip;
		
	// figure out which side we are on and set current
	var setSide = function() {
		if (front) {
			currentSide = need;
			oppositeSide = want;
		} else {
			currentSide = want;
			oppositeSide = need;
		}
	};
	
	// see if ALL of the flags are done
	var testDone = function() {
		var done = true;
		$(animateLookup[animateType]).each(function(n, flagType){
			if (!flag[flagType]) {
				done = false;
				return done; // one of them is not done, return
			}
		});
		return done;
	};
	
	// reset all flags to not done
	var resetFlags = function() {	
		$.each( flag, function( key ) {
			flag[key] = false;
		});
	};
	
	// listen until all animation is done
	var handleAnimateDone = function(){		
		var done = testDone();	
		if (done) {			
			resetFlags();			
			$(currentSide).css("z-index", Z_INDEX_FRONT);
			$(oppositeSide).css("z-index", Z_INDEX_BACK);
			$(oppositeSide).show();
			
			// something special for flip side
			if (animateType == "flipSide") {					
				$(".flipContent", currentSide).fadeIn(
					FADE_SPEED/2, 
					function(){
						animating = false; // all animation have finished			
						$(thisFlip).trigger(allAnimateDone);
					}
				);
			}
			
			// something special for flip replace
			if (animateType == "flipReplace") {
				$(currentSide).show();
				$(".flipContent", hex).fadeIn(
					FADE_SPEED/4, 
					function(){
						animating = false; // all animation have finished			
						$(thisFlip).trigger(allAnimateDone);
					}
				); 
			}		
		}
	};
	
	/** all animations are done, see if there are stuff queued up
	*/
	var handleAllAnimateDone = function() {
		// console.log(id +" all animation is done! front is " + front);
				
		if (replaceQueue.length > 0) {
			// console.log(id +" something is in replace queue! 1/" + replaceQueue.length);
			var qItem = replaceQueue.pop();		
			replaceFlip(qItem);  
		}		
	};
	
	/** remove any flip effects from front sides
	*/
	var resetCurrentFlip = function() {
		$(currentSide).transition({ duration: 1, rotateY: '0deg', rotateX: '0deg',
		}, function(){
			flag.currentReverted = true;
			$(thisFlip).trigger(animateDone);
		});
	};

	/** remove any flip effects from back sides
	*/
	var resetOppositeFlip = function() {
		$(oppositeSide).transition({ duration: 1, rotateY: '0deg', rotateX: '0deg',
		}, function(){
			flag.oppositeReverted = true;
			$(thisFlip).trigger(animateDone);
		});
	};
	
	/** remove any flip effects from hex
	*/
	var resetHexFlip = function() {
		$(hex).transition({ duration: 1, rotateY: '0deg', rotateX: '0deg',
		}, function(){
			flag.hexReverted = true;
			$(thisFlip).trigger(animateDone);
		});
	};

	var flipSideTrans = function(flipSide, flipComplete){
		$(flipSide).transition({
			easing: 'easeOutExpo',
			duration: FLIP_SPEED,
		    rotateY: '180deg',
			queue: false
		}, flipComplete);
	};
	
	var doSideFlip = function() {
		animateType = "flipSide";
		animating = true;
		
		// fade the front side for transition effect
		$(currentSide).fadeOut({ 
			duration: FLIP_SPEED/2,  
			queue: false, 
			complete: function(){
				flag.currentFaded = true;
				$(thisFlip).trigger(animateDone);
			}
		}); 	
		
		// fade the text so it can not be seen from other side
		$(".flipContent",currentSide).fadeOut({ 
			duration: FLIP_SPEED/2, 
			queue: false
		}); 
		
		// flip this side
		flipSideTrans(currentSide, function(){
			front = !front; // flipped
			setSide(); // update current vars
			flag.currentFlipped = true,
			$(thisFlip).trigger(animateDone);
			resetCurrentFlip(); // reset to no rotation
		}); 
		
		// flip other side at the same time
		flipSideTrans(oppositeSide, function(){
			flag.oppositeFlipped = true;
			$(thisFlip).trigger(animateDone);
			resetOppositeFlip();
		});
	};
	
	/** do a sideways flip
	*/
	var sideFlip = function() {		
		if (animating) { return false; } // no flippy if we are already doing something
		
		if (isNew) {
			isNew = false;
			$(hex).fadeOut(FADE_SPEED/4, function(){
				$(hex).remove();
				doSideFlip();
			})
		} else {
			doSideFlip();
		}
	}	
	
	/** do a barrel roll
	*/
	var replaceFlip = function(newMessage) {			
		if (isNew) { $(hex).remove(); } // remove previous news if any
		
		timeout = setTimeout(setupTimedFlip, 10000);
		
		animateType = "flipReplace";
		animating = true;
		isNew = true;

		$(oppositeSide).hide(1, resetOppositeFlip); 
		
		// insert a temp hex to indicate new
		var hexTemplate = $("#placeholder .hex").clone(); 
		$(thisFlip).append(hexTemplate);
		hex = $(".hex", thisFlip);
		
		$(hex).fadeIn(FADE_SPEED/2, function(){
			$(currentSide).hide(1, resetCurrentFlip); 
			
			$(hex).transition({
				easing: 'easeOutExpo',
				duration: FLIP_SPEED,
			    rotateX: '360deg',
				queue: false
			}, function() {
				$(".flipContent p", need).html(newMessage.need);
				$(".flipContent p", want).html(newMessage.want);	
				$(".flipContent", hex).html($(".flipContent", currentSide).html());
				
				flag.hexFlipped = true,
				$(thisFlip).trigger(animateDone);	
				resetHexFlip();	
				
				// reset time on flip
				clearInterval(interval);
				interval = setInterval(function() { sideFlip(); }, AUTO_FLIP);
			});
			
		});		
	};
	
	// testing on click - should be on timer really
	var setupClick = function() {
		$(thisFlip).click(function(){
			sideFlip();
		});
	};
	
	/** flip things on a timer
	*/
	var setupTimedFlip = function(){
		clearTimeout(timeout);
		sideFlip(); // flip right away
		
		interval = setInterval(function() { sideFlip(); }, AUTO_FLIP);
	}
	
	/** find components of this flip
	*/
	var findFlipComponents = function() {
		need = $(".need", thisFlip);
		want = $(".want", thisFlip);
		setSide();		
		$(thisFlip).bind(animateDone, handleAnimateDone); // listen for ANY animation finished
		$(thisFlip).bind(allAnimateDone, handleAllAnimateDone); // listen for ALL animation finished
	};
	
	return {
		init : function(flip, flipCount, timeWait){
			thisFlip = flip;
			id = flipCount;
			animateDone = animateDone + id; // any animation done event
			allAnimateDone = allAnimateDone + id; // all animation done event
			findFlipComponents();
			
			timeout = setTimeout(setupTimedFlip, timeWait);
		},
		
		replace : function(newMessage){
			// console.log(id + " getting message " + newMessage.need + " " + newMessage.want);
			
			if (animating) {
				replaceQueue.push(newMessage);
			} else {
				replaceFlip(newMessage);
			}

		}
	}
};

/** find all the flippable elements on the page and create
	a flip object for all of them
 */
SYFY.Flip = function(){
	var	flips, 
		flipLookup = {},
		isScreen1,
		isScreen2;
	
	/** ---  create flips
	*/
	var setup = function(){	
		flips = $(".flip");		
		isScreen1 = $("#screen1").length;
		isScreen2 = $("#screen2").length;
				
		flips.each(function(n, flip){
			
			var thisID = $(flip).attr("id");
			if (thisID) {
				thisID = thisID.replace("f", "");			
				var newFlip = new SYFY.Hex();
			
				var timeWait = Math.floor(Math.random() * 10000 + 1);
			
				newFlip.init(flip, thisID, timeWait);

				flipLookup[thisID] = newFlip;
			}
			
		});
		

		
		$("#insert").click(function(e){
			e.preventDefault();
					
					flipLookup[4].replace({
						need: "i just added this",
						want: "i just added this other side"
					});
		});
		
	};

	var update = function(data) {		
		if (!data) { return false; }
		data = jQuery.parseJSON(data);
		
		// console.log("got pos " + data.position + " is screen 1 " + isScreen1 + " is screen 2 " + isScreen2);
		
		if ((data.position > 16) && (isScreen2 > 0)) {
			flipLookup[data.position].replace({
				need: data.need,
				want: data.want
			});
		}
		
		if ((data.position < 17) && (isScreen1 > 0)) {
			flipLookup[data.position].replace({
				need: data.need,
				want: data.want
			});
		}

	};

	return {
		init : function() {	
			setup();
		},
		updateFlip : function(data) {
			update(data);
		}
	}
}();

$(function() {
    SYFY.Flip.init();
});