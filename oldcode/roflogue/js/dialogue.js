/** ################################################################################
 *	dialogue.js
 *	
 *	julia yu 9/18/2008
 *  ################################################################################
 */

window.clues.dialogue = window.clues.dialogue || {};

/** ------------------------------------------------------
 * enable dialogue nodes
 */
clues.dialogue = {
	/**
	 * set up the dialogue animation, ingest the content, listen for "next" click
	 */
	setup : function() {
		clues.dialogue.getDialogue();
		
		clues.dialogue.q = {
			box : document.getById("question"), 
			speaker : document.getById("npc"),
			maxChar : 35, 	// maximum per line
			minChar : 20, 	// shrink to this char count 
			shrinkTo: 150, 	// shrink to this width
			width : 300,
			startTop : 151,
			startLeft : 384,
			endTop : 151,
			endLeft : 384
		}	
		clues.dialogue.a = {
			box : document.getById("answer"),
			speaker : document.getById("player"),
			maxChar : 35,	// maximum per line
			minChar : 20,	// shrink to this char count 
			shrinkTo: 150,	// shrink to this width
			width : 300,
			startTop : 298,
			startLeft : 513,
			endTop : 298,
			endLeft : 513
		}
		
		clues.dialogue.item = 0; 		// count what line of dialogue we are on
		clues.dialogue.lHeight = 25; 	// height allotted to one line of text
		clues.dialogue.duration = 0.5;	// animation timer
		
		clues.dialogue.nextB = document.getById("next");
		clues.dialogue.nextB.addEventListener("click", clues.dialogue.prepareReply, false);
		clues.dialogue.show();
	},
	
	/**
	 * parse list of dialogue into an array
	 */
	getDialogue : function() {
		var myDialogue = document.getById("nodeText");
		myDialogue.setStyle("display", "none"); 		// hide the text since js is enabled
		clues.dialogue.nodeText = [];
		var myList = myDialogue.getByTag("li");
		for (var i=0, max=myList.length; i<max; i++) {
			clues.dialogue.nodeText.push(myList[i].innerHTML);
		}
		clues.dialogue.maxLines = clues.dialogue.nodeText.length; // keep track of max lines
	},

	/**
	 * event handler for when next is clicked
	 */
	prepareReply : function(){
		clues.dialogue.item++;
		if (clues.dialogue.item < clues.dialogue.maxLines) {
			clues.dialogue.show();
		} 
		if (clues.dialogue.item  === (clues.dialogue.maxLines-1)) {
			clues.dialogue.nextB.innerHTML = ""; // hide next we are at the end
		} 
	},
	
	/**
	 * calculate height of the text area
	 * charCount - how many characters in current text
	 * maxLength - max characters before wrap
	 */
	calculateHeight : function(text, maxLength){
		text = text.replace(/<span>.*<\/span>/,'');
		var charCount = text.length;
		var lines = parseInt(charCount/maxLength) + 2;	// additional space for player or npc name
		var boxHeight = lines * clues.dialogue.lHeight + 70;
		return boxHeight;
	},
	
	/**
	 * animate the box
	 */
	animateBox : function(dialogue, text){
		var height = clues.dialogue.calculateHeight(text, dialogue.maxChar);
		
		var animation = Flow.Animate({
			node : dialogue.box,
			from : {
				width: 0,
				height: 0,
				top: dialogue.startTop,
				left: dialogue.startLeft,
				opacity: 0
			},
			to : {
				width : dialogue.width,
				height : height,
				top : dialogue.endTop,
				left : dialogue.endLeft,
				opacity : 100
			},
			tween : Flow.Animate.equations.Expo.easeInOut
		}, clues.dialogue.duration).start();
		
		
		
		clues.dialogue.displayDialogue(dialogue, text);
	},
	
	fadeBox : function(dialogue){
		var fademation = Flow.Animate({
			node : dialogue.box,
			from : {
					opacity: 100
			},
			to : {
				opacity : 60
			},
			tween : Flow.Animate.equations.Expo.easeInOut
		}, clues.dialogue.duration).start();
	},
	
	/**
	 * display the dialogue text after a pause
	 */
	displayDialogue : function(dialogue, text){
		dialogue.box.setStyle("padding", "10px"); // set up the padding!

		clues.dialogue.oldBox = clues.dialogue.currentBox; 
		if (clues.dialogue.oldBox) {
			clues.dialogue.oldBox.setStyle("zIndex", "0");
		}
		
		clues.dialogue.currentBox = dialogue.box;
		clues.dialogue.currentText = text;
		clues.dialogue.currentBox.innerHTML = "";
		setTimeout('clues.dialogue.setText()', 400);
	},
	
	setText : function(){
		clues.dialogue.currentBox.setStyle("zIndex", "10");
		clues.dialogue.currentBox.innerHTML = clues.dialogue.currentText;
	},
	
	/**
	 * decide what text to show
	 */
	show : function(){
		var onAnswer = clues.dialogue.item%2; 	// 1 is answer, 0 is question
		var currentNode = clues.dialogue.nodeText;
		var dialogueText = currentNode[clues.dialogue.item];
		var dialogueProperty;
		var oldboxProp;
		if (onAnswer) {
			dialogueProp = clues.dialogue.a;
			oldboxProp = clues.dialogue.q;
		} else {
			dialogueProp = clues.dialogue.q;
			oldboxProp = clues.dialogue.a;
		}
		clues.dialogue.animateBox(dialogueProp, dialogueText);
		
		if (clues.dialogue.oldBox) {
			clues.dialogue.fadeBox(oldboxProp);
		}
	}
}

/** ------------------------------------------------------
 *	Page load 
 */
window.addEventListener("DOMContentLoaded", clues.dialogue.setup, false);