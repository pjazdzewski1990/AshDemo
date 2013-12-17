(function(win){

  if(!win.A) { win.A = {}; }

  win.A.assert = function(element) {
    if(!element){
      //TODO: rethink exception internals, so they allow easy processing 
      throw {
        level:  "Error",
        code: 2,
        message: "Element not found!",
        toString: function(){return JSON.stringify(this);}
      }
    }
  };
  
  win.A._hidden = function(element) {
//    var outOfScreen = function(){
//      var height = element.clientHeight;
//      var width = element.clientWidth;
//      var vertical = element.offsetTop + height < 0 || 
//        element.offsetTop > document.body.offsetHeight;
//      var horizontal = element.offsetLeft + width < 0 || 
//        element.offsetLeft > document.body.offsetWidth;
//      return vertical || horizontal
//    };
//
    var displayNone = element.style && element.style.display === "none";
//    var noVisibility = ["hidden", "collapse"].indexOf(element.style.visibility)>-1;
//    console.log("_hidden: " + displayNone + " " + noVisibility + " " + outOfScreen() + " " + element.hidden);
    return displayNone ;//|| noVisibility || 
      /*outOfScreen() || element.hidden*/;
  };
  
  win.A.visible = function(element){
    if(this._hidden(element)){
      throw {
        level:  "Error",
        code: 3,
        message: "Element " + element.id.substring(0,20) + " is not visible!",
        toString: function(){return JSON.stringify(this);}
      }
    }
  };
  
  win.A.invisible = function(element){
    if(!this._hidden(element)){
      throw {
        level:  "Error",
        code: 3,
        message: "Element " + element.id.substring(0,20) + " is visible!",
        toString: function(){return JSON.stringify(this);}
      }
    }
  };
  
  win.A.equal = function(valA, valB) {
    if(!(valA === valB)){
      throw {
        level:  "Error",
        code: 3,
        message: "Elements " + JSON.stringify(valA).substring(0,20) + 
          " and " + JSON.stringify(valB).substring(0,20) + " aren't equal!",
        toString: function(){return JSON.stringify(this);}
      }
    }
  };
  
  win.A.loadTests = function(tests){
    var script = document.createElement('script');
    script.src = "js/ash.js";
    script.onload = function () {
      //alert("ash loaded! A? " + A);
      for(var i=0; i<tests.length; i++){
          var script = document.createElement('script');
          script.src = tests[0];
          document.head.appendChild(script);
      }
    };
    document.head.appendChild(script);
  }
})(window);