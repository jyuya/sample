/* WPFE canvas loaded event ------------------------------------------------------ */
function root_Loaded(sender, args) {
    var videoURL = "videos/xbox.wmv";
    var videoTitle = "zomg teh xbox";
    
    var myPlayer = new videoPlayer(document.getElementById("WPFEMainPlayer"), videoTitle, videoURL);

    /* animations */
    //downFoldout = sender.content.findName("downFoldout");
    //downReverse = sender.content.findName("downReverse");
    //sideFoldout = sender.content.findName("sideFoldout");
    //sideReverse = sender.content.findName("sideReverse");
}

/* Animation related routines ---------------------------------------------------- */

function doDownReverse(sender, e) {
    sender.content.findName("downMask").StartPoint="0.5,0.0";
    sender.content.findName("downMask").EndPoint="0.5,1.0";
    //downReverse.Begin();
}
function doSideReverse(sender, e) {
    sender.content.findName("sideMask").StartPoint="0.0,0.5";
    sender.content.findName("sideMask").EndPoint="1.0,0.5";
    //sideReverse.Begin();
}

/* A video player object with three videos -------------------------------------- */
function videoPlayer(wpfeControl, videoName, videoSource) {
    this.wpfeControl = wpfeControl;
            
    /* properties of videoplayer object */
    this.videoTitle = wpfeControl.content.findName("VideoName");
    this.videoDuration = wpfeControl.content.findName("VideoLength");
    this.videoCurrentPosition = wpfeControl.content.findName("VideoCurrentLength");
    this.mainVideo = this.wpfeControl.content.findName("Video");
    this.info = this.wpfeControl.content.findName("Information");
    this.videoControls = wpfeControl.content.findName("VideoControls");
    
    this.playButton = wpfeControl.content.findName("PlayButton");
    this.playIcon = this.wpfeControl.content.findName('PlayIcon')
    this.playBG = this.wpfeControl.content.findName('PlayBG')
    
    this.pauseButton = wpfeControl.content.findName("PauseButton");
    this.pauseIcon1 = this.wpfeControl.content.findName('PauseIchi')
    this.pauseIcon2 = this.wpfeControl.content.findName('PauseNi')
    this.pauseBG = this.wpfeControl.content.findName('PauseBG')
    
    this.stopButton = wpfeControl.content.findName("StopButton");
    this.stopIcon = this.wpfeControl.content.findName('StopIcon')
    this.stopBG = this.wpfeControl.content.findName('StopBG')
    
    this.statusBarDefault = this.wpfeControl.content.findName('DefaultStatus');
    this.statusBarLoad = this.wpfeControl.content.findName('LoadStatus');
    this.playHead = this.wpfeControl.content.findName('PlayHead');
    this.statusBars = this.wpfeControl.content.findName('StatusBars');
    
    this.noteButton = this.wpfeControl.content.findName("NoteButton");
    this.noteIcon = this.wpfeControl.content.findName("NoteIcon");
    this.volumeSlider = this.wpfeControl.content.findName("VolumeSlider");
    this.volumeHitArea = this.wpfeControl.content.findName("VolumeHitArea");
    this.volumeScale = this.wpfeControl.content.findName("VolumeScale");
    this.volumeHead = this.wpfeControl.content.findName("VolumeHead");
    this.volumeScaleArea = this.wpfeControl.content.findName("VolumeScaleArea");
    
    /* set some properties known right away*/
    this.videoTitle.Text = videoName;
    this.interval = 10;           
    this.downloadProgress = 0;     
    this.dragging = false;
    this.volumeDragging = false;
    this.volumeOn = true;
    
    this.videoArray = new Array();
    this.videoArray[0] = wpfeControl.content.findName("Video");
    this.videoArray[1] = wpfeControl.content.findName("VideoReflectDown");
    this.videoArray[2] = wpfeControl.content.findName("VideoReflectSide");

    for (v in this.videoArray) {
        if (v != 0 ) {
            this.videoArray[v].isMuted = "1";
            this.videoArray[v].Opacity = "0";
        }
        this.videoArray[v].Source = videoSource;
        this.videoArray[v].AutoPlay = 0;
        this.videoArray[v].stop();
    }
    this.video = this.videoArray[0];     // the main video we are concerned with
    
    /* CONSTANTS!!!! mostly bc fullscreen is silly */
    this.fullscreenControlPadding = 10;
    this.controlBGColor = this.wpfeControl.BackgroundColor;
    this.defaultVideoLeft = this.mainVideo["Canvas.Left"];
    this.defaultVideoWidth = this.mainVideo.width;
    this.defaultVideoHeight = this.mainVideo.height;
    this.defaulControlsTop = this.videoControls["Canvas.Top"];
    this.defaulControlsLeft = this.videoControls["Canvas.Left"];
    this.defaulInfoTop = this.info["Canvas.Top"];
    this.defaulInfoLeft = this.info["Canvas.Left"];
    
    /* event handlers */

   // setCallback(this.wpfeControl, "fullScreenChanged", delegate(this, this.handleFullScreenChanged));

    setCallback(this.video, "mouseLeftButtonUp", delegate(this, this.handleVideoClick));

    setCallback(this.playButton, "mouseLeftButtonUp", delegate(this, this.playPress));
    setCallback(this.playButton, "mouseEnter", delegate(this, this.handlePlayMouseOver));
    setCallback(this.playButton, "mouseLeave", delegate(this, this.handlePlayMouseOut));
    setCallback(this.playButton, "mouseLeftButtonDown", delegate(this, this.handlePlayMouseDown));
    
    setCallback(this.pauseButton, "mouseLeftButtonUp", delegate(this, this.pausePress));
    setCallback(this.pauseButton, "mouseEnter", delegate(this, this.handlePauseMouseOver));
    setCallback(this.pauseButton, "mouseLeave", delegate(this, this.handlePauseMouseOut));
    setCallback(this.pauseButton, "mouseLeftButtonDown", delegate(this, this.handlePauseMouseDown));
    
    setCallback(this.stopButton, "mouseLeftButtonUp", delegate(this, this.stopPress));
    setCallback(this.stopButton, "mouseEnter", delegate(this, this.handleStopMouseOver));
    setCallback(this.stopButton, "mouseLeave", delegate(this, this.handleStopMouseOut));
    setCallback(this.stopButton, "mouseLeftButtonDown", delegate(this, this.handleStopMouseDown));
    
    setCallback(this.statusBars, "mouseLeftButtonDown", delegate(this, this.handlePlayHeadPress));
    setCallback(this.statusBars, "mouseLeftButtonUp", delegate(this, this.handlePlayHeadRelease));
    setCallback(this.statusBars, "mouseMove", delegate(this, this.handlePlayHeadDrag));
    
    setCallback(this.noteButton, "mouseLeftButtonUp", delegate(this, this.toggleVolume));
    setCallback(this.noteButton, "mouseEnter", delegate(this, this.showVolumeSlider));
    setCallback(this.volumeHitArea, "mouseLeave", delegate(this, this.hideVolumeSlider));
    setCallback(this.volumeSlider, "mouseEnter", delegate(this, this.showVolumeSlider));
    
    setCallback(this.volumeScaleArea, "mouseLeftButtonDown", delegate(this, this.handleVolumeHeadPress));
    setCallback(this.volumeScaleArea, "mouseLeftButtonUp", delegate(this, this.handleVolumeHeadRelease));
    setCallback(this.volumeScaleArea, "mouseMove", delegate(this, this.handleVolumeHeadDrag));
 
    setCallback(this.video, "MediaOpened", delegate(this, this.setVideoLength));
    setCallback(this.video, "downloadProgressChanged", delegate(this, this.handleDownloadProgressChanged));
    setCallback(this.video, "MediaEnded", delegate(this, this.handleVideoEnd));
   
    setCallback(this.videoArray[1], "downloadProgressChanged", delegate(this, this.reflectDownDownloadProgressChanged));
    setCallback(this.videoArray[2], "downloadProgressChanged", delegate(this, this.reflectSideDownloadProgressChanged));
}

