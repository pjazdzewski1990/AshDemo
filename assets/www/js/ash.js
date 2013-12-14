(function(win){
//  alert("ash");
  if(!win.A) { win.A = {}; }

  win.A._storedErrorCallback = window.onerror;
  
  //test callbacks
  // before/after - called on every test
  // XTest - called on suite start
  win.A.beforeTest = win.A.afterTest = win.A.before = win.A.after = null;
  
  win.A.uploadServer = "http://192.168.0.1:3000/results";
  
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
    var params = "result[json]=" + resultToUpload;
    var xmlhttp = new XMLHttpRequest();
    xmlhttp.open("POST", win.A.uploadServer, true);
    xmlhttp.send(params);
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
    
    if(win.A.beforeTest) win.A.beforeTest();
    
    if(!this._testSuccess){
      if(win.A.after) win.A.after();
      
      this._testSuccess = function(){
        //TODO: send meaningful data. throw error to obtain stack?
        successCallback({"index":currentTest, "length":testSuiteLen});
        if(++currentTest < testSuiteLen) {
          if(win.A.before) win.A.before();
          testsSuite[currentTest]();
        }else{
          if(win.A.afterTest) win.A.afterTest();
        }
      }
    }
    
    window.onerror = function(errorMsg, url, lineNumber) {
      if(win.A.after) win.A.after();
      alert("ERR:" + errorMsg);
      failureCallback(win.A._processException(errorMsg, url, lineNumber));
      if(currentTest++ < testSuiteLen) {
        if(win.A.before) win.A.before();
        testsSuite[currentTest]();
      }else{
        if(win.A.afterTest) win.A.afterTest();
      }
    };
    
    if(win.A.before) win.A.before();
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
  
  win.A.withFile = function(options, callback) {
    //TODO: create/access real files
    var files = [];
    var len = options.limit || 1;
    for(var i=0; i<len; i++){
      var file = {
        "name": "file" + i,
        "fullPath": "/path/to/file" + i,
        "type": options.type || 'audio/amr',
        "lastModifiedDate": new Date(),
        "size": 100 + i
      }
      files.push(file);
    }
    callback(files);
  };
  
  win.A.onMove = function(startPos, options, callback) {
    //TODO: emulate instead of only simulating
    var steps = options.steps || 1;
    
    var startLatitude = startPos.latitude || 0;
    var destinationLatitude = options.latitude || 0;
    var skipLatitude = (destinationLatitude - startLatitude)/steps;
    
    var startLongitude = startPos.longitude || 0;
    var destinationLongitude = options.longitude || 0;
    var skipLongitude = (destinationLongitude - startLongitude)/steps;

    for(var i=0; i<=steps; i++){
      var lat = startLatitude + i*skipLatitude;
      var long = startLongitude = i*skipLongitude;
      var position = {"coords" : {"latitude": lat, "longitude": long}};
      callback(position);
    }
    A.endTest();
  };
  
  //TODO: move this part to ash-navigation
  win.A.isOnPage = function(pageObject) {
    if(typeof(pageObject["validate"]) === "function") {
      var onPage = pageObject["validate"]();
      if(onPage === false){
        throw {
          level:  "Error",
          code: 11,
          message: "Not on page!",
          toString: function(){return JSON.stringify(this);}
        }
      }
    }else{
      throw {
        level:  "Error",
        code: 12,
        message: "Page element doesn't implement required method!",
        toString: function(){return JSON.stringify(this);}
      }
    }
  };
  
})(window);