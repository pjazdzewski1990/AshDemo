var app = {
  currentScreen: 0,
  screens: ["#orientationScreen", "#connectionScreen", "#recordScreen", "#locationScreen", "#visibilityScreen"],

  initialize: function() {
    this.bindEvents();
  },
  
  bindEvents: function() {
    document.addEventListener('deviceready', this.onDeviceReady, false);
    //we separate the event handling from logic so the code is more testable
    $(window).on("orientationchange", function(e){
      e.stopPropagation();
      app.orientationChange();
    });
    $('.app').on("click", function(e){
      e.stopPropagation();
      app.toggleAdvert();
    });
    $("#recordButton").on("click", function(e){
      e.stopPropagation();
      app.recordAudio();
    });
    $("#hideButton").on("click",  function(e){
      e.stopPropagation();
      app.hideElements();
    });
    $("#showButton").on("click", function(e){
      e.stopPropagation();
      app.showElements();
    });
    $("#prev").on("click", function(e){
      e.stopPropagation();
      var pos = (app.currentScreen-1)%app.screens.length;
      app.gotoScreen(pos>0 ? pos : app.screens.length-1);
    });
    $("#next").on("click", function(e){
      e.stopPropagation();
      var pos = (app.currentScreen+1)%app.screens.length;
      app.gotoScreen(pos);
    });
  },
  
  onDeviceReady: function() {
    app.gotoScreen(0);
    
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
    
  gotoScreen: function(num){
    $(".screen").hide();
    $(app.screens[num]).show();
    app.currentScreen = num;
  },
  
  orientationChange: function(e) {
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
    
    //TODO: for some reason timeout is reached
    /*navigator.geolocation.watchPosition(
      app.positionChanged, 
      error, 
      {timeout: 3000});*/
  },

  positionChanged: function(position) {
    console.log("Position Changed new is : " + JSON.stringify(position));
    $('#locationDiv').addClass("blink");
    $('#locationField').
      html(position.coords.latitude + ' ' + position.coords.longitude).
      css("display", "block");
  },

  hideElements: function() {
    console.log("Hiding elements");
//    $('#visibilityHiddenField').css("visibility", "hidden");
    $('#displayNoneField').css("display", "none");
//    $('#outOfScreenField').offset({ top: 5000, left: 5000});
  },

  showElements: function() {
    console.log("Showing elements");
//    $('#visibilityHiddenField').css("visibility", "visible");
    $('#displayNoneField').css("display", "block");
//    $('#outOfScreenField').offset({ top: 1100, left: 450});
  },
  
  toggleAdvert: function() {
    $('.app').toggleClass("advertisement");
  }
};
//TODO: make a self-calling function
window.app = app;
