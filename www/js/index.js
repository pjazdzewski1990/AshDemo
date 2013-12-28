var app = {
  initialize: function() {
    this.bindEvents();
  },
  
  bindEvents: function() {
    document.addEventListener('deviceready', this.onDeviceReady, false);
    $(window).on("orientationchange", this.orientationChange);
    $("#recordButton").on("click", this.recordAudio);
    $("#hideButton").on("click", this.hideElements);
    $("#showButton").on("click", this.showElements);
    $('.app').on("click", this.toggleAdvert);
  },
  
  onDeviceReady: function() {
    app.receivedEvent('deviceready');
    app.setConnectionBox();
    
    app.setGeoCapture();

    Ash.loadTests(["test/example.js"]);
  },
  
  receivedEvent: function(id) {
    var parentElement = document.getElementById(id);
    var listeningElement = parentElement.querySelector('.listening');
    var receivedElement = parentElement.querySelector('.received');

    listeningElement.setAttribute('style', 'display:none;');
    receivedElement.setAttribute('style', 'display:block;');
  },
  
  orientationChange: function(e) {
    alert("orientation change");
    var div = document.getElementById('deviceorientationField');
    div.setAttribute('style', 'display:block;');
    if(window.orientation == -90 || window.orientation == 90) {
      div.innerHTML = "landscape";
    } else {
      div.innerHTML = "portrait";
    }
  },
  
  setConnectionBox: function () {
    var networkState = navigator.connection.type;

    var states = {};
    states[Connection.UNKNOWN]  = 'Unknown connection';
    states[Connection.ETHERNET] = 'Ethernet connection';
    states[Connection.WIFI]     = 'WiFi connection';
    states[Connection.CELL_2G]  = 'Cell 2G connection';
    states[Connection.CELL_3G]  = 'Cell 3G connection';
    states[Connection.CELL_4G]  = 'Cell 4G connection';
    states[Connection.NONE]     = 'No network connection';

    var box = document.getElementById('connectionField');
    box.setAttribute('style', 'display:block;');
    $(box).text(states[networkState]);
  },
  
  captureSuccess: function(mediaFiles) {
    alert("capture");
    $('#recordDiv').addClass("blink");
    
    var field = $('#recordField');
//    field.removeClass("listening");
//    field.addClass("received");
    field.html(mediaFiles[0].name);
    
    field.on('tap', function(e){
      mediaFiles[0].play();
    });
  },

  recordAudio: function() {
    alert("record");
    var captureError = function(error) { 
      alert("Blad! " + JSON.stringify(error));
    };
    navigator.device.capture.captureAudio(this.captureSuccess, captureError, {limit:1});
  },

  setGeoCapture: function(){
    var error = function(err){
      alert("GeoError " + JSON.stringify(err));
    };
    
    navigator.geolocation.watchPosition(
      app.positionChanged, 
      error, 
      {timeout: 300});
  },

  positionChanged: function(position) {
    alert("positionChanged" + JSON.stringify(position));
    $('#locationDiv').addClass("blink");
    $('#locationField').
      html(position.coords.latitude + ' ' + position.coords.longitude).
      css("display", "block");
  },

  hideElements: function() {
    alert("hide");
//    $('#visibilityHiddenField').css("visibility", "hidden");
    $('#displayNoneField').css("display", "none");
//    $('#outOfScreenField').offset({ top: 5000, left: 5000});
  },

  showElements: function() {
    alert("show");
//    $('#visibilityHiddenField').css("visibility", "visible");
    $('#displayNoneField').css("display", "block");
//    $('#outOfScreenField').offset({ top: 1100, left: 450});
  },
  
  toggleAdvert: function() {
    alert("advert");
    $('.app').toggleClass("advertisement");
  }
};
//TODO: make a self-calling function
window.app = app;
