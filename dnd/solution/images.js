(function() {
    var imageFilenames = ["dsc_6001.jpg", "dsc_6081.jpg", "dsc_6013.jpg", "dsc_6268.jpg", "dsc_6397.jpg", "dsc_6345.jpg", "dsc_6378.jpg", "dsc_6413.jpg", "dsc_6417.jpg"],
		imagePath = "images/",
		photoList = document.querySelector('#myPhotos'),
		currentDragLi = null;
	
	// create the photo list from provided images
	function renderImages() {
		var listItems = document.querySelectorAll("li");
		for (var z=0; z < listItems.length; z++) {
			listItems[z].setAttribute("draggable", "true");
			var listItemImage = listItems[z].querySelector("img");
			listItemImage.setAttribute("draggable", "false");
		}
				
	};
	
	// drag start
	function handleDragStart(e) {
		console.log(e.target);
		currentDragLi = e.target; 
		// e.preventDefault();
		
		// var dragIcon = document.createElement('img');
		// dragIcon.classList.add("dragIcon");
		// dragIcon.src = 'images/test.jpg';
		
		// dragIcon.src = e.target.src;
		// 
		// console.log(dragIcon);
		// var test = document.querySelector("h1");
		// test.appendChild(dragIcon);

		e.dataTransfer.effectAllowed = 'move';
		e.dataTransfer.setData('text/html', currentDragLi.innerHTML);

		// e.dataTransfer.setDragImage(dragIcon, -10, -10);

		currentDragLi.classList.add('dragging');
		return false;
	};
	
	// drag end
	function handleDragEnd(e) {
		e.target.classList.remove('dragging');
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
	
	// drop
	function handleDrop(e) {
		e.stopPropagation();
		e.preventDefault();
		
		e.target.classList.remove("over"); // this is the targeted img with a over element

		if (currentDragLi !== e.target) {
			currentDragLi.classList.remove("dragging");
			e.target.parentElement.classList.remove("dragging");
			
			currentDragLi.innerHTML = e.target.parentElement.innerHTML; // these are li
			e.target.parentElement.innerHTML = e.dataTransfer.getData('text/html');
		} 
		return false;
	}
	
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




