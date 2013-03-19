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
	
		rowHeight;
	
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
			rowOfTiles += '<div class="tile blank" style="left: ' + offset + 'px"> </div>';					
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
	}
	
	/** make all rows as blanks
	*/
	var makeBoard = function() {		
		
		// create all the blank tiles that make up the board
		storeList.empty(); // clear the li			
		var allRows = "";				
		for (var i=0; i < max_row; i++) {		
			allRows += makeRow();
		}	
		storeList.append(allRows);

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
	};

	return {
		init: function() {
			getStores();
			makeBoard();
		}
	}
}(document);

$(function() {
    FOC.Stores.init();
});