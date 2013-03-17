window.SAMPLE = window.SAMPLE || {};

// webkit animation frame
// webkit 
SAMPLE.Test = function(){
	
	var testAnimate = function() {

		$("#box").bind("mouseenter", function(){		
			$("#box").css("background", "#ffcc00").css("width", "200px").css("height", "200px");
		});
		
		$("#box").bind("webkitTransitionEnd", function(){
			$("#box").css("background", "#fff").css("width", "100px").css("height", "100px");
		});
		
		
	};
	
	return {
		init : function(){
			testAnimate();
		}
	}
}();

$(function(){
	SAMPLE.Test.init();
});