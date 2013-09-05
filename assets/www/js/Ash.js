if(!window.A) { 
  var Ash = {};
  
  Ash.assert = function(element) {
    if(!element){
      throw {
        level:  "Error",
        code: 1,
        message: "Element not found!"
      }
    }
  };
  
  Ash.assertEqual = function(valA, valB) {
    if(!(valA === valB)){
      throw {
        level:  "Error",
        code: 2,
        message: "Elements aren't equal!"
      }
    }
  };
  
  Ash.eventTimeout = 30;  //most browsers won't react under 25, 30 seems to work fine 
  
  Ash.orientationHorizontal = function(testSuite) {
    return cordova.exec( 
      function(){
        //FIXME: walkaround for event synchronization problem
        setTimeout(testSuite, Ash.eventTimeout);
      }, 
      function() { alert("Couldn't call orientationHorizontal"); }, 
      "pl.ug.ash.AshPlugin", 
      "orientationHorizontal", 
      []);
  };
  
  Ash.orientationVertical = function(testSuite) {
    return cordova.exec( 
      function(){
        //FIXME: walkaround for event synchronization problem
        setTimeout(testSuite, Ash.eventTimeout);
      },
      function() { alert("Couldn't call orientationVertical"); }, 
      "pl.ug.ash.AshPlugin", 
      "orientationVertical", 
      []);
  };
  
  Ash.noNetwork = function(testSuite) {
    return cordova.exec( 
      function(){
        testSuite();
      },
      function() { alert("Couldn't call noNetwork"); }, 
      "pl.ug.ash.AshPlugin", 
      "networkOff", 
      []);
  };
  
  window.A = Ash;
}