/**
VALID CHARS: a, b, c, d, e, f, g, h, i, j, Z, M, K, P, Q

every single lower letter is valid
Z must be followed by any 1 epxression
M must be followed by any two expressions

Julia Yu 3/11/2013
*/

window.SAMPLE = window.SAMPLE || {};

SAMPLE.Validate = function(){
	var input, 
		output,
		button,
		resultList,
		debug = false;
	
	/** bind events cross browser
	*/
	var bindEvent = function(ele, e, callback) {
		if (ele.addEventListener) {
			ele.addEventListener(e, callback, false);
		} else if (ele.attachEvent) {
			ele.attachEvent('on' + e, function(){
	             callback.call(event.srcElement, event);
			});
		}
	};
	
	/** for debug
	*/
	var trace = function(traceThis) {
		if (debug) {
			console.log(traceThis);
		}
	};
	
	/** see if this phrase is valid
	*/
	var validatePhrase = function(phrase){
		var phraseArray = phrase.split("");
		var expStack =  new Array(); // hold expressions
		var error = "no errors";
		var valid = true;
				
		var validateChar = function(phraseArray) {
			if (phraseArray.length <= 0) {
				return false; // array empty we are done
			} else {
				var myChar = phraseArray.pop(); // get last char
				trace("looking at char " + myChar);
				
				// is it a lowercase a - j
				if (/[a-j]/.test(myChar)) {											
					expStack.push(myChar);
					trace(myChar + " is now put on the stack");					
				} else {		
					// its Z
					if (myChar == "Z") {					
						if (expStack.length < 1) {
							error = "Z expression does not have enough expressions to group with";
							valid = false;
							return false;
						}
						
						var exp = expStack.pop();
						var newZExp = myChar + exp;
						expStack.push(newZExp);			
						trace(myChar + " Z epxression placed on stack");			
					}
					
					
					// its MPQK
					if (/[MPQK]/.test(myChar)) {
						if (expStack.length < 2) {
							error = "MPQK expression does not have enough expressions to group with";
							valid = false;
							return false;
						}						
						var exp1 = expStack.pop();
						var exp2 = expStack.pop();
						var newMExp = myChar + exp1 + exp2;
						expStack.push(newMExp);				
						trace(myChar + " MPKQ expression placed on stack");		
					}				
				}				
				validateChar(phraseArray); // recurse through array
			}
		}
		
		validateChar(phraseArray); // call to start the recursion
		
		if (expStack.length > 1) { 
			valid = false; 
			error = "Too many expressions";
		}
				
		return { 'valid' : valid, 'error' : error, 'phrase' : phrase};
	}
	
	/** display on screen if valid or not this phrase is
	*/
	var appendResult = function(vInfo) {
				
		var newLi =  document.createElement('li');
		var header = document.createElement('h2');
		var state = document.createElement('p');
		var error = document.createElement('p');
				
		var validOrNot = vInfo.valid ? "valid" : "invalid";
		
		header.textContent = vInfo.phrase;
		state.textContent = validOrNot.toUpperCase();
		state.className = "state " + validOrNot;
		
		error.textContent = vInfo.valid ? "" : vInfo.error;
		error.className = "error";
		
		
		newLi.appendChild(header);
		newLi.appendChild(state);
		newLi.appendChild(error);

		resultList.appendChild(newLi);
	}
	
	/** break down the input string into phrases to validate
	*/
	var validateInput = function(userInput) {
		
		var phrases = userInput.trim().split(" ");
		var validateInfo = {
			'phrase' : '',
			'valid' : true,
			'error' : 'no errors'
		};
		
		resultList = document.createElement('ol');
		
		for (var k=0; k < phrases.length; k++) {
			var myPhrase = phrases[k];				
			trace("---- testing phrase: " + myPhrase);
			validateInfo.phrase = myPhrase;
				
			if (/^[a-jZMKPQ]+$/.test(myPhrase) == false) {
				validateInfo.valid = false;
				validateInfo.error = "Characters not found in character set";
				appendResult(validateInfo);			
				continue; 
			} 

			// else  recursively break down string
			validateInfo = validatePhrase(myPhrase);
			trace(validateInfo.error + " valid is " + validateInfo.valid);
			appendResult(validateInfo);		
		}
		
		output.appendChild(resultList);

	};
	
	/** get the inputs and outputs
	*/
	var setupValidate = function() {
		button = document.getElementsByTagName('button')[0];
		input = document.getElementsByTagName('textarea')[0];
		output = document.getElementById("output");
				
		bindEvent(button, 'click', function(e){
			output.innerHTML = "";
			validateInput(input.value);
		});		
	};
	
	return {
		init : function() {
			setupValidate();
		}
	}
}();

// not using dom ready since we're loading at bottom
SAMPLE.Validate.init();
