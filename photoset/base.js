/**
Take the http://www.flickr.com/services/api/flickr.photosets.getPhotos.html API method and 
create a page that requests the photo data (using JS) for a set and 
displays the photos in a Flickr Light Box-like manner, 
with the photo, title and photo owner. 
Next / Previous buttons would navigate you through the set.

scale photo to browser size height

Code Exercise Flickr
Julia Yu 3/8/2013
*/

window.SAMPLE = window.SAMPLE || {};

// cross browser utilities collection
SAMPLE.CrossBrowserUtil = {
	bindEvent : function(ele, e, callback) {
		if (ele.addEventListener) {
			ele.addEventListener(e, callback, false);
		} else if (ele.attachEvent) {
			ele.attachEvent('on' + e, function(){
	             callback.call(event.srcElement, event);
			});
		}
	},
	getWindowHeight : function() {
		var h;
		if( typeof( window.innerWidth ) == 'number' ) {
		    h = window.innerHeight;
		  } else if( document.documentElement && ( document.documentElement.clientWidth || document.documentElement.clientHeight ) ) {
		    h = document.documentElement.clientHeight;
		  } else if( document.body && ( document.body.clientWidth || document.body.clientHeight ) ) {
		    h = document.body.clientHeight;
		  }
		return parseInt(h);
	},
	getH : function(ele) {
		return Math.max(ele.scrollHeight, ele.scrollHeight, ele.offsetHeight, ele.offsetHeight, ele.clientHeight, ele.clientHeight);
	}
}