/* video prototype functions ---------------------------------------------------- */

videoPlayer.prototype.reflectDownDownloadProgressChanged = function() {
    this.syncReflection(this.videoArray[1], 1);
}
videoPlayer.prototype.reflectSideDownloadProgressChanged = function() {
    this.syncReflection(this.videoArray[2], 2);
}
videoPlayer.prototype.syncReflection = function(reflection, videoNum) {
    if (reflection.downloadProgress == "1") {
        reflection.Opacity = "1";
        reflection.position.seconds = this.video.position.seconds;
        if (videoNum == 1) 
            downFoldout.Begin();
        if (videoNum == 2) 
            sideFoldout.Begin();
        reflection.play();
    }
}

/* FULL SCREEN handlers */

videoPlayer.prototype.handleVideoClick = function() {
    this.wpfeControl.content.fullScreen = true;
}
videoPlayer.prototype.videoScale = function(oWPFE, oVideo, heightOffset) {
    heightOffset = heightOffset + this.fullscreenControlPadding;
    var widthScale = oWPFE.content.actualWidth/oVideo.NaturalVideoWidth;
    var heightScale = (oWPFE.content.actualHeight-heightOffset)/oVideo.NaturalVideoHeight;
    var scale = "";
        if (widthScale > heightScale) 
            scale = heightScale;
        else 
            scale = widthScale;
   oVideo.width = oVideo.NaturalVideoWidth * scale;
   oVideo.height = oVideo.NaturalVideoHeight * scale;
}
videoPlayer.prototype.handleFullScreenChanged= function() {
   if ( this.wpfeControl.content.fullScreen ) {
        this.videoScale(this.wpfeControl, this.mainVideo, this.videoControls.height);
        var extraWidth = (this.wpfeControl.content.actualWidth - this.mainVideo.width)/2;
        var controlsTop = this.mainVideo.height + this.fullscreenControlPadding;
        this.mainVideo["Canvas.Left"] = extraWidth;
        this.videoControls["Canvas.Top"]= controlsTop;
        this.videoControls["Canvas.Left"]= this.mainVideo.width - this.videoControls.width;
        this.info["Canvas.Left"] = extraWidth;
        this.info["Canvas.Top"] = controlsTop; 
        this.wpfeControl.BackgroundColor="#333";
        this.videoArray[1].opacity = 0;
        this.videoArray[2].opacity = 0;
    } else {
        this.mainVideo["Canvas.Left"] = this.defaultVideoLeft;
        this.mainVideo.width = this.defaultVideoWidth;
        this.mainVideo.height = this.defaultVideoHeight;
        this.videoControls["Canvas.Top"]= this.defaulControlsTop;
        this.videoControls["Canvas.Left"]= this.defaulControlsLeft;
        this.info["Canvas.Top"] = this.defaulInfoTop;
        this.info["Canvas.Left"] = this.defaulInfoLeft;
        this.wpfeControl.BackgroundColor= this.controlBGColor;
        this.videoArray[1].opacity = 1;
        this.videoArray[2].opacity = 1;
    }
}

