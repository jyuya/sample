/** ################################################################################
 *	global.js
 *	global functionality
 *	julia yu 6/19/2008
 *  ################################################################################
 */

window.clues = window.clues || {};
window.clues.nav = window.clues.nav || {};

/**
 * DEBUGGER FOR EASY TYPING
 */
var debug = function(msg){
	if (debug.on) {
		if (window.console) {
			console.log(msg);
		} else {
 			alert(msg);
		}
	}
	return { on : false } 	// default state of debug is off
}
debug.on = true; 			// turn debug on or off

/** ------------------------------------------------------
 *	this namespace contains the navigation logic
 */
clues.nav = {
	
	prefix : "",
	
	// if a static path is provided, use that, otherwise figure it out from url
	setPrefix : function(){
		if (clues.staticPath) {
			clues.nav.prefix = clues.staticPath + "/";
		} else {
			clues.nav.prefix = new Array(location.pathname.split("/").length - 1).join("../");
		}
	},
	
	// create the preloader and pass it a list of images to load
	setup : function() {
		clues.nav.setPrefix(); // find the prefix
		clues.nav.addRollovers();
	},
	
	// add the roll over states
	addRollovers : function(){
		var branchNav =  document.getById("branchNav");		
		if (!branchNav) {
			return false; // no branch nav
		}
		var myBranches = branchNav.getElementsByTagName("li");
		
		for (var k = 0; k < myBranches.length; k++) {
			var currentBranch = myBranches[k]
			if (currentBranch.id !== "logo"){
				currentBranch.addEventListener("mouseover", clues.nav.onOver, false);
				currentBranch.addEventListener("mouseout", clues.nav.onOut, false);
			}
		}
	},
	
	// on mouse over of crest show ul background image and crest over state
	onOver : function() {
		var path = clues.nav.prefix + "img/global/nav/bg_branch_";
		var bgPos = {
			"janus" : 0,
			"lucian" : 105,
			"ekaterina" : 345,
			"tomas" : 410
		};
		
		var imagePath = path + this.id + ".png";
		if (Flow.Browser.IE6) {
			imagePath = path + this.id + "_ie.png";
		}

		document.getById("branchNav").setStyle("background", "url(" +  imagePath + ") no-repeat " + bgPos[this.id] +"px 0px");
	},
	
	// on mouse out of crest remove background and revert over state
	onOut : function() {
		document.getById("branchNav").setStyle("background", "none");
	}
}

/** ------------------------------------------------------
 *	Page load 
 */

if (window.addEventListener) {
	window.addEventListener("DOMContentLoaded", clues.nav.setup, false);
}

