(function(win){
//  alert("ash");
  if(!win.A) { win.A = {}; }

  win.A._storedErrorCallback = window.onerror;
  
  win.A.configuration = {},
  win.A.config = function(data){
    this.configuration.app = data.app || "";
    this.configuration.appVersion = data.appVersion || "";
    this.configuration.desc = data.desc || "";
    this.configuration.timestamp = new Date();
    this.configuration.key = data.key || "";
    
    return this;
  },
  
  win.A.upload = function(resultToUpload){
   //TODO:
  },
  
  win.A.endTest = function(){
    if(this._testSuccess){ // call only if part of test runner
      this._testSuccess();
    }
  }, 
  win.A._testSuccess = null,  //setup in win.A.run()
  
  win.A.run = function(tests, failureCallback, successCallback){
    var testsSuite = (Object.prototype.toString.call(tests) === "[object Array]") ? tests : this._extractTests(tests);
    var testSuiteLen = testsSuite.length;
    var currentTest = 0; 
    
    if(!this._testSuccess){
      this._testSuccess = function(){
        //TODO: send meaningful data. throw error to obtain stack?
        successCallback({"index":currentTest, "length":testSuiteLen});
        if(++currentTest < testSuiteLen) testsSuite[currentTest]();
      }
    }
    
    window.onerror = function(errorMsg, url, lineNumber) {
      alert("ERR:" + errorMsg);
      failureCallback(win.A._processException(errorMsg, url, lineNumber));
      if(currentTest++ < testSuiteLen) testsSuite[currentTest]();
    };
    testsSuite[currentTest]();
  },
  
  win.A._processException = function(errorMsg, url, lineNumber){
    //TODO: handle JSON parse failure
    var testFailure = JSON.parse(errorMsg.replace("Uncaught ", ""));
    testFailure.level = testFailure.level || "Exception";
    testFailure.code = testFailure.code || 1;
    testFailure.message = testFailure.message || "Runtime error";
    testFailure.url = url;
    testFailure.lineNumber = lineNumber;
    return testFailure;
  },
  
  win.A._extractTests = function(testObj){
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
  
  
  win.A.eventTimeout = 1000;  //most browsers won't react under 25 
  
  win.A.orientationHorizontal = function(testSuite) {
    return cordova.exec( 
      function(){
        //FIXME: walkaround for event synchronization problem
        setTimeout(function(){console.log("HorizontalTimeout Done");testSuite();}, win.A.eventTimeout);
      },
      function() { alert("Couldn't call orientationHorizontal"); }, 
      "pl.ug.ash.AshPlugin", 
      "orientationHorizontal", 
      []);
  };
  
  win.A.orientationVertical = function(testSuite) {
    return cordova.exec( 
      function(){
        //FIXME: walkaround for event synchronization problem
        setTimeout(function(){console.log("VerticalTimeout Done");testSuite();}, win.A.eventTimeout);
      },
      function() { alert("Couldn't call orientationVertical"); }, 
      "pl.ug.ash.AshPlugin", 
      "orientationVertical", 
      []);
  };
  
  win.A.noNetwork = function(testSuite) {
    return cordova.exec( 
      function(){
        testSuite();
      },
      function() { alert("Couldn't call noNetwork"); }, 
      "pl.ug.ash.AshPlugin", 
      "networkOff", 
      []);
  };
  
})(window);