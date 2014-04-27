
(function(win){
  var exampleTests = {};

  //setup test callbacks
  win.Ash.callbacks.beforeClass = function(){ 
    console.log("Before Class - runs on test start");
  };
  win.Ash.callbacks.afterClass = function(){ 
    console.log("After Class - runs after all tests completed");
    //instant feedback
    var testNum = 10;
    var rows = document.getElementById('tableBody').getElementsByTagName("tr").length;
    if(rows != exampleTests.expectedRunNum){
      alert("Some tests didn't run! Expected " + exampleTests.expectedRunNum + " got " + rows);
    }
  };
  win.Ash.callbacks.before = function(){ 
    console.log("Before - starts before each test");
  };
  win.Ash.callbacks.after = function(){ 
    console.log("After - runs after each test completion"); 
  };

  //how many times the tests have been started
  exampleTests.expectedRunNum = 0;

  exampleTests.conf = {app: "Ash Demo", appVersion: "0.1", desc: "Demo app for ASH testing framework", key: "demo"};
  
  exampleTests.orientationPageObject = {
    //check if we are on correct sub-page
    validate: function(){
      console.log("Check if on orientation page");
      var screen = document.getElementById('orientationScreen');
      return Ash.isVisible(screen);
    },
    goto: function(){
      console.log("Going to orientation page");
      if(!this.validate()) app.mySwipe.slide(0, 1);
      return true;
    }
  };
    
  exampleTests.connectionPageObject = {
    //check if we are on correct sub-page
    validate: function(){
      console.log("Check if on connection page");
      var screen = document.getElementById('connectionScreen');
      return Ash.isVisible(screen);
    },
    goto: function(){
      console.log("Going to connection page");
      if(!this.validate()) app.mySwipe.slide(1, 1);
      return true;
    }
  };
  
  exampleTests.advertSubpageObject = {
    //check if we are on correct sub-page
    validate: function(){
      console.log("Check if advertisement subpage is present");
      var bg = $('.app').css('background-image');
      return bg.indexOf("img/ad.png") > -1;
    },
    goto: function(){
      console.log("Going to advertisement subpage");
      //true because the advert is always visible
      return true;
    }
  };
    
  exampleTests.orientationTest = function(){
    console.log("OrientationTest - start");
    Ash.orientationHorizontal().then(function(msg){
      var element = $('#deviceorientationField');
      Ash.assert(element);
      Ash.equal(element.text(), "landscape");
      console.log("CHECK Horizontal finished");
    }).then(
      Ash.orientationVertical
    ).then(function(msg){
      console.log("CHECK Vertical start");
      var elementAfter = $('#deviceorientationField');
      Ash.assert(elementAfter);
      Ash.equal(elementAfter.text(), "portrait");
        
      Ash.endTest();
    });
  };
  
  exampleTests.disableNetworkTest = function(){    
    console.log("disableNetworkTest called");
    Ash.noNetwork().then(function(msg){
      console.log("disableNetworkTest running test");
      app.setConnectionBox();
      
      Ash.equal($('#connectionField').text(), 'No network connection');
      Ash.endTest();
    });
  };

  exampleTests.slowNetworkTest = function(){
    console.log("slowNetworkTest called");
    Ash.slowNetwork().then(function(msg){
      console.log("slowNetworkTest running test");
      app.setConnectionBox();

      Ash.equal($('#connectionField').text(), 'WiFi connection');
      Ash.endTest();
    });
  };
    
  exampleTests.enableNetworkTest = function(){
    console.log("enableNetworkTest called");
    Ash.networkOn().then(function(msg){
      console.log("enableNetworkTest running test");
      app.setConnectionBox();
    
      Ash.equal($('#connectionField').text(), 'WiFi connection');
      Ash.endTest();
    });
  };

  //In Ash you can freely combine conditions to create more specific scenarios
  exampleTests.combinationTest = function(){
    console.log("combinationTest called");
    Ash.noNetwork().then(
      Ash.orientationHorizontal
    ).then(function(){
      // now we are sure that both network is not available and screen is in horizontal position
      //TODO: find a example
      var d = new Date();
      console.log("COMBINED! " + d.getSeconds() + "/" + d.getMilliseconds());
    }).then(
      Ash.orientationVertical
    ).then(function(arg){
      Ash.endTest();
    });
  };
    
  exampleTests.captureAudioTest = function(){
    var options = { type: 'audio/amr', limit: 3, duration: 10 };
    Ash.withFile(options).then(function(fileArray){
      app.captureSuccess(fileArray);
      
      var element = $('#recordField');
      Ash.assert(element);
      Ash.equal(element.html(), "file0");
      
      Ash.endTest();
    });
  };
  
  exampleTests.locationTest = function(){
    var startPos = {latitude: 0, longitude: 0};
    var moveOptions = {latitude: 100, longitude: 50, steps: 10};
    Ash.onMove(startPos, moveOptions, function(currentPosition){
      app.positionChanged(currentPosition);
      
      var elementString = $('#locationField').html();
      var targetString = currentPosition.coords.latitude + ' ' + currentPosition.coords.longitude;
      Ash.equal(elementString, targetString);
      
      if(currentPosition.coords.latitude == moveOptions.latitude || currentPosition.coords.longitude == moveOptions.longitude){
        Ash.endTest();
      }
    });
  };
  
  exampleTests.visibilityTest = function(){
    console.log("Visiblity test");
    app.showElements();
    
    Ash.visible($("#visibilityHiddenField"));
    Ash.visible($("#displayNoneField")); //do funkcji możemy przekazać albo obiekt jQuery
    Ash.visible($("#hiddenPropertyField").toArray()); // albo tablicę obiektów
    Ash.visible($("#sizeZeroField")[0]); // albo pojedynczy obiekt
//    A.visible($("#outOfScreenField")[0]);
    
    app.hideElements();
    
    Ash.invisible($("#visibilityHiddenField"));
    Ash.invisible($("#displayNoneField")); //do funkcji możemy przekazać albo obiekt jQuery
    Ash.invisible($("#hiddenPropertyField").toArray()); // albo tablicę obiektów
    //TODO: button nie może być kompletnie niewidoczny przez zmniejszenie rozmiaru do 0x0
//    Ash.invisible($("#sizeZeroField")[0]); // albo pojedynczy obiekt
//    A.invisible($("#outOfScreenField")[0]);
    
    app.showElements();

    Ash.visible($("#visibilityHiddenField"));
    Ash.visible($("#displayNoneField")); //do funkcji możemy przekazać albo obiekt jQuery
    Ash.visible($("#hiddenPropertyField").toArray()); // albo tablicę obiektów
    Ash.visible($("#sizeZeroField")[0]); // albo pojedynczy obiekt
//    A.visible($("#outOfScreenField"));
    
    Ash.endTest();
  };
    
  exampleTests.advertTest = function(){
    $(".app").click();
    Ash.onPage(exampleTests.advertSubpageObject);
    $(".app").click();
    Ash.endTest();
  };
    
  exampleTests.pressBackTest = function(){
    var pageOne = 1;
    var pageTwo = 2;
    app.mySwipe.slide(pageOne, 1); // slide to first screen
    app.mySwipe.slide(pageTwo, 1); // slide to second
    app.mySwipe.slide(pageTwo + 1, 1); // slide even more so we could go back
    
    Ash.pressBack().then(function(msg){
      Ash.equal("#" + pageTwo, window.location.hash);
    }).then(
      Ash.pressBack
    ).then(function(){
      Ash.equal("#" + pageOne, window.location.hash);
      Ash.endTest();
    });
  };


  exampleTests.demoTripScenario = [
    {
       name: "Orientation Step",
       where: exampleTests.orientationPageObject,
       what: [exampleTests.orientationTest],
       howLong: 150000
    },
    {
       name: "Disable Connection Step",
       where: exampleTests.connectionPageObject,
       what: [exampleTests.disableNetworkTest],
       howLong: 150000
    },
    {
       name: "Eanble Connection Step",
       where: exampleTests.connectionPageObject,
       what: [exampleTests.enableNetworkTest],
       howLong: 150000
    }
  ];
    
  exampleTests.runAll = function(){
    this.expectedRunNum += 10;
    
    Ash.config(exampleTests.conf).run(exampleTests, function(errorData){
      exampleTests.appendResult(errorData.level, errorData.message);
    }, function(successData){
      exampleTests.appendResult("Run Test Success", "Test " + successData.index + " out of " + successData.length);
    });
  };
    
  exampleTests.playAll = function(){
    this.expectedRunNum += this.demoTripScenario.length;
    
    Ash.config(exampleTests.conf).play(exampleTests.demoTripScenario, function(errorData){
      exampleTests.appendResult(errorData.level, errorData.message);
    }, function(successData){
      exampleTests.appendResult("Scenario Step Success", "Scenario demo trip step " + successData.index + " out of " + successData.length + "  after " + (successData.stopTime - successData.startTime));
    });
  };
  
  exampleTests.appendResult = function(name, result){
    var tableRow = "<tr><td>" + name + "</td><td>" + result + "</td></tr>";
    $('#tableBody').append(tableRow);
  };

  //TODO: move it out of here
  document.getElementById('orientationTest').addEventListener('click', function(e){
    e.stopPropagation(); 
    exampleTests.orientationTest();
  }, false);
  document.getElementById('disableNetworkTest').addEventListener('click', function(e){
    e.stopPropagation();
    exampleTests.disableNetworkTest();
  }, false);
  document.getElementById('slowNetworkTest').addEventListener('click', function(e){
    e.stopPropagation();
    exampleTests.slowNetworkTest();
  }, false);
  document.getElementById('enableNetworkTest').addEventListener('click', function(e){
    e.stopPropagation();
    exampleTests.enableNetworkTest();
  }, false);
  document.getElementById('recordTest').addEventListener('click', function(e){
    e.stopPropagation();
    exampleTests.captureAudioTest();
  }, false); 
  document.getElementById('locationTest').addEventListener('click', function(e){
    e.stopPropagation();
    exampleTests.captureLocationTest();
  }, false);
  document.getElementById('visibilityTest').addEventListener('click', function(e){
    e.stopPropagation();
    exampleTests.visibilityTest();
  }, false);
  document.getElementById('backButtonTest').addEventListener('click', function(e){
    e.stopPropagation();
    exampleTests.pressBackTest();
  }, false);

  document.getElementById('playTests').addEventListener('click', function(e){
    e.stopPropagation();
    exampleTests.playAll();
  }, false);
  document.getElementById('runTests').addEventListener('click', function(e){
    e.stopPropagation();
    exampleTests.runAll();
  }, false);
  
  //make all errors visible (for testing purposes)
  window.onerror = function(errorMsg, url, lineNumber) {
    alert("Error " + url + ":" + lineNumber + "\n" + errorMsg);
  };
    
  win.tests = exampleTests;
  exampleTests.runAll();
})(window);
