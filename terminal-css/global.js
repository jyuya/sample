/**
	rewriting of terminal
	TODO
		test dom append vs html string append - first test seems faulty and slow
**/

window.FOC = window.FOC || {};

FOC.Stores = function (D) {

	var	
		TILE_WIDTH = 22,
		max_tile = 0, 	// maximum char in a store name
		max_row = 0,	// maximum ammount of stores starting with some char
		storeList, 		// the ul
		storeListItems, // the li
		list = {}, 		// alphabetical lookup of stores
		alpha = [], 	// array of alphabets we actually have stores for
		longestInList, 	// which character has the most stores
		board = {},		// object that keeps track of every char 
		currentAlpha = "",
		animating = false,
		FLIP_SPEED = 400,
		OFFSET_SPEED = 100,
		count = 0,
		rowHeight;
		
	/** get a random number
	*/
	var getRandomInt = function(min, max) {
	    return Math.floor(Math.random() * (max - min + 1)) + min;
	};
	
	// test func for speed
	var timeIt = function(script){
		var start = new Date();
		script();
		return new Date() - start;
	};
	
	// some kind of transition ended
	// put new into old
	var handleTransitEnd = function(e) {
		var itemData = $(e.target).data();
	

		if (itemData.top) {
			var newItem = board[itemData.row].top.newTiles[itemData.tile];
			var oldItem = board[itemData.row].top.oldTiles[itemData.tile];
			
			$(oldItem).html($(newItem).html());	
			$(oldItem).addClass("notransition").removeClass("tileHide");		
		}
		
		if (itemData.bottom) {
			var newItem = board[itemData.row].bottom.newTiles[itemData.tile];
			var oldItem = board[itemData.row].bottom.oldTiles[itemData.tile];
			
			$(oldItem).html($(newItem).html());			
			$(newItem).addClass("notransition").removeClass("tileShow").addClass("tileHide");	
		}
	};
	
	/** do the top animation
	*/
	var shrinkTop = function(item, rowNum, tileNum) {
		var newSpeed = FLIP_SPEED  - FLIP_SPEED * (0.035 * tileNum);
		if (newSpeed < 0 ) { newSpeed = 0; }
		
		$(item).addClass("tileHide");
		$(item).data({row : rowNum, tile: tileNum, top: true, bottom: false });
		
		// $(item).animate(
		// 	{  height: '0px', easing: "easeOutExpo" },  newSpeed, 
		// 	function() {
		// 		// $(storeList).trigger("flipped", { pos: "top", row: rowNum, tile: tileNum });				
		// 		// var newItem = board[rowNum].top.newTiles[tileNum];
		// 		// var oldItem = board[rowNum].top.oldTiles[tileNum];
		// 		// $(oldItem).attr("class", $(newItem).attr("class")); 
		// 		// $(oldItem).html($(newItem).html());			
		// 		// $(oldItem).css("height", "20px");
		// 	}
		// );
	};
	
	/** do the bottom animation
	*/
	var growBottom = function(item, rowNum, tileNum) {
		var newSpeed = FLIP_SPEED  - FLIP_SPEED * (0.03 * tileNum);
		if (newSpeed < 0 ) { newSpeed = 0; }
		
		$(item).addClass("tileShow");
		$(item).data({row : rowNum, tile: tileNum, top: false, bottom: true });
		
		// $(item).animate(
		// 	{ top: 0, height: '54px', easing: "easeOutExpo"  },  newSpeed, 
		// 	function() {
		// 		// $(storeList).trigger("flipped", { pos: "bottom", row: rowNum, tile: tileNum });
		// 		// var newItem = board[rowNum].bottom.newTiles[tileNum];
		// 		// var oldItem = board[rowNum].bottom.oldTiles[tileNum];
		// 		// $(oldItem).attr("class", $(newItem).attr("class")); 
		// 		// $(oldItem).html($(newItem).html());				
		// 		// $(newItem).css("height", "0px");
		// 	}
		// );
	};

	
	/** flip one row, or one store name
	*/
	var flipRow = function(topRow, bottomRow, rowNum) {		
		var tileNum = 0;          			
		var newSpeed = OFFSET_SPEED  - OFFSET_SPEED * (0.08 * rowNum);
		if (newSpeed < 0 ) { newSpeed = 0; }
		
		function myLoop() {         
			setTimeout(function() {  
				var currentTop = topRow[tileNum];
				var currentBottom = bottomRow[tileNum];
		
				shrinkTop(currentTop, rowNum, tileNum);
				growBottom(currentBottom, rowNum, tileNum);
		
		      	tileNum++;                     
		      	if (tileNum < max_tile) {  myLoop(); }                       
		   }, newSpeed);
		};	
		myLoop();
	}
	
	/** flip this
	*/
	var flipAll = function(currentList){
		animating = true; // start animating
		for (var x=0; x<currentList.length; x++) {
			flipRow(board[x].top.oldTiles, board[x].bottom.newTiles, x);
		}
		
	};
	
	/** put the store name into the tiles,
		got the max_tile distance to blank out any previous populated
	*/
	var populateTiles = function(row, storeName){
		for (var z = 0; z < max_tile; z++) {			
			var currentChar = (z < storeName.length) ? storeName[z] :  " ";
			var topTile = board[row].top.newTiles[z]; // look up where we are in the character tile list
			var bottomTile = board[row].bottom.newTiles[z];
			
			$(topTile).html(currentChar);
			$(bottomTile).html(currentChar);
		}
	}
		
	/** generate set of stores starting with alpha
	*/
	var makeAlphaList = function(alpha) {

		if (currentAlpha == alpha) {
			return false; // already on this letter
		}
		
		var currentList = list[alpha];	// get our list
		currentAlpha = alpha;			// remember remember
		$(storeListItems).removeClass("hasContent"); // clear previous underlines
		// adjustHeight(currentList.length);

		//  parse each store in this list
		for (var i=0; i < currentList.length; i++) {
			$(board[i].row).addClass("hasContent"); // highlight this row		
			var storeName = currentList[i].split(""); // split into char array
			board[i].active = storeName.length; // how many active		
			populateTiles(i, storeName);
		}
		$(board[currentList.length-1].row).removeClass("hasContent"); // unhighlight the last row...

		flipAll(currentList);
	};
	
	/** grab all the stores and store them as data
	*/	
	var getStores = function() {
		storeList = $("#stores"); 	
		storeListItems = $("li", storeList);		
		rowHeight = $(storeListItems).first().outerHeight(true); // find out how high a row is
		
		// find out about store names, what the longest name is, and sort it into alpha object
		for (var z=0; z < storeListItems.length; z++) {
			var thisStore = storeListItems[z];
			var storeName = $(thisStore).html().toLowerCase();
			
			if (storeName.length > max_tile) {
				max_tile = storeName.length; // see what the max amount of tiles we have is
			}

			var firstchar = storeName.substring(0,1); // first character of store on which it is sorted
			if (!list[firstchar]) { list[firstchar] = []; }
			list[firstchar].push(storeName);
		};

		// find how many rows max a letter has
		for (var k in list) {
			alpha.push(k);
			if (list[k].length > max_row) {
				max_row = list[k].length; 	// see what the max rows we have is
				longestInList = k;			// the character with the most stores
			}
		}
			
		// $(storeList).bind("flipped", handleFlipped);		 
	};
	
	/** make one row of tiles worth of htmls
	*/
	var makeTiles = function() {
		var rowOfTiles = "";
		var offset = 0;		
		for (var j=1; j <= max_tile; j++) {
			rowOfTiles += '<div class="tile" style="left: ' + offset + 'px"> </div>';					
			offset = offset + TILE_WIDTH; // move the next tile tile-width pixels
		};	
		return rowOfTiles;
	};
	
	/** make one li worth of stuffs
	*/
	var makeRow = function() {
		var rowHTML = '<li>'; // make a row			
		rowHTML += '<div class="top">'; // top
		rowHTML += '<div class="old">' // top old			
		rowHTML += makeTiles("top old");
		rowHTML += '</div>'; // end top old
		rowHTML += '<div class="new">'; // start top new
		rowHTML += makeTiles("top new");
		rowHTML += '</div></div>'; // new and top is done					
		rowHTML += '<div class="bottom">'; // bottom
		rowHTML += '<div class="old">' // bottom old
		rowHTML += makeTiles("bottom old");
		rowHTML += '</div>'; // end bottom old
		rowHTML += '<div class="new">'; // start bottom new
		rowHTML += makeTiles("bottom new");
		rowHTML += '</div></div>'; // new and bottom is done
		rowHTML += '</li>';		
		return rowHTML;
	};
	
	/** make board by appending string
	*/
	var makeRowsOfTiles = function(){
		var allRows = "";				
		for (var i=0; i < max_row; i++) {		
			allRows += makeRow();
		}	
		storeList.append(allRows).css("visibility", "visible");
	};
	
	/** MAKE WITH DOM TEST --- IT SEEMS SLOWER?! ------------------------------------
	*/
	var makeDomTiles = function() {	
		var allTiles = D.createDocumentFragment();
		var offset = 0;		
		for (var j=1; j <= max_tile; j++) {
			var tile = D.createElement('div');
			tile.className = "tile blank";
			tile.style.left = offset + 'px';		
			allTiles.appendChild(tile);						
			offset = offset + TILE_WIDTH; // move the next tile tile-width pixels
		};	
		
		return allTiles;
	};
	
	var makeDomRow = function(){
		var row = D.createElement('li');
		
		var top = D.createElement('div');
		top.className = "top";
		var topOld = D.createElement('div');
		topOld.className = "old";
		var topNew =  D.createElement('div');
		topNew.className = "new";
		
		var bottom = D.createElement('div');
		bottom.className = "bottom";
		var bottomOld = D.createElement('div');
		bottomOld.className = "old";
		var bottomNew =  D.createElement('div');
		bottomNew.className = "new";
		
		var allMyTiles = makeDomTiles();
		
		topNew.appendChild(allMyTiles.cloneNode(true));
		topOld.appendChild(allMyTiles.cloneNode(true));
		bottomNew.appendChild(allMyTiles.cloneNode(true));
		bottomOld.appendChild(allMyTiles.cloneNode(true));
		
		top.appendChild(topOld);
		top.appendChild(topNew);				
		bottom.appendChild(bottomOld);
		bottom.appendChild(bottomNew);	
		row.appendChild(top);
		row.appendChild(bottom);
		
		return row;
	};
	
	var makeAll = function() {
		var frag = D.createDocumentFragment();
		for (var i=0; i < max_row; i++) {		
			frag.appendChild(makeDomRow().cloneNode(true));
		}
		
		D.getElementById("stores").appendChild(frag.cloneNode(true));
		
	};
	
	/** END TEST CASE ------------------------------------
	*/
	
	/** make all rows as blanks
	*/
	var makeBoard = function() {		
		// create all the blank tiles that make up the board
		storeList.empty(); // clear the li		
		
		var testTime = timeIt(makeRowsOfTiles);
		// var testTime = timeIt(makeAll);
		console.log(testTime);

		// save this list of tiles into an object for easy access
		storeListItems = $(storeList).find("li"); // refresh this variable with the new li
		for (var j=0; j < storeListItems.length; j++) {		
			var bRow = board[j] = {
				row : null,
				top: { row: null },
				bottom: { row: null }
			};
			var currentLi = storeListItems[j];
			
			bRow.row = currentLi;
			bRow.top.row = $(currentLi).find(".top");	
			bRow.top.newTiles = bRow.top.row.find(".new div");
			bRow.top.oldTiles = bRow.top.row.find(".old div");
			bRow.bottom.row = $(currentLi).find(".bottom");	
			bRow.bottom.newTiles = bRow.bottom.row.find(".new div");
			bRow.bottom.oldTiles = bRow.bottom.row.find(".old div");
		};
		
		$(storeList).bind("webkitTransitionEnd", handleTransitEnd);
		
		$("body").css("visibility", "visible");
	};

	return {
		init: function() {
			getStores();
			makeBoard();
			makeAlphaList("i");
			$("#test").click(function(){
				$("div", storeListItems).removeClass("notransition");
				makeAlphaList("z");
			});
		}
	}
}(document);

$(function() {
    FOC.Stores.init();
});