if(!window.A) { 
  var Ash = {};

  Ash._storedErrorCallback = window.onerror;
  
  Ash.config = function(data){
    this.app = data.app || "";
    this.appVersion = data.appVersion || "";
    this.desc = data.desc || "";
    this.timestamp = new Date();
    this.key = data.key || "";
    
    return this;
  },
  
  Ash.upload = function(resultToUpload){
   //TODO:
  },
  
  Ash.endTest = null, //setup in Ash.run()
  
  Ash.run = function(tests, failureCallback, successCallback){
    var testSuite = (Object.prototype.toString.call(tests) === "[object Array]") ? tests : this._extractTests(tests);
    var testSuiteLen = testSuite.length;
//    var results = {testNum: testSuiteLen, success: [], failure: []};
    
    //TODO: tests return results in an async manner, runner should be rewritten to meet this demand
    //  and call callback each time when function finished for good
//    for(var i in testSuite){
//      testSuite[i]();
//    }
    
    var currentTest = 0; 
    
    if(!this.endTest){
      this.endTest = function(){
        alert("test End");
        //TODO: send meaningful data. throw error to obtain stack?
        successCallback({"foo":"success"});
        if(currentTest++ < testSuiteLen) testSuite[currentTest]();
      }
    }
    
    window.onerror = function(errorMsg, url, lineNumber) {
      alert("ERR:" + errorMsg);
      failureCallback(this._processException(errorMsg, url, lineNumber));
      //TODO: find a way of knowing that test ended successfully
      if(currentTest++ < testSuiteLen) testSuite[currentTest]();
    };
    testSuite[currentTest]();
  },
  
  Ash._processException = function(errorMsg, url, lineNumber){
    //TODO: handle JSON parse failure
    var testFailure = JSON.parse(errorMsg.replace("Uncaught ", ""));
    testFailure.level = testFailure.level || "Exception";
    testFailure.code = testFailure.code || 1;
    testFailure.message = testFailure.message || "Runtime error";
    testFailure.url = url;
    testFailure.lineNumber = lineNumber;
    return testFailure;
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
  
  Ash.assert = function(element) {
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
  
  Ash.assertEqual = function(valA, valB) {
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