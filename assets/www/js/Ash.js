if(!window.A) { 
  var Ash = {};

  Ash.config = function(data){
    this.app = data.app || "";
    this.appVersion = data.appVersion || "";
    this.desc = data.desc || "";
    this.timestamp = new Date();
    this.key = data.key || "";
    
    return this;
  },
  
  Ash.run = function(tests, failureCallback, successCallback){
    var testSuite = (Object.prototype.toString.call(tests) === "[object Array]") ? tests : this._extractTests(tests);
    var testSuiteLen = testSuite.length;
    var results = {testNum: testSuiteLen, success: [], failure: []};
    
    //TODO: tests return results in an async manner, runner should be rewritten to meet this demand
    //  and call callback each time when function finished for good 
    for(var i in testSuite){
      try{
        testSuite[i]();
        //TODO: gather data about tests run (names, stacktraces, ...)
        results.success.push(i);
      }
      catch(testFailure){
    	  alert(JSON.stringify(testFailure));
        var error = this._processException(testFailure);
        results.failure.push(error);
      }
    }
    
    if(results.failure.length === 0){
      if(typeof(successCallback) === "function"){
        successCallback(results);
      }
    }else{
      if(typeof(failureCallback) === "function"){
        failureCallback(results);
      }
    }
  },
  
  Ash._extractTests = function(testObj){
    var testSuite = [];
    var searchPhrase = "Test";
    var searchPhraseLen = searchPhrase.length;
  
    for(var prop in testObj){
      var isFunction = typeof(testObj[prop]) === "function";
      var hasName = prop.indexOf(searchPhrase, this.length - searchPhraseLen) !== -1
      if(isFunction && hasName){
        testSuite.push(testObj[prop]);
      }
    }
    return testSuite;
  },
  
  Ash._processException = function(testFailure){
    var level = testFailure.level || "Exception";
    var code = testFailure.code || 1;
    var message = testFailure.message || "Runtime error";
    return {level: level, code: code, message: message};
  },
  
  Ash.assert = function(element) {
    if(!element){
      //TODO: rethink exception internals, so they allow easy processing 
      throw {
        level:  "Error",
        code: 2,
        message: "Element not found!"
      }
    }
  };
  
  Ash.assertEqual = function(valA, valB) {
    if(!(valA === valB)){
      throw {
        level:  "Error",
        code: 3,
        message: "Elements " + JSON.stringify(valA).substring(0,20) + 
          " and " + JSON.stringify(valB).substring(0,20) + " aren't equal!"
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