SAMPLE.GetFlickrSet = function(util){
	var API_URL = "http://api.flickr.com/services/rest/?",
		API_PARAMS = {
			"api_key" : "dd17d10495da3b0a2f606c9b5f389682",
			"method" : "flickr.photosets.getPhotos",
			"photoset_id" : "72157632946738839", // sample set of 9
			// "photoset_id" : "72157632949194909", // sample set of 1 for testing
			"format" : "json",
			"jsoncallback" : "SAMPLE.GetFlickrSet.gotResponse",
			"extras" : "owner_name"
			
		},
		PHOTO_SIZE = "b", // the 1024 since url_b does not exist...
		
		current = 0,
		flickr_response,
		allImages,
		set,
		setList,
		setLength = 0,
		controls, 
		prev, 
		next, 
		subHeight,
		h1,
		notice,
		head;
		
	var hideAllBut = function(showIndex) {
		for (var k = 0; k < setLength; k++) {
			if (k == showIndex) {
				setList[k].className = ""; // show this				
			} else {
				setList[k].className = "off"; // hide everyone else
			}
		}
	};
	
	/** range check where we are in the list 
		show next or previous if not already there
	*/	
	var move = function(newPos){		
		if (newPos >= (setLength - 1)) {
			newPos = setLength - 1;
			next.className = "off"; // at end no next
		} else {
			next.className = "";
		}
		if (newPos <= 0) {
			newPos = 0;
			prev.className = "off"; // at begin no prev
		} else {
			prev.className = "";
		}
		if (newPos !== current) {		
			notice.innerHTML = (newPos+1) + "/" + setLength; // show what image we are on
			current = newPos;
			hideAllBut(newPos);	// show the new current	
		}		
	};			
	
	/** setup flipping through pictures
	*/
	var setupPrevNext = function() {
		if (setLength < 2) {
			return false; // we have only 1 thing... don't build any controls
		} 
		
		setList = document.getElementsByTagName("li"); // get the list		
		hideAllBut(0); // show the first	
		
		// create previous and next buttons now that we are sure the list is longer than 1
		prev = document.createElement('button');
		next = document.createElement('button');

		prev.setAttribute('type', "button");
		next.setAttribute('type', "button");
		prev.setAttribute('value', "previous"); //ie7 only wnats to read this
		next.setAttribute('value', "next");
		prev.textContent = "previous";
		next.textContent = "next";
		prev.className = "off"; // assuming that we are on first no previous

		controls.insertBefore(prev, notice);		
		controls.appendChild(next);
		
		util.bindEvent(next, 'click', function(e){
		   move(current+1);
		});
		
		util.bindEvent(prev,  'click',function(e){
		   move(current-1);
		});			
	};
	
	/** resize all the images height only so it never scrolls
	*/
	var resizeAllImages = function(){
		var imgSize = util.getWindowHeight() - subHeight; 
		for (var z=0; z < allImages.length; z++) {
			allImages[z].style.height = imgSize + "px";				
		}
	};
	
	/** make image fit the browser height wise... 
	*/
	var resizeToFit = function(){		
		var h2 = document.getElementsByTagName('h2')[0]; // assume no 2 liners ffs
		var h3 = document.getElementsByTagName('h3')[0]; // get their heights
		
		allImages = document.getElementsByTagName('img'); // cache all images
		subHeight = util.getH(controls) + util.getH(h1) + util.getH(h2) + util.getH(h3) + 80;
		
		resizeAllImages(); // resize on load
		util.bindEvent(window, "resize", resizeAllImages); // resize on resize
	};
		
	/** make the list of photos
	*/
	var makePhotos = function(photoset) {
		set.innerHTML = ""; // children be gone
		setLength = photoset.total; // how many photos we got in this set
		var frag = document.createDocumentFragment(); // make a dom snippet for insert
		
		for (var i = 0; i < setLength; i++) {
			var aPhoto =  photoset.photo[i];
			
			// making our own url since flickr does not return large in extras...
			var photoURL = 'http://farm' + aPhoto.farm + '.staticflickr.com/' + aPhoto.server + '/' + aPhoto.id + '_' + aPhoto.secret + '_' + PHOTO_SIZE + '.jpg';
			
			var newLi = document.createElement('li');
			var newPhoto = document.createElement('div');
			var newTitle = document.createElement('h2');
			var newOwner = document.createElement('h3');
			var newImage = document.createElement('img');
			
			newImage.src = photoURL;
			newOwner.innerHTML = aPhoto.ownername;
			newTitle.innerHTML = aPhoto.title;		
			newPhoto.setAttribute('class', "photo");
			
			newPhoto.appendChild(newImage);
			newPhoto.appendChild(newTitle);
			newPhoto.appendChild(newOwner);
			newLi.appendChild(newPhoto);			
			frag.appendChild(newLi);
		}
		
		set.appendChild(frag);
		
		setupPrevNext(); 
		resizeToFit();
	};
	
	/** build the request url for flickr rest api based on params
	*/
	var buildRequestURL = function() {
		var requestURL = API_URL;		
		for (var param in API_PARAMS) {
			if (API_PARAMS.hasOwnProperty(param)) {
				requestURL += "&" + param + "=" + API_PARAMS[param];
			}
		}		
		return requestURL;
	};
	
	/** check the response we got from flickr for fail states
	*/
	var checkResponse = function(flickr_response) {
		switch(flickr_response.stat) {
			case "ok" :
				notice.innerHTML = "1/" + flickr_response.photoset.total;
				makePhotos(flickr_response.photoset);				
				break;				
			case "fail" :
				notice.innerHTML = "flickr fail : "+ flickr_response.code + " " + flickr_response.message;
				break;
		}		
	};
	
	/** make JSONP request
	*/
	var makeRequest = function() {	
		var newScript = document.createElement('script');
		newScript.src = buildRequestURL();
		head.appendChild(newScript);
	};
	
	/** get necessary dom elements for cacheing
	*/
	var getParts = function() {
		head = document.getElementsByTagName('head')[0] || document.documentElement;
		h1 = document.getElementsByTagName('h1')[0];
		notice = document.getElementById("notice");
		set = document.getElementById("set");
		controls = document.getElementById("controls");
	
		notice.innerHTML="preparing to do stuff";
	};
	
	return {
		init : function() {
			getParts();
			makeRequest();			
		},
		
		// jsonp response handler 
		gotResponse : function(response) {
			checkResponse(response);
		}
	}
}(SAMPLE.CrossBrowserUtil); // self invoke while passing util obj

// not using dom ready since we're loading at bottom
SAMPLE.GetFlickrSet.init();
