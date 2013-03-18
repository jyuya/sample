window.MAMO = window.MAMO || {};

MAMO = function(){
	
	var socketServer;
	var paused = false;
	
	/** audio
	*/
	var setupAudio = function(){
		var audio = $("audio");
		if (!audio.length) {
			return false; // no video
		}
		
		if (io) {
			var audioSocket = io.connect(socketServer);
			
			audioSocket.on('change', function (data) {
				audio.attr('src', '/audios/' + data.item + '.mp3');
				audio[0].play();
			});
		}
	};
	
	/** video
	*/
	var setupVideo = function(){
		var video = $("video");
		if (!video.length) {
			return false; // no video
		}

		$(video).attr('muted', true); // default video is muted
		$(video).bind("click", function(){ 
			if (paused) {
				video[0].play(); 
				paused = false;
			} else {
				video[0].pause(); 
				paused = true;
			}
		});
		
		if (io) {
			var videoSocket = io.connect(socketServer);
			videoSocket.on('change', function (data) {
				video.animate({
					opacity: 0
				}, 1000, function() {
				    video.attr('src', '/videos/' + data.item + '.mov');
					video.animate({ opacity: 1 }, 1000, function(){
						video[0].play();
					});
				});
			});
		}
	};

	/** controls
	*/
	var setupControls = function() {
		var controls = $("#controls");
		if (!controls.length) {
			return false; // no controls
		}
		if (io) {
			var controlSocket = io.connect(socketServer);
		} 
		
		var buttons = $("a", controls);
		buttons.bind("click", function(e){
			e.preventDefault();
			buttons.removeClass("on");
			$(this).addClass("on");
			var item = $(this).attr("rel");
			if (io) {
				controlSocket.emit('select', { selected: item });
			}
		});
	};
	
	/** image
	*/
	var setupImage = function() {
		var image = $("#screenImage");
		if (!image.length) {
			return false; // no controls
		}
		if (io) {
			var imageSocket = io.connect(socketServer);
			imageSocket.on('change', function (data) {
				image.animate({
					opacity: 0
				}, 1000, function() {
				    image.attr('src', '/images/' + data.item + '.jpg');
					image.animate({ opacity: 1 }, 1000);
				});
			});
		}
	};
	
	return {
		init : function(){
			if (typeof io == 'undefined') {
				io = false;
			}
			socketServer = 'http://' + window.location.host;
			setupVideo();
			setupControls();
			setupImage();
			setupAudio();
		}
	}
}();


$(document).ready(function(){
	MAMO.init();
});