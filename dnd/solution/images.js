(function() {
    var imageFilenames = ["dsc_6001.jpg", "dsc_6081.jpg", "dsc_6013.jpg", "dsc_6268.jpg", "dsc_6397.jpg", "dsc_6345.jpg", "dsc_6378.jpg", "dsc_6413.jpg", "dsc_6417.jpg"],
		imagePath = "images/",
		photoList = document.querySelector('#myPhotos'),
		currentDragLi = null;
	
	// create the photo list from provided images
	function renderImages() {
		for (var y=0; y<imageFilenames.length; y++) {
			
		}
				
	};
	
	// drag start
	function handleDragStart(e) {
		currentDragLi = e.target.parentElement;
		e.dataTransfer.effectAllowed = 'move';
		e.dataTransfer.setData('Text', currentDragLi.innerHTML);
		currentDragLi.classList.add('dragging');
		return false;
	};
	
	// drag end
	function handleDragEnd(e) {
		e.target.parentElement.classList.remove('dragging');
		return false;
	};
	
	// drag enter
	function handleDragEnter(e) {
		e.preventDefault();
		e.target.parentElement.classList.add('over');
		return false;
	}
	
	// drag leave
	function handleDragLeave(e) {
		e.target.parentElement.classList.remove('over');
		return false;
	};
	
	// drag is OVER man, drag over.
	function handleDragOver(e) {
		e.preventDefault();
		e.dataTransfer.dropEffect = 'move';
		return false;
	}
	
	var dragIcon = document.createElement('img');
	dragIcon.src = ThumbData[0];
	dragIcon.width = 100;
	
	
	// drop
	function handleDrop(e) {
		e.stopPropagation();
		e.preventDefault();
		
		// e.target.classList.remove("over"); // this is the targeted img with a over element

		if (currentDragLi !== e.target) {
			currentDragLi.classList.remove("dragging");
			e.target.parentElement.classList.remove("over");
			
			var newLi = document.createElement("li");
			newLi.innerHTML = e.dataTransfer.getData('Text');	
			newLi.classList.add("invis");
			photoList.insertBefore(newLi, e.target.parentElement);
			photoList.removeChild(currentDragLi);
				
			setTimeout(function(){
				newLi.classList.add("vis");
				newLi = null;
			}, 10);
		} 
		return false;
	}
	
	// listen for any drag events that happen in photolist
	function setupDragDrop(){
		photoList.addEventListener('dragstart', handleDragStart, true);
		photoList.addEventListener('dragend', handleDragEnd, true);	
		photoList.addEventListener('dragenter', handleDragEnter, true);
		photoList.addEventListener('dragleave', handleDragLeave, true);

		photoList.addEventListener('dragover', handleDragOver, true);
		photoList.addEventListener('drop', handleDrop, false);
	}
	
	renderImages();
	setupDragDrop();
	
}());




