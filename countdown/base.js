window.FOC = window.FOC || {};

FOC.serverNow = new Date();

FOC.Global = function(){
		
	var 
		day, minute, hour,  second,
		dd, mm, hh, ss;
	
	/** called every second
	*/
	var updateCountDown = function() {
		ss--; // countdown on second
		if (ss < 0) { 
			ss = 60; // second just looped 1 minute
			mm--;
			if (mm < 0) {
				mm = 60; // minute just looped 1 hour
				hh--;
				if (hh < 0) {
					hh = 24; // hours just looped a day
					dd--;
					// no bounds check i guess
					$(day).html(dd); // days can't loop
				}
				$(hour).html(hh);
			}
			$(minute).html(mm);
		}		
		$(second).html(ss);
	};
	
	/** set up countdown timer
	*/
	var setupCountDown = function(){
		day = $("#day");
		minute = $("#minute");
		hour = $("#hour");
		second = $("#second");
		
		if (!FOC.serverNow) { FOC.serverNow == new Date(); }
		
		now = Date.parse(FOC.serverNow);
		
		var launch  = Date.parse("August 1, 2014 10:00:00"); // kss launch
		var diff = launch - now;

		var days  = Math.floor( diff / (1000*60*60*24) );
		var hours = Math.floor( diff / (1000*60*60) );
		var mins  = Math.floor( diff / (1000*60) );
		var secs  = Math.floor( diff / 1000 );

		dd = days;
		hh = hours - days  * 24;
		mm = mins  - hours * 60;
		ss = secs  - mins  * 60;
		
		day.html(dd);
		hour.html(hh);
		minute.html(mm);
		second.html(ss);
		
		// var test = dd + ' days ' + hh + ' hours ' + mm + ' minutes ' + ss + ' seconds';
		// console.log(test);
		setInterval("FOC.Global.tick()", 1000); // start the count down

	};


	
	return {
		init : function() {	
			setupCountDown();
		},
		tick : function(){
			updateCountDown();
		},
	
	}
}();

$(document).ready(function(){
	FOC.Global.init();
});
	
	