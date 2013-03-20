(function() {
    var imageFilenames = ["dsc_6001.jpg", "dsc_6081.jpg", "dsc_6013.jpg", "dsc_6268.jpg", "dsc_6397.jpg", "dsc_6345.jpg", "dsc_6378.jpg", "dsc_6413.jpg", "dsc_6417.jpg"];
	var photoList = document.getElementById('myPhotos');

	var currentDragLi = null;
	
	// create the photo list from provided images
	function renderImages() {
		
	};
	
	// drag start
	function handleDragStart(e) {
		
		currentDragLi = e.target.parentElement;
		e.dataTransfer.effectAllowed = 'move';
		e.dataTransfer.setData('text/html', currentDragLi.innerHTML);
		e.target.classList.add('dragged');	
	};
	
	// drag end
	function handleDragEnd(e) {
		e.target.classList.remove('dragged');
	};
	
	// drag enter
	function handleDragEnter(e) {
		e.target.classList.add('over');
	}
	
	// drag leave
	function handleDragLeave(e) {
		e.target.classList.remove('over');
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
		e.target.classList.remove("over"); // this is the targeted img with a over element

		if (currentDragLi !== e.target.parentElement) {

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
	
	setupDragDrop();
	
}());




