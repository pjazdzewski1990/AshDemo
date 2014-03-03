
(function(win){
  var exampleTests = {};

  //setup test callbacks
  win.Ash.beforeClass = function(){ 
    console.log("Before Class - runs on test start");
  };
  win.Ash.afterClass = function(){ 
    console.log("After Class - runs after all tests completed");
    //instant feedback
    var testNum = 6;
    var rows = document.getElementById('tableBody').getElementsByTagName("tr").length;
    if(rows != exampleTests.expectedRunNum){
      alert("Some tests didn't run! Expected " + exampleTests.expectedRunNum);
    }
  };
  win.Ash.before = function(){ 
    console.log("Before - starts before each test");
  };
  win.Ash.after = function(){ 
    console.log("After - runs after each test completion"); 
  };

  //how many times the tests have been started
  exampleTests.expectedRunNum = 0;

  exampleTests.conf = {app: "Ash Demo", appVersion: "0.1", desc: "Demo app for ASH testing framework", key: "demo"};
  
  exampleTests.orientationTest = function(){
    console.log("orientationTest");
    Ash.orientationHorizontal(function(msg){
      var element = $('#deviceorientationField');
      Ash.assert(element);
      Ash.equal(element.text(), "landscape");
      console.log("CHECK Horizontal finished");
      
      Ash.orientationVertical(function(){
        console.log("CHECK Vertical start");
        var elementAfter = $('#deviceorientationField');
        Ash.assert(elementAfter);
        Ash.equal(elementAfter.text(), "portrait");
       
        Ash.endTest();
      });
    });
  };
  
  exampleTests.connectionTest = function(){
    console.log("connectionTest - TODO");
    Ash.endTest();
//    Ash.noNetwork(function(msg){
//      alert("network mode off");
//      app.setConnectionBox();
//      
//      Ash.equal($('#connectionField').text(), 'No network connection');
//      Ash.endTest();
//    });
  };
  
  exampleTests.captureAudioTest = function(){
    var options = { type: 'audio/amr', limit: 3, duration: 10 };
    Ash.withFile(options, function(fileArray){
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
      
      if(currentPosition.coords.latitude == moveOptions.latitude || currentPosition.coords.longitude == moveOptions.longitude)
        Ash.endTest();
    });
  };
  
  exampleTests.visibilityTest = function(){
    console.log("visiblity test");
    app.showElements();
    
//    A.visible($("#visibilityHiddenField")[0]);
    Ash.visible($("#displayNoneField"));
    Ash.visible($("#displayNoneField").toArray());
    Ash.visible($("#displayNoneField")[0]);
//    A.visible($("#outOfScreenField")[0]);
    app.hideElements();
    
//    A.invisible($("#visibilityHiddenField")[0]);
    Ash.invisible($("#displayNoneField"));
    Ash.invisible($("#displayNoneField").toArray());
    Ash.invisible($("#displayNoneField")[0]);
//    A.invisible($("#outOfScreenField")[0]);
    app.showElements();
    
//    A.visible($("#visibilityHiddenField"));
    Ash.visible($("#displayNoneField"));
    Ash.visible($("#displayNoneField").toArray());
    Ash.visible($("#displayNoneField")[0]);
//    A.visible($("#outOfScreenField"));
    
    Ash.endTest();
  };
    
  exampleTests.advertTest = function(){
    $(".app").click();
    Ash.onPage(exampleTests.advertSubpageObject);
    $(".app").click();
    Ash.endTest();
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

  exampleTests.demoTripScenario = [
      {
          name: "Orientation Step",
          where: exampleTests.orientationPageObject,
          what: [exampleTests.orientationTest],
          howLong: 5000
      },
      {
          name: "Connection Step",
          where: exampleTests.connectionPageObject,
          what: [exampleTests.connectionTest],
          howLong: 5000
      }
  ];

  exampleTests.runAll = function(){
    this.expectedRunNum += 6;
    
    Ash.config(exampleTests.conf).run(exampleTests, function(errorData){
      exampleTests.appendResult(errorData.level, errorData.message);
    }, function(successData){
      exampleTests.appendResult("Test Success", "Test " + successData.index + " out of " + successData.length);
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
  document.getElementById('connectionTest').addEventListener('click', function(e){
    e.stopPropagation();
    exampleTests.connectionTest();
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
  document.getElementById('allTests').addEventListener('click', function(e){
    e.stopPropagation();
    exampleTests.playAll();
  }, false);
  
  win.tests = exampleTests;
  exampleTests.runAll();
})(window);
