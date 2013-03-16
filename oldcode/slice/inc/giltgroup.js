window.GG = window.GG || {};

GG.Global = function(){
	
	var setupTabs = function() {
		var current = $("#giltCurrent");
		var upcoming = $("#giltUpcoming");
		var currentTab = $("#giltTabCurrent a");
		var upcomingTab = $("#giltTabUpcoming a");
		
		currentTab.bind("click", function(e){
			e.preventDefault();
			current.show();
			upcoming.hide();
			$(this).removeClass("off");
			upcomingTab.addClass("off");
		});
		
		upcomingTab.bind("click", function(e){
			e.preventDefault();
			current.hide();
			upcoming.show();
			$(this).removeClass("off");
			currentTab.addClass("off");
		});
	};
	
	var createRollover = function() {
		var myRollover = $("#giltImage");
		
		$("#giltScrollArea li").each(function(i, n){
			
			var src = $("a", this).attr("rel");
			if (src != "undefined") {
				$("a", this).bind("mouseenter", function(e){
					var title = $(".title", this).text();
					$("#hoverTitle", myRollover).text(title);
					$("img", myRollover).attr("src", src);
					$(myRollover).show();
				});

				$("a", this).bind("mouseleave", function(e){
					$("img", myRollover).attr("src", "");
					$(myRollover).hide();
				});
			}
		});
	};
	
	formatNewDate = function(date, format) {
		var monthRef = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
		var monthRef1 = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sept", "Oct", "Nov", "Dec"];
		var weekRef = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
		var weekRef = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

		if(date instanceof Date == false) { return ""; }

		function getDayDegree() {
			var day = date.getDate();
			if( day >= 20 ) day = Number(String(day)[String(day).length-1]); // 10 - 19 all end in "th".

			switch( day ) {
				case 1:
					return "st";
					break;
				case 2:
					return "nd";
					break;
				case 3:
					return "rd";
					break;
				default:
					return "th";
					break;
			}

			return null;
		}

		var dateProp = {
			day: date.getDate(),
			dayDeg: getDayDegree(),
			dayName: weekRef[date.getDay()],
			shortDayName: weekRef[date.getDay()],
			month: date.getMonth()+1,
			monthName: monthRef[date.getMonth()],
			shortMonthName: monthRef1[date.getMonth()],
			shortYear: (date.getFullYear()+"").substring(2),
			fullYear: date.getFullYear(),
			hours: date.getHours(),
			minutes: date.getMinutes(),
			seconds: date.getSeconds(),
			meridien: date.getHours() >= 12 ? "PM" : "AM"
		}		

		format = format.replace(/\%d\%/g, (dateProp.day < 10 ? "0" + dateProp.day : dateProp.day));
		format = format.replace(/\%D\%/g, (dateProp.dayName));
		format = format.replace(/\%sD\%/g, (dateProp.shortDayName));
		format = format.replace(/\%l\%/g, (dateProp.dayDeg));
		format = format.replace(/\%m\%/g, (dateProp.month < 10 ? "0" : "") + (dateProp.month));
		format = format.replace(/\%M\%/g, (dateProp.monthName));
		format = format.replace(/\%sM\%/g, (dateProp.shortMonthName));
		format = format.replace(/\%y\%/g, (dateProp.shortYear));
		format = format.replace(/\%Y\%/g, (dateProp.fullYear));
		format = format.replace(/\%h\%/g, (dateProp.hours < 10 ? "0" + dateProp.hours : dateProp.hours));
		format = format.replace(/\%h\!\%/g, (dateProp.hours));
		format = format.replace(/\%H\%/g, (dateProp.hours > 12 ? dateProp.hours - 12 : dateProp.hours));	
		format = format.replace(/\%HM\%/g, (dateProp.hours > 12 ? dateProp.hours - 12 + dateProp.meridien: dateProp.hours + dateProp.meridien));	
		format = format.replace(/\%mI\%/g, (dateProp.minutes < 10 ? "0" + dateProp.minutes : dateProp.minutes));
		format = format.replace(/\%s\%/g, (dateProp.seconds < 10 ? "0" + dateProp.seconds : dateProp.seconds));

		return format;
	};
	
	monthToInt = function(string) {
		return formatNewDate(new Date(string+"1, 1901"), "%m%") - 1;
	};
	
	var parseDate = function(dateString){	
		var splitDate = dateString.match(/^\w+, (\w+) (\d+)(st|nd|rd|th) at (\d{1,2})\:(\d{1,2}) (AM|PM) (\w+)/);
		var newdate = new Date();
		newdate.setFullYear(newdate.getFullYear(), monthToInt(splitDate[1]), Number(splitDate[2]));	
		var splitNewDate = newdate.toString().split(" ");		
		var adjust = 0;
		var est = false;
		
		if (splitNewDate[6] == "(EST)" || splitNewDate[6] == "(EDT)" ){
			est = true;
		}else {
			var tzn = -newdate.getTimezoneOffset() / 60;
			adj = tzn - (-4);
			est = false;
		}
		
		var hours = Number(splitDate[4]);	
		if ((splitDate[6] == "PM") && (hours < 12)) hours += 12;
		newdate.setHours(hours, 0, 0);
		
		return newdate;
	};
	
	formatDisplayDate = function(date){
		var weekday = new Array;
		weekday = date.split(' ');		

		return weekday[0].substring(3,0) + " "  + parseInt(weekday[4]) + "" + weekday[5];
	};
	
	compareDate = function(dateobject){
		date = new Date();
		if(date > dateobject){
			return true;
		}else {
			return false;
		}
	};
	
	timeRemaining = function(dateobject){
		date = new Date();
		var timeremaining = dateobject - date;
		if (timeremaining <=0){
			return 0;
		} else {
			return timeremaining;
		}
	};
	
	var parseXML = function(xmlDoc) {
		var current = [];
		var future = [];
		var countdown = 100000000000;
		var countdownDate = "";

		$(xmlDoc).find("entry").each(function(){
			
			var start = $(this).find(".start_date").text();			
			var startDate = parseDate(start);
			var isCurrent = compareDate(startDate); 
			var hasImage = $(this).find("p.image").length > 0 ;
			var myTitle = $(this).find("title").text()
			if (myTitle.length > 33){
				myTitle = myTitle.substring(0,30) + "...";
		  	}
		
			if (hasImage) {
				var data = {
					link : $(this).find("link").attr("href"),
					title : myTitle,
					image : $(this).find("p.image img").attr("src"),
					thumbnail : $(this).find("p.image").attr("thumbnail_url"),
					starting : formatDisplayDate(start)
				};
			
				if (isCurrent) {
					current.push(data);
				} else {	
					
					var timeremaining = timeRemaining(startDate); 
					
					if (timeremaining < countdown) {			
						countdown =  timeremaining;
						countdownDate = start;
					}
					future.push(data);
				}
			} //end has image
			
		});
		
		makeCountdown(countdownDate, countdown);
		renderList(true, current);
		renderList(false, future);
	};
	
	var makeCountdown = function(countdownDate, countdown) {
		
		var dateSplit = countdownDate.split(' ');		
		var dateDown = dateSplit[0].substring(3,0) + " at "  + parseInt(dateSplit[4]) + "" + dateSplit[5].toLowerCase() + " " + dateSplit[6];
		$("#giltHeader p").text("New Sales: " + dateDown);
		
		$("#timer").countdown({until: (countdown/1000), format: 'HMS', compact: true});
	};
	
	var renderList = function(isCurrent, list){
		var listParent;
		if (isCurrent) {
			listParent = $("#giltCurrent");
		} else {
			listParent = $("#giltUpcoming");
		}
		
		$(listParent).empty();
		
		$(list).each(function(){
			var desc = ""
			if (isCurrent) {
				desc = "NEW!";
			} else {
				desc = "sale starts " + this.starting;
			}
			
			var node = '<li><a href="' + this.link +'" rel="' + this.image +'" target="_new">';
			node += '<img src="' + this.thumbnail + '" width="60" height="40">';
			node += '<span class="title">' + this.title + '</span>';
			node += '<span class="desc">' + desc + '</span></a></li>';
			
			$(listParent).append(node);
		});
		
		createRollover();
	};
	
	var getFeed = function(){
		$.ajax({
			type: "GET",
			url: "inc/feed.xml",
			dataType: "xml",
			success: function(xml) {
				parseXML(xml);
			}
		});
	};
	
	return {
		initialize : function() {
			setupTabs();
			getFeed();
		}
	}
}();



/**
	Fire up the global initialization.
*/
$(document).ready(GG.Global.initialize);
