/** build a list of photos in grid layout with provided images
	the order of the array is observed
	the photos can be reordered by drag
	the order is not saved
	
	ASSUME: safari 6.0.3 only supported browser
	ASSUME: no need to test image loaded since dealing with local images
	ASSUME: this code does not support changes to the HTML
	ASSUME: trimming off 2% of the images is ok as blur is wack
	
	NOTE: safari bug causes filtered images to darken and lighten when hovered over
*/

(function() {
    var imageFilenames = ["dsc_6001.jpg", "dsc_6081.jpg", "dsc_6013.jpg", "dsc_6268.jpg", "dsc_6397.jpg", "dsc_6345.jpg", "dsc_6378.jpg", "dsc_6413.jpg", "dsc_6417.jpg"],
		imagePath = "images/",
		photoList = document.querySelector('#myPhotos'),
		currentDragLi = null, 
		afterLi = null,
		tempHandle = document.createElement("div");
		
	// handle for last item in list and a function to take it off the page
	tempHandle.setAttribute("id","tempHandle");
	tempHandle.innerHTML = '<div class="handleEnd" data-icon="&#xe004;">&nbsp;</div></li>';
	function clearHandle(){
		if (tempHandle.parentElement) {
			tempHandle = tempHandle.parentElement.removeChild(tempHandle);
		}
	};
	
	// drag start, save some useful infos
	function handleDragStart(e) {
		currentDragLi = e.target.parentElement; // current li being dragged, img is target
		afterLi = currentDragLi.nextSibling; // who is behind the current
		
		e.dataTransfer.effectAllowed = 'move';
		e.dataTransfer.setData('Text', currentDragLi.innerHTML);
		currentDragLi.classList.add('dragging');
		return false;
	};
	
	// drag end, remove dragging styles
	function handleDragEnd(e) {
		e.target.parentElement.classList.remove('dragging');
		return false;
	};
	
	// drag enter, add drag over styles and add last item handler if needed
	function handleDragEnter(e) {		
		e.preventDefault();
		if (e.srcElement !== photoList) {
			clearHandle();
			if (e.target.parentElement) {
				e.target.parentElement.classList.add('over');
			}
			
		} else {
			// find last child and add
			var lastLi = document.querySelector("li:last-child");			
			lastLi.appendChild(tempHandle);			
		}
		return false;
	}
	
	// drag leave clear over styles
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
	
	// drop, many wacky things happen
	function handleDrop(e) {
		e.stopPropagation();
		e.preventDefault();
		clearHandle();
		
		var targetLi = e.target.parentElement; // shorthand
		
		// we're not dragging in place or trying to insert before the guy standing after us
		if ((currentDragLi !== targetLi) && (afterLi !== targetLi)) {
			// make a new li to insert into our photoset and remove old one
			var newLi = document.createElement("li");
			newLi.innerHTML = e.dataTransfer.getData('Text');	
			newLi.classList.add("invis");
			
			// add to the end if dragging to some free space and its not the last item
			// otherwise insert before the target
			if (e.toElement == photoList) {
				if (afterLi) { 
					photoList.appendChild(newLi); 
					photoList.removeChild(currentDragLi);
				}		
			} else {
				photoList.insertBefore(newLi, targetLi);
				photoList.removeChild(currentDragLi);
			}
						
			// do some animation on insert for the lols
			setTimeout(function(){	
				// clear animation classes after its done
				newLi.addEventListener('webkitTransitionEnd', function(){
					this.classList.remove("invis");
					this.classList.remove("vis");
				}, false);			
				newLi.classList.add("vis");	
			}, 10);
		} 
		
		currentDragLi.classList.remove("dragging");
		targetLi.classList.remove("over");
		
		return false;
	}
	
	// listen for any drag events that happen in photolist
	function setupDragSort(){
		photoList.addEventListener('dragstart', handleDragStart, false);
		photoList.addEventListener('dragend', handleDragEnd, false);	
		photoList.addEventListener('dragenter', handleDragEnter, false);
		photoList.addEventListener('dragleave', handleDragLeave, false);
		photoList.addEventListener('dragover', handleDragOver, false);
		photoList.addEventListener('drop', handleDrop, false);		
	}
	
	// create the photo list from provided images array
	function renderImages() {
		var fragment = "";		
		for (var y=0; y<imageFilenames.length; y++) {
			fragment += '<li><img src="' + imagePath + imageFilenames[y] + '" alt="'+imageFilenames[y] + '" >';			
			fragment += '<div class="handle" data-icon="&#xe001;">&nbsp;</div></li>';
		}				
		photoList.innerHTML = fragment;	
	};
	
	// ----------- make our images and start the drag 
	renderImages();
	setupDragSort();
	
}());