/* PROGRESS BAR handlers */

videoPlayer.prototype.movePlayHead = function(x) {
    this.playHead["Canvas.Left"] = x;
}
videoPlayer.prototype.updatePlayhead = function(elapsedTime) {
	var offset = 0;
	if (this.video.naturalDuration != null) {
		var percent = elapsedTime / this.video.naturalDuration.seconds;
		var playAreaWidth = this.statusBarLoad.width - this.playHead.width;
		offset = playAreaWidth * percent;
	}
	this.videoCurrentPosition.Text  = formatTime(elapsedTime);
	this.movePlayHead(offset);
}
videoPlayer.prototype.handleDownloadProgressChanged = function() {
	this.statusBarLoad.width = (this.statusBarDefault.width-2) * this.video.downloadProgress;
	if (this.video.downloadProgress == 1) this.playPress();
}
videoPlayer.prototype.refreshPlayTime = function() {
	var currentPosition = 0
	var position = this.video.position;
	if (position != null)
		currentPosition = position.seconds;
	this.updatePlayhead(currentPosition);
}
videoPlayer.prototype.handlePlayHeadPress = function(sender, e) {
    this.dragging = true;
    this.statusBars.captureMouse();
    this.seekFromMouse(e.getPosition(null).X);
}
videoPlayer.prototype.handlePlayHeadRelease = function() {
    this.dragging = false;
    this.statusBars.releaseMouseCapture();
}
videoPlayer.prototype.handlePlayHeadDrag = function(sender, e) {
  if (this.dragging) 
    this.seekFromMouse(e.getPosition(null).X);
}
videoPlayer.prototype.seekFromMouse = function(mouseX) {
    var mediaDuration = this.video.naturalDuration.seconds;
	var playheadWidth = this.playHead.width;
	var playAreaWidth = this.statusBarLoad.width - playheadWidth;
	var currentPlayTime = (mouseX - this.videoControls["Canvas.Left"] - this.statusBars["Canvas.left"] - playheadWidth / 2) / playAreaWidth * mediaDuration;
	if (currentPlayTime > mediaDuration)
		currentPlayTime = mediaDuration;
	else if (currentPlayTime < 0)
		currentPlayTime = 0;
    var positionArray = new Array();
    for (v in this.videoArray) {
	    positionArray[v] = this.videoArray[v].position;
	    positionArray[v].seconds = currentPlayTime;
	    this.videoArray[v].position = positionArray[v];
	}
	this.updatePlayhead(currentPlayTime);
}

