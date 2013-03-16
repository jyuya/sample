window.DEMO = window.DEMO || {};

DEMO.DragItem = function(){
	var item, stage, top, left, handle, tools, key, detail, data, img;
	var dragging = resizing = inert = false;
	var z = 50;
	
	/** emphasize stage item
	*/
	var hiLight = function(){
		$(item).addClass("over");
		$(handle).stop().animate({ opacity: 1 }, 500);
		$(tools).stop().animate({ opacity: 1 }, 500);
	}
	
	/** de-emphasize stage item
	*/
	var loLight = function(){
		$(item).removeClass("over");
		$(handle).stop().animate({ opacity: 0 }, 500);
		$(tools).stop().animate({ opacity: 0 }, 500);
	}
	
	/** add events and others to stage item
	*/
	var addItemActions = function(){
		$(item).bind({
			mouseenter: function() {
				if (resizing || inert) { return false; }
				hiLight();
				$(item).css("z-index", 99);
			},
			mouseleave: function() {
				if (resizing || inert) { return false; }
				loLight();
				$(item).css("z-index", z);
			},
			dragstart : function(){
				dragging = true;
				$(stage).trigger("itemDragStart", [ key ]);
			},
			dragstop : function(){
				dragging = false;
				$(stage).trigger("itemDragStop", [ key ]);
			},
			resizestart : function(){
				resizing = true;
			},
			resizestop : function(){
				resizing = false;
			}
		});
		
		// z index actions
		$(".forward", tools).bind("click", function(){
			if (z < 99) {
				z++;
				$(item).css("z-index", z);
			}
		});
		$(".back", tools).bind("click", function(){
			if (z > 1) {
				z--;
				$(item).css("z-index", z);
			}
		});

		// close actions
		$(".close", tools).bind("click", function(){	
			$("li", tools).data("tooltip").hide();
			$(stage).trigger("removeStageItem", [ key ]); // trigger event
			$(item).remove();
		});
		
		$("li", tools).tooltip({
			offset: [0, 15],
			effect: 'fade',
			fadeOutSpeed: 50,
			predelay: 400
		});
		
		$(handle).attr("title", "drag to resize");
		$(handle).tooltip({
			offset: [0, 15],
			fadeOutSpeed: 1,
			predelay: 400
		});

	}
	
	/** create stage item
	*/
	var makeItem = function() {
		var toolsHTML = '<ul class="resizeTools"><li class="close" title="remove">Close</li><li class="forward" title="bring to front">+</li><li class="back" title="send to back">-</li></ul>';
		var newItem = '<div class="stageItem">'+ toolsHTML +'<img src="'+ img +'" alt="some drag item" /></div>'; 
		$(stage).append(newItem);
		item = $(".stageItem:last-child", stage);
		$(item).css("top", top);
		$(item).resizable().draggable();
		$(item).css("left", left);
		handle = $(".ui-resizable-se", item);
		tools = $(".resizeTools", item);
		addItemActions();	
	}
	
	/** listen for other item events
	*/
	var setupListen = function(){
		$(stage).bind("itemDragStart", function(e, value){
			if (value !== key) {
				inert = true;
				loLight();
			}
		});
		$(stage).bind("itemDragStop", function(e, value){
			if (value !== key) {
				inert = false;
			}
		});
	}
	
	return {
		init : function(initData){
			data = initData.data;
			stage = initData.stage || $("#stage");
			key = initData.key || 'unique_key';
			top = initData.ui.position.top || 0;
			left = initData.ui.position.left || 0;
			topOffset = $(stage).position().top || 0; // adjust top
			top = top - topOffset;
			img = initData.img;
			
			makeItem();	
			setupListen();
		}
	}
};

DEMO.Composite = function(){
	var dragItems = {}; // keep track of drag items
	var count = 0;	// unique id for drag
	var currentData = [];
	var info = {};	// data info
	var currentDetail = currentMax = 0; // current detail item we are on

	// when item is dropped on the stage
	var onDrop = function(ui, stage){
		if (count == 0) {
			$(stage).empty(); // initial drop clear message
		}
		count++;
		
		var srcImage = $(ui.draggable[0]).attr("src");
		var keyName = "_" + count;
		var data = {
			key: keyName,
			name : keyName,
			ui : ui,
			stage : stage,
			img : srcImage,
			data : info[keyName]
		}
		
		dragItems[keyName] = new DEMO.DragItem(); // make new drag item 
		dragItems[keyName].init(data);
	};

	var setupStage = function() {
		var dragThings = $("#selectFrom");
		var stage = $("#stage");
		
		$("li img", dragThings).each(function(i, dragThis) {
			
			// each item image is a draggable
			$(dragThis).draggable({
				appendTo : '.wrap', // this is the area which the dragging image is shown
				helper: 'clone', 
				drag : function(e, ui) {
					$(stage).trigger("itemDragStart", [ "clone" ]);
				},
				stop : function(e, ui) {
					$(stage).trigger("itemDragStop", [ "clone" ]);
				}
			});
			
			// drop things onto the stage
			$(stage).droppable({
				accept: 'img',
				drop: function(e, ui) {
					onDrop(ui, this);
				}
			});
		});
		
	}

	return {
		init : function(){	
			setupStage();
		}
	}
}();

$(document).ready(function(){	
	DEMO.Composite.init();
	$('.carrotCell').carrotCell({ sideways: false });
});