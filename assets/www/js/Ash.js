if(!window.A) { 
  var Ash = {};
  
  Ash.assert = function(element) {
    if(!element){
      throw {
        level:  "Error",
        message: "Element not found!"
      }
    }
  }
  
  Ash.assertEqual = function(valA, valB) {
    console.log("Comapring " + valA + "===" + valB + " " + (valA === valB));
    if(!(valA === valB)){
      throw {
        level:  "Error",
        message: "Elements aren't equal!"
      }
    }
  }
  
  Ash.orientationHorizontal = function(testSuite) {
    return cordova.exec( 
      function(){
        window.orientation = 90;
        $(window).trigger("orientationchange");
        testSuite();
        }, 
      function() { alert("Fail"); }, 
      "pl.ug.ash.AshPlugin", 
      "orientationHorizontal", 
      []);
  }
  
  Ash.orientationVertical = function(testSuite) {
    return cordova.exec( 
      function(){
        setInterval(testSuite, 5000);
      },
      function() { alert("Fail"); }, 
      "pl.ug.ash.AshPlugin", 
      "orientationVertical", 
      []);
  }
  
  window.A = Ash;
}