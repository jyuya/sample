window.DEMO = window.DEMO || {};

DEMO.About = function(){
	var peopleList, peoplePane, paneWidth, paneHeight, paneHorizCenter, paneVerticalCenter, personWidth, moveLeft, moveTop, bumpLine;
	var peopleNav, nameList, previousPersonData, findByName, compass;
	var peopleMax = "958";
	var peopleMin = "474";
	var maxItem = 3;
	var margin = 5;
	var rowCount = 3;
	
	/** center the image list
	*/
	var positionToStart = function(){
	 	paneWidth = parseInt(peopleList.width());		
		paneHeight = parseInt(peopleList.height());		
		paneHorizCenter = paneWidth / 2; 
		paneVerticalCenter = paneHeight / 2;
		personWidth = parseInt($("> li:first", peopleList).height());		
		moveLeft = -1 * (paneHorizCenter - personWidth - margin);
		moveTop = -1 * (paneVerticalCenter - personWidth - margin);	
		
		peopleList.css("left", moveLeft);
		peopleList.css("top", moveTop);
	};
	
	/** shorten the long list, or longen the long list if its opposit day
		return true if the list is long enough to shorten
	*/
	var shortenList = function(person, oppositeDay) {		
		var itemList = $(".personalItems", person);
		if (itemList.length <= 0) { return false; }
		var listItems = $("li", itemList);
		if (listItems.length <= maxItem) { return false; }
		if (oppositeDay) {
			$("li:gt("+ maxItem +")", itemList).show();
			$(".dotdotdot", itemList).remove();
		} else {
			$("li:gt("+ maxItem +")", itemList).hide();
			$(itemList).append('<li class="dotdotdot">...</li>');
		}
		return true;
	};
	
	/** make it big
	*/
	var setPersonSize = function(person, isItBig, personData) {
		var isIt = "false";
		if (isItBig) { isIt = "true"; } 		
		$(person).attr("data-big", isIt);		
		return personData;
	};
	
	/** make it things
	*/
	var setPersonThings = function(person, isItThings, personData) {
		var isIt = "false";
		if (isItThings) { isIt = "true"; } 		
		$(person).attr("data-things", isIt);		
		return personData;
	};
	
	/** set top and left positions for reverting
	*/
	var setPersonPos = function(person, top, left, personData) {
		$(person).attr("data-top", top);
		$(person).attr("data-left", left);		
		personData.moveTop = top;
		personData.moveLeft = left;		
		return personData;
	};
	
	/** change what is shown and hidden in the person's card
	*/
	var togglePersonActions = function(data) {	
		if ($(data.person).attr("data-big") == "true") {				
			$(data.peopleShrink).show();
			$(data.peopleZoom).hide();
		} else {
			$(data.peopleShrink).hide();
			$(data.peopleZoom).show(); 
		}		
		
		if ($(data.person).attr("data-things") == "true") {
			$(data.portrait).fadeIn();			
			$(data.peopleShow).show(); 
			$(data.card).fadeOut();
			$(data.peopleHide).hide();
		} else {
			$(data.portrait).fadeOut();				
			$(data.peopleShow).hide();
			$(data.card).fadeIn();	
			$(data.peopleHide).show();
		}
	};
	
	/** find properties and children of this person element
	*/
	var getPersonData = function(person) {
		var personData = {
			person: person,
			portrait : $("img", person),
			card : $(".card", person),
			cardBox : $("h3", person),
			actions : $(".peopleActions", person),
			peopleShow : $(".peopleShow", person),
			peopleHide : $(".peopleHide", person),
			peopleZoom : $(".peopleZoom", person),
			peopleShrink : $(".peopleShrink", person),
			moveTop : $(person).attr("data-top"),
			moveLeft : $(person).attr("data-left")
		};		
		return personData;
	};
	
	/** expand this card
	*/
	var expand= function(data) {		
		var currentLeft = $(data.person).position().left; 	
		var listTop = $(peopleList).position().top; 
		var listLeft = $(peopleList).position().left; 

		// right most
		if (currentLeft >= bumpLine) {
			$(peopleList).animate({ left: 0, top: listTop - peopleMin }, 500, 'easeOutExpo');	
			listLeft = -1 * (paneWidth - peopleMax + 5);
		} 
		data = setPersonPos(data.person, listTop, listLeft, data);

		$(data.person).animate(
			{ width: peopleMax, height: peopleMax }, 700, 'easeOutExpo',
			function(){
				var offbyTop = $(data.person).offset().top - $(peoplePane).offset().top - 1;
				var offbyLeft = $(data.person).offset().left - $(peoplePane).offset().left -1;							
				$(peopleList).animate({  left: '-='+offbyLeft, top: '-='+offbyTop }, 500, 'easeOutExpo');
			}
		);
		$(data.portrait).animate({ width: peopleMax, height: peopleMax }, 700, 'easeOutExpo');			
		$(data.cardBox).animate({ width: peopleMax, height: peopleMax }, 700, 'easeOutExpo', function(){ 
			$(data.cardBox).css("border", "none");
		});				
		shortenList(data.person, true); // extend the list			
		data = setPersonSize(data.person, true, data);
		togglePersonActions(data); 
		
		return data;
	};

	/** shrink this card
	*/
	var shrink = function(data, noAnimate) {		
		// call back for after the person is shrunk		
		var shrunkPerson = function() {
			var dataTop = $(data.person).attr("data-top"); // find the current offset
			var dataLeft = $(data.person).attr("data-left");
			if (noAnimate) {
				$(peopleList).css("left", dataLeft).css("top", dataTop);
			} else {
				$(peopleList).animate({  left: dataLeft, top: dataTop }, 500, 'easeOutExpo');
			}
		}					
		// call back for after the box is resized
		var shrunkBox = function() { $(data.cardBox).css("border", "solid 1px #ccc"); }		
		
		if (noAnimate) {
			shrunkPerson();
			$(data.person).css("width", peopleMin+"px").css("height", peopleMin+"px");		
			$(data.portrait).css("width", peopleMin+"px").css("height", peopleMin+"px");
			$(data.cardBox).css("width", peopleMin-2+"px").css("height", "420px");
			shrunkBox();
		} else {
			$(data.person).animate({ width: peopleMin, height: peopleMin }, 700, 'easeOutExpo', shrunkPerson);
			$(data.portrait).animate({ width: peopleMin, height: peopleMin }, 700, 'easeOutExpo');	
			$(data.cardBox).animate({ width: peopleMin-2, height: 420 }, 700, 'easeOutExpo', shrunkBox);
		}		
		shortenList(data.person); // shorten the list			
		data = setPersonSize(data.person, false, data);
		togglePersonActions(data); 
		
		return data;
	};

	/** add events to one person
	*/
	var processOnePerson = function(person) {	
		var personData = getPersonData(person); // get the elementsin an array		
		var hasMore = shortenList(person); // test if there is more		
		
		// show the info card instead of things or hide it
		$(personData.peopleShow).bind("click", function(e) { 		
			personData = setPersonThings(person, false, personData);		
			togglePersonActions(personData); 
		});
		$(personData.peopleHide).bind("click", function(e) { 			
			personData = setPersonThings(person, true, personData);
			togglePersonActions(personData); 
		});

		// show the action list
		$(person).bind({
			mouseenter : function(){ $(personData.actions).stop().animate({ right: '1' }, 500, 'easeOutExpo'); },
			mouseleave : function(){ $(personData.actions).stop().animate({ right: '-300' }, 500, 'easeOutExpo'); }
		});		
		var zoomIn = function(e) {
			previousPersonData = null; 			
			personData = setPersonSize(person, true, personData);				
			personData = expand(personData);
		}		
		var zoomOut = function(e) {
			previousPersonData = null;  
			personData = setPersonSize(person, false, personData);
			personData = shrink(personData);
		}
		$(personData.peopleZoom).bind("click", function(e) { zoomIn(e); });
		$(personData.peopleShrink).bind("click", function(e) { zoomOut(e); });
		$(personData.person).bind("dblclick", function(e) {   
			if ($(personData.person).attr("data-big") == "false") { zoomIn(e); } else { zoomOut(e); }
		});
	};
	
	/** set up the name list and bind click functionality
		close previously opened if opening through this
	*/
	var processOneName = function(person) {
		var personName = $("h3", person).html();
		$(nameList).append('<li>' + personName + '</li>');
		var lastName = $('li:last-child', nameList);	
			
		$(lastName).bind("click", function(e){	
			if (previousPersonData) {
				setPersonSize(person, false, personData);
				shrink(previousPersonData, true); //shrink previous if any
			}				
			var personData = getPersonData(person);	
			
			// move the selected person to top left position
			var personTop = ($(person).position().top * -1) + margin;
			var personLeft = ($(person).position().left * -1) + margin;	
							
			$(peopleList).animate({  left: personLeft, top: personTop }, 700, 'easeOutExpo', function(){							
				personData = setPersonSize(person, true, personData);
				personData = setPersonThings(person, true, personData);				
				personData = expand(personData);
				previousPersonData = personData; // save as previous
			});
		});
	};
	
	/** create the nav for peoples names
		add hide/show actions to name list
	*/
	var setupFindName = function() {
		
		var findOn = false;	
		peopleNav.append('<ul id="nameList"></ul>'); // add the name list function
		nameList = $("#nameList", peopleNav);
		
		findByName.bind("click", function(){
			findOn = !findOn;
			if (findOn) {
				nameList.fadeIn();
				peopleNav.addClass("on");
				findByName.html("Hide Names");
			} else {
				nameList.fadeOut();
				peopleNav.removeClass("on");
				findByName.html("Find By Name");
			}
		});
	};
	
	/** setup all the people tile interactions
		create the clickable list of peoples
		make the pane draggable
	*/
	var setupPeople = function() {		
		setupFindName(); // set up the names list holder

		$("> li", peopleList).each(function(i, person){		
			$(person).attr("data-big", "false"); // set the default to small
			$(person).attr("data-things", "true");	// set the default to things being true		
			processOneName(person);	// set up navigate by name		
			processOnePerson(person); // set up person over state
		});	

		// create draggable with boundary detection
		var rightBound = paneWidth/2*-1 - moveLeft - 20;		
		$(peopleList).draggable({
			cursor: 'move',
			stop: function(event, ui) {  
				var bottomBound = -1 * (parseInt(peopleList.height()) - peopleMax + margin);	; // this changes depending on how many expanded								
				if (ui.position.left >= 0) { $(peopleList).css("left", margin+"px"); }
				if (ui.position.left < rightBound) { $(peopleList).css("left", rightBound); }				
				if (ui.position.top >= 0) { $(peopleList).css("top", margin+"px"); }
				if (ui.position.top < bottomBound) { $(peopleList).css("top", bottomBound); } 				
			}
		});
	};
	
	/** find dom elements
	*/
	var findThings = function() {
		peopleList = $("#peopleList");
		peoplePane = $("#peoplePane");
		peopleNav = $("#peopleNav");
		findByName = $("#findByName", peopleNav);
		compass = $("#compass", peopleNav)
	};
	
	return {
		init : function(){
			findThings(); // find relevant dom nodes
			positionToStart(); // center image drag area
			setupPeople();			
		}
	}
}();

/** Fire up the global initialization.
*/
$(document).ready(function(){
	DEMO.About.init();
});