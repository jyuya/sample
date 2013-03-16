window.FOC = window.FOC || {};


/** deals with the stores
*/
FOC.Stores = function(){
	
	var MAX_TILE = 0, // max number of tiles in a row
		MAX_ROW = 0, // max number of rows based on largest in each alphabet letter
		FLIP_SPEED = 400,
		OFFSET_SPEED = 100,
		TILE_WIDTH = 22,
			
		rowHeight = 0,
		totalActive = 0, // total number of active tiles that has a letter or blank in sequence
		longestList = "A", // the alphabet list with the biggest amount of content
		currentAlpha = "1",
		alphabet = [], // alpha lookup
		numbers = [], // numbers lookup
		autoList = [], // array of alphabets we actually have stores for
		first = true, // first time in here
		animating = false,
		clicked = false,
		autoScrollCount = 0,
		storeList,
		list = {}, // alphabet lookup list of stores
		board = {}; // the flip board
	
	/** adjust height of the container depending on length of rows
	*/
	var adjustHeight = function(rows) {
		var newHeight = rows * rowHeight;		
		$(storeList).animate({ height: newHeight + 'px' },  500);
	};
		
	/** get a random number
	*/
	var getRandomInt = function(min, max) {
	    return Math.floor(Math.random() * (max - min + 1)) + min;
	};

	/** get a random alphabet letter
	*/
	var getRandomLetter = function() {	
		var rng = getRandomInt(0, alphabet.length-1);
		var randomLetter = alphabet[rng];
		return randomLetter;
	};

	/** make alphabet string
	*/
	var makeAlphabet = function() {
		var astring = "abcdefghijklmnopqrstuvwxyz";
		astring = astring.toUpperCase(),			
		alphabet = astring.split("");
		
		var nstring = "zero,one,two,three,four,five,six,seven,eight,nine";
		numbers = nstring.split(",");		
	};
	
	/** grab all the stores and store them as data
	*/	
	var getStores = function() {
		storeList = $("#stores");
		
		rowHeight = $("li", storeList).outerHeight(true);
	
		$("li", storeList).each(function(){
			var store = $(this).html().toLowerCase();
			store = store.replace("&amp;", "&");

			if (store.length > MAX_TILE) {
				MAX_TILE = store.length; // see what the max amount of tiles we have is
			}			
			
			var firstchar = store.substring(0,1);
			
			if (!list[firstchar]) {
				list[firstchar] = new Array();
			}
			list[firstchar].push(store);	
		});
				
		// find how many rows max a letter has
		for (k in list) {
			autoList.push(k);
			if (list[k].length > MAX_ROW) {
				MAX_ROW = list[k].length; // see what the max rows we have is
				longestList = k;
			}
		}
		
		$(storeList).bind("flipped", handleFlipped);
		
		// console.log("MAX is " + MAX_TILE);
		// console.log("MAX ROW is " + MAX_ROW + " longest is " + longestList);
		 
	};
	
	/** generate one row of tiles
	*/
	var generateTiles = function(content) {
		var rowOfTiles = "";
		var offset = 0;
		
		for (var j=1; j <= MAX_TILE; j++) {
			rowOfTiles += '<div class="tile blank" style="left: ' + offset + 'px"> </div>';			
			offset = offset + TILE_WIDTH;
		}
		
		return rowOfTiles;
	}
	
	/** make all rows as blanks
	*/
	var generateBoard = function() {
		
		storeList.empty();
			
		for (var i=0; i < MAX_ROW; i++) {
			var rowHTML = '<li>'; // make a row			
			rowHTML += '<div class="top">'; // top
			rowHTML += '<div class="old">' // top old			
			rowHTML += generateTiles("top old");
			rowHTML += '</div>'; // end top old
			rowHTML += '<div class="new">'; // start top new
			rowHTML += generateTiles("top new");
			rowHTML += '</div></div>'; // new and top is done					
			rowHTML += '<div class="bottom">'; // bottom
			rowHTML += '<div class="old">' // bottom old
			rowHTML += generateTiles("bottom old");
			rowHTML += '</div>'; // end bottom old
			rowHTML += '<div class="new">'; // start bottom new
			rowHTML += generateTiles("bottom new");
			rowHTML += '</div></div>'; // new and bottom is done
			rowHTML += '</li>';
			
			storeList.append(rowHTML);
			
			// make the board reference object			
			board[i] = {
				row : null,
				top : { newTiles: [],oldTiles: [] },
				bottom : { newTiles: [],oldTiles: [] },
			};

			var justAddedRow = $("li:last", storeList); 
			var justAddedTop = $(".top", justAddedRow);
			var justAddedBottom = $(".bottom", justAddedRow);
			
			board[i].row = justAddedRow;			
			board[i].top.newTiles = $(".new div", justAddedTop);
			board[i].top.oldTiles = $(".old div", justAddedTop);			
			board[i].bottom.newTiles = $(".new div", justAddedBottom);
			board[i].bottom.oldTiles = $(".old div", justAddedBottom);
		}
	};
	
	/** do the top animation
	*/
	var shrinkTop = function(item, rowNum, tileNum) {
		
		var newSpeed = FLIP_SPEED  - FLIP_SPEED * (0.035 * tileNum);
		if (newSpeed < 0 ) { newSpeed = 0; }
		
		$(item).animate(
			{  height: '0px', easing: "easeOutExpo" },  newSpeed, 
			function() {
				$(storeList).trigger("flipped", { pos: "top", row: rowNum, tile: tileNum });				
				var newItem = board[rowNum].top.newTiles[tileNum];
				var oldItem = board[rowNum].top.oldTiles[tileNum];
				$(oldItem).attr("class", $(newItem).attr("class")); 
				$(oldItem).html($(newItem).html());			
				$(oldItem).css("height", "20px");
			}
		);
	};
	
	/** do the bottom animation
	*/
	var growBottom = function(item, rowNum, tileNum) {
		var newSpeed = FLIP_SPEED  - FLIP_SPEED * (0.03 * tileNum);
		if (newSpeed < 0 ) { newSpeed = 0; }
		
		$(item).animate(
			{ top: 0, height: '54px', easing: "easeOutExpo"  },  newSpeed, 
			function() {
				$(storeList).trigger("flipped", { pos: "bottom", row: rowNum, tile: tileNum });
				var newItem = board[rowNum].bottom.newTiles[tileNum];
				var oldItem = board[rowNum].bottom.oldTiles[tileNum];
				$(oldItem).attr("class", $(newItem).attr("class")); 
				$(oldItem).html($(newItem).html());				
				$(newItem).css("height", "0px");
			}
		);
	};
	
	/** handle all flipped events
	*/
	var handleFlipped = function(e, data){
		totalActive--;
		if (totalActive == 0) {
			animating = false;

			// no clicks happened, we are auto scrolling
			if (!clicked) {
				
				setTimeout(function(){
					autoScrollCount++;
					if (autoScrollCount >= autoList.length) {
						autoScrollCount = 0;
					}
					var onLetter = autoList[autoScrollCount].toLowerCase();
					generateList(onLetter);
				}, 7000);
			}
		}
	};
	
	/** flip one row, or one store name
	*/
	var flipRow = function(topRow, bottomRow, rowNum) {
		var tileNum = 0;                    		
		// console.log("going to flip row " + rowNum + " max tile is " + MAX_TILE + " active is ");
		
		var newSpeed = OFFSET_SPEED  - OFFSET_SPEED * (0.08 * rowNum);
		if (newSpeed < 0 ) { newSpeed = 0; }

		function myLoop() {         
			setTimeout(function() {  
				var currentTop = topRow[tileNum];
				var currentBottom = bottomRow[tileNum];
		
				shrinkTop(currentTop, rowNum, tileNum);
				growBottom(currentBottom, rowNum, tileNum);
		
		      	tileNum++;                     
		      	if (tileNum < MAX_TILE) {  myLoop(); }                       
		   }, newSpeed);
		};
		
		myLoop();
	}
	
	/** figure out the css name of this character
	*/
	var findCharCSSName = function(currentChar) {
		var cssName = "blank";
		
		// is it not blank?
		if (currentChar !== " "){
			cssName = currentChar;
		}
		
		// is it a number?
		if (!isNaN(parseInt(currentChar))) {
			cssName = numbers[currentChar];
		}
		
		// is it a symbol?
		switch (currentChar) {
			case "." :
				cssName = "period";
				break;
			case "'" :
				cssName = "apos";
				break;	
			case "/" :
				cssName = "divide";
				break;						
			case "&" :
				cssName = "and";
				break;
			case "-" :
				cssName = "dash";
				break;
		}
				
		return cssName;
	};
	
	/** generate a list of things
	*/
	var generateList = function(alpha) {

		if (currentAlpha == alpha) {
			return false; // already on this letter
		}
		var currentList = list[alpha];
		currentAlpha = alpha;
		// console.log("creating " + alpha);

		$("li", storeList).removeClass("hasContent"); // clear previous underlines
		adjustHeight(currentList.length);
		totalActive = 0;
		
		// each store
		for (var i=0; i < currentList.length; i++) {
			
			$(board[i].row).addClass("hasContent"); // highlight this row
			var storeName = currentList[i].split(""); // split into char array
			board[i].active = storeName.length; // how many active
						
			for (var z = 0; z < MAX_TILE; z++) {
				var currentChar = "blank";
				var currentHTML = " ";
				
				// for the parts of the tiles that have characters
				if (z < storeName.length) {
					currentChar = findCharCSSName(storeName[z]);
					currentHTML = currentChar;
					if (currentChar == "blank") { currentHTML = " "; }

					// first time so populate old with random number to see animate effect
					if (first) {		
						var topTileOld = board[i].top.oldTiles[z];
						var bottomTileOld = board[i].bottom.oldTiles[z];				
						var rndLetter = getRandomLetter();						
						rndLetter = rndLetter.toLowerCase();							
						$(topTileOld).addClass(rndLetter).html(rndLetter).removeClass("blank");
						$(bottomTileOld).addClass(rndLetter).html(rndLetter).removeClass("blank");
					}

					totalActive++;
				} 
				
				var topTile = board[i].top.newTiles[z];
				var bottomTile = board[i].bottom.newTiles[z];

				$(topTile).removeClass().addClass("tile").addClass(currentChar).html(currentHTML);
				$(bottomTile).removeClass().addClass("tile").addClass(currentChar).html(currentHTML);
				
			}		
			
				
		}
		
		totalActive = totalActive * 2; // double up the animate count we have 2 things
		
		// console.log("tile count is " + totalActive);
			
		$(board[currentList.length-1].row).removeClass("hasContent"); // unhighlight the last row...
		
		// if (!first) { return false; }
		
		animating = true; // start animating
		var x = 0;     		               
		function flipLoop() {     
		 	var speed = getRandomInt(100, 500); // get a new flip speed
		
			setTimeout(function() {  
				flipRow(board[x].top.oldTiles, board[x].bottom.newTiles, x, board[x].active);
		      	x++;                     
		      	if (x < currentList.length) {  flipLoop();  }                       
		   }, speed);
		};
		
		flipLoop();
		
		first = false; // we initialized no more random	
	};
	
	/** select up the alphabet select
	*/
	var setupSelect = function() {
		var alphaClick = $("#alphaList li");
		$(alphaClick).each(function(count, alpha){			
			var thisChar = $(alpha).html().toLowerCase();
			
			if (list[thisChar]) {
				$(alpha).click(function(e){
					e.preventDefault();
					clicked = true; // no more auto scroll
					
					generateList(thisChar);					
					$(alphaClick).removeClass("on");
					$(this).addClass("on");
				});
			
			} else {
				$(alpha).addClass("inactive");
			}

		});
	};
	
	/** auto scroll through the alphabet
	*/
	var autoShow = function() {
		// actually we'll just kick off a and do it through the event listener for animate done
		generateList("a");
	}
		
	return {
		init : function(){
			makeAlphabet();	
			getStores();	
			setupSelect();			
			generateBoard();	
			autoShow();
		}
	}
}();

$(document).ready(function(){
	FOC.Stores.init();
});