/* GENERAL VIDEO STATE handlers */

videoPlayer.prototype.setVideoLength = function() {
    this.videoDuration.Text = formatTime(this.video.naturalDuration.seconds);
}
videoPlayer.prototype.handleVideoEnd = function() {
    clearInterval(this.timerID);
    this.movePlayHead(this.statusBarDefault.width - this.playHead.width);
}

/* VOLUME RELATED handlers */

videoPlayer.prototype.showVolumeSlider = function() {
    this.volumeSlider.Opacity="1";
}
videoPlayer.prototype.hideVolumeSlider = function() {
    this.volumeSlider.Opacity="0";
}
videoPlayer.prototype.toggleVolume = function() {
    if (this.volumeOn) {
        this.video.isMuted = "0";
        this.volumeOn = false;
        this.noteIcon.Fill="#fff";
        this.noteIcon.Stroke="#fff";
    } else {
        this.video.isMuted = "1";
        this.volumeOn = true;
        this.noteIcon.Fill="#000";
        this.noteIcon.Stroke="#000";
    }
}
videoPlayer.prototype.moveVolumeHead = function(mouseX) {
	var start = this.volumeScale["Canvas.Left"] - this.volumeHead.width/2;
	var end = this.volumeScale["Canvas.Left"] + this.volumeScale.width - this.volumeHead.width/2;
	var x = mouseX - this.videoControls["Canvas.Left"] - this.volumeSlider["Canvas.Left"] - start;
    if (x > end) 
        x = end;
    else if (x < start) 
        x = start;  
    this.video.volume = x/(end-start);
    this.volumeHead["Canvas.Left"] = x;
}
videoPlayer.prototype.handleVolumeHeadPress = function(sender, e) {
    this.volumeDragging = true;
    this.volumeScaleArea.captureMouse();
    this.moveVolumeHead(e.X);
}
videoPlayer.prototype.handleVolumeHeadRelease = function() {
    this.volumeDragging = false;
    this.volumeScaleArea.releaseMouseCapture();
}
videoPlayer.prototype.handleVolumeHeadDrag = function(sender, e) {
  if (this.volumeDragging) 
    this.moveVolumeHead(e.X);
}

