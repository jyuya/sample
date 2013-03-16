window.RLF = window.RLF || {};

RLF.Paint = function(){
	var 
		RED = "#ff3300",
		ORANGE = "#ff9900",
		PINK = "#ff33cc",
		YELLOW = "#ffff00",
		PURPLE = "#6600cc",
		GREEN = "#009900",
		BLUE = "#0066cc",
		WHITE = "#ffffff",
		BLACK = "#000000",
		ERASE = "erase",
		
		SIZE1 = "1",
		SIZE2 = "5",
		SIZE3 = "10",
		SIZE4 = "15",
		SIZE5 = "25",
		
		clickX = new Array(),
		clickY = new Array(),
		clickDrag = new Array(),
		clickColor = new Array(),
		clickSize = new Array(),
		currentColor = BLACK,
		currentSize = SIZE3,
		sizes,
		colors,
		brushes,
		
		jCanvas, 	// jquery object of canvas
		canvas,		// the real canvas
		context,
		bg,
		w, h,
		painting = false;

	// --- handle size select
	var handleSizes = function() {		
		$(sizes).click(function(){
			var thisSize = $(this).attr("id").toLowerCase();	
			$(sizes).removeClass("selected");
			$(this).addClass("selected");
				
			switch(thisSize) {
				case 'size1' :
					currentSize = SIZE1;
					break;
				case 'size2' :
					currentSize = SIZE2;
					break; 
				case 'size3' :
					currentSize = SIZE3;
					break;
				case 'size4' :
					currentSize = SIZE4;
					break;					
				case 'size5' :
					currentSize = SIZE5;
					break;
				default  :
					currentSize = SIZE3;
			}	
		}); 			
	};
	
	// --- handle color select
	var handleColors = function() {		
		$(colors).click(function(){
			var thisColor = $(this).attr("id").toLowerCase();	
			$(colors).removeClass("selected");
			
			$(this).addClass("selected");
				
			switch(thisColor) {
				case 'red' :
					currentColor = RED;
					break;
				case 'orange' :
					currentColor = ORANGE;
					break; 
				case 'pink' :
					currentColor = PINK;
					break;
				case 'yellow' :
					currentColor = YELLOW;
					break;					
				case 'green' :
					currentColor = GREEN;
					break;
				case 'blue' :
					currentColor = BLUE;
					break;
				case 'purple' :
					currentColor = PURPLE;
					break;
				case 'black' :
					currentColor = BLACK;
					break;
				case 'white' :
					currentColor = WHITE;
					break;			
				case 'erase' :
					currentColor = ERASE;
					break;	
				default  :
					currentColor = BLACK;
			}	
			
			var newColor = currentColor;
			if (currentColor == ERASE) {
				newColor = WHITE;
			} 

			$("span", brushes).css("background-color", newColor);
			$("span", sizes).css("background-color", newColor);
		}); 		
			
	};
	
	/** --- listen to clicky
	*/	
	var handleButtons = function() {
		$("#clearSurface").click(function(){
			context.clearRect(0, 0, w, h);
			resetCanvas();
		});
		
		$("#save").click(function(){		
			saveCanvas();		
		});
		
		handleColors();
		handleSizes();
		
		$("#loadTree").click(function(){
			$("#drawContainer").css('background', 'url("tree.jpg") no-repeat 0 0');
		});

	};
	
	/** --- save 2 pngs and merge into 1 png
	*/
	var saveCanvas = function() {
		
		var overlayPNG = Canvas2Image.saveAsPNG(canvas, true);   
		var overlay = new Image();
		overlay.src = overlayPNG.src;
		
		overlay.onload = function(){
			
			var background = new Image(); 
			background.src = "tree.jpg"
				
			resetCanvas();
	
			$("#drawContainer").css("background", "none");
			$("#drawSurface").css("opacity", "1");
			
			context.drawImage(background, 0, 0);
			context.globalAlpha = 0.5;
			context.drawImage(overlay, 0, 0);
		
			var finalImage = Canvas2Image.saveAsPNG(canvas, true);  
			$("#test").append(finalImage);
	
		}		
	};
	
	/** --- reset the canvas including all the click arrays
	*/
	var resetCanvas = function() {
		clearCanvas();
		clickX = [];
		clickY = [];
		clickDrag = [];
		clickColor = [];
	};
	
	/** --- clear the canvas of current thing
	*/
	var clearCanvas = function() {
		context.save();
		context.setTransform(1, 0, 0, 1, 0, 0); // Use the identity matrix while clearing the canvas
		context.clearRect(0, 0, w, h);
		context.restore();
	};
	
	var drawFromClicks = function() {
		for (var i=0; i < clickX.length; i++) {
			context.beginPath();
			if (clickDrag[i] && i) {
				context.moveTo(clickX[i-1], clickY[i-1]);
			} else {
				context.moveTo(clickX[i]-1, clickY[i]);
			}
			context.lineTo(clickX[i], clickY[i]);

			context.strokeStyle = clickColor[i];
			context.lineWidth = clickSize[i];
			
			var save = context.globalCompositeOperation;
			
			if (clickColor[i] == ERASE) {
				context.globalCompositeOperation = "destination-out";
				context.strokeStyle = "rgba(0,0,0,1)";
			}
			
			context.stroke();
			context.globalCompositeOperation = save;
		}
	};
	
	/** --- clear canvas and draw some lines
	**/	
	var redraw = function() {
		clearCanvas();
		context.lineJoin = "round";
		context.lineCap = "round";
		drawFromClicks();		
	};

	// --- get x coord
	var getX = function(event, container) {
		return event.pageX - container.offsetLeft;
	};

	// --- get y coord
	var getY = function(event, container) {
		return event.pageY - container.offsetTop;
	};
	
	/** --- remember where mouse down happened
	**/
	var addClick = function(event, container, dragging) {
		var thisX = getX(event, container);
		var thisY = getY(event, container);
		
		clickX.push(thisX);
		clickY.push(thisY);
		clickDrag.push(dragging)
		clickColor.push(currentColor);
		clickSize.push(currentSize);
		
		// console.log("x is " + thisX + " y is " + thisY);	
	};
		
	/** --- action events to the canvas
	**/	
	var handleEvents = function() {
		jCanvas.bind({
			mousedown : function(e) {
				painting = true;
				addClick(e, this, false);
				redraw();
			},
			mousemove : function(e) {
				if (painting){
					addClick(e, this, true);
					redraw();
				}
			},
			mouseup : function(e) {
				painting = false;
			},
			mouseleave : function(e) {
				painting = false;
			}
		});
	};

	/** --- get canvas and context
	**/
	var getCanvas = function() {
		bg = $("#drawContainer");
		jCanvas = $('#drawSurface');
		w = jCanvas.width();
		h = jCanvas.height();
		sizes = $(".size");
		colors = $(".color");
		brushes = $(".brush");
		canvas = jCanvas[0];
		context = canvas.getContext("2d");

	};
	
	return {
		init : function() {	
			getCanvas();
			handleEvents();
			handleButtons();
		}
	}
}();

$(function() {
    RLF.Paint.init();
});