/* VIDEO CONTROLS handlers */

videoPlayer.prototype.pausePress = function() {
    for (v in this.videoArray) {
        this.videoArray[v].pause();
    }
    this.togglePausePlay("play");
}
videoPlayer.prototype.playPress = function() {
    this.timerID = window.setInterval(delegate(this, this.refreshPlayTime), this.interval);
    for (v in this.videoArray) {
        this.videoArray[v].play();
    }
    this.togglePausePlay("pause");
}
videoPlayer.prototype.stopPress = function() {
    for (v in this.videoArray) {
        this.videoArray[v].stop();
    }
    this.togglePausePlay("play");
    clearInterval(this.timerID);
    this.movePlayHead(0);
}
videoPlayer.prototype.togglePausePlay = function(action) {
    if (action == "pause") {
        this.playButton.Opacity = "0"
        this.pauseButton.Opacity = "1"
    } else {
        this.playButton.Opacity = "1"
        this.pauseButton.Opacity = "0"
    }
}
videoPlayer.prototype.handlePlayMouseOver = function() {
    vectorOver(this.playIcon, this.playBG);
}
videoPlayer.prototype.handlePlayMouseOut = function() {
    vectorOut(this.playIcon, this.playBG);
}
videoPlayer.prototype.handlePlayMouseDown = function() {
    vectorDown(this.playIcon, this.playBG);
}
videoPlayer.prototype.handleStopMouseOver = function() {
    vectorOver(this.stopIcon, this.stopBG);
}
videoPlayer.prototype.handleStopMouseOut = function() {
    vectorOut(this.stopIcon, this.stopBG);
}
videoPlayer.prototype.handleStopMouseDown = function() {
    vectorDown(this.stopIcon, this.stopBG);
}
videoPlayer.prototype.handlePauseMouseOver = function() {
    vectorOver(this.pauseIcon1, this.pauseBG);
    vectorOver(this.pauseIcon2, this.pauseBG);
}
videoPlayer.prototype.handlePauseMouseOut = function() {
    vectorOut(this.pauseIcon1, this.pauseBG);
    vectorOut(this.pauseIcon2, this.pauseBG);
}
videoPlayer.prototype.handlePauseMouseDown = function() {
    vectorDown(this.pauseIcon1, this.pauseBG);
    vectorDown(this.pauseIcon2, this.pauseBG);
}

/* helper functions ------------------------------------------------------------- */

function vectorOver(o, oBG) {
    o.Stroke = "#333";
    oBG.Fill="#ccc";
    oBG.Stroke="#666";
}
function vectorOut(o, oBG) {
    o.Stroke = "#666";
    oBG.Fill="#aaa";
    oBG.Stroke="#666";
}
function vectorDown(o, oBG) {
    o.Stroke = "#000";
    oBG.Fill="#666";
    oBG.Stroke="#aaa";
}
function formatTime(time) {	
	var datetime = new Date(0, 0, 0, 0, 0, time)
    var hours = datetime.getHours();
    var minutes = datetime.getMinutes();
    var seconds = datetime.getSeconds();
	if (minutes < 10)
		minutes = "0" + minutes;
	if (seconds < 10)
	    seconds = "0" + seconds;   
	return minutes+":"+seconds;
}
function delegate(target, callback) {
    var func = function() {
        callback.apply(target, arguments);
    }
    return func;
}
function setCallback(target, eventName, delegate) {
    if (!window.methodID)
        window.methodID = 0;
    var callbackName = "uniqueCallback" + (window.methodID++);
    eval(callbackName + " = delegate;");
    target.addEventListener(eventName, callbackName);
}
// temporary hax
function changeBG(color){
        var mybody = document.getElementById("vp");
        mybody.style.backgroundColor = color;
    }