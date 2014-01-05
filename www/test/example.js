
(function(win){
  var exampleTests = {};

  //setup test callbacks
  win.Ash.beforeClass = function(){ alert("Before Class"); };
  win.Ash.afterClass = function(){ alert("After Class"); };
  win.Ash.before = function(){ alert("Before"); };
  win.Ash.after = function(){ alert("After"); };
  
  exampleTests.orientationTest = function(){
    alert("orientation test");
    Ash.orientationHorizontal(function(msg){
      var element = $('#deviceorientationField');
      Ash.assert(element);
      Ash.equal(element.text(), "landscape");
      console.log("CHECK Horizontal finished");
      
      Ash.orientationVertical(function(){
        console.log("CHECK Vertica start");
        var elementAfter = $('#deviceorientationField');
        Ash.assert(elementAfter);
        Ash.equal(elementAfter.text(), "portrait");
       
        Ash.endTest();
      });
    });
  };
  
//  exampleTests.connectionTest = function(){
//    alert("connectionTest");
//    A.noNetwork(function(msg){
//      alert("network mode off");
//      app.setConnectionBox();
//      
//      A.assertEqual($('#connectionField').text(), 'No network connection');
//      A.endTest();
//    });
//  };
  
  exampleTests.captureAudioTest = function(){
    var options = { type: 'audio/amr', limit: 3, duration: 10 };
    Ash.withFile(options, function(fileArray){
      app.captureSuccess(fileArray);
      
      var element = $('#recordField');
      Ash.assert(element);
      Ash.equal(element.html(), "file0");
      
      Ash.endTest();
    })
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
    Ash.visible($("#displayNoneField")[0]);
//    A.visible($("#outOfScreenField")[0]);
    app.hideElements();
    
//    A.invisible($("#visibilityHiddenField")[0]);
    Ash.invisible($("#displayNoneField")[0]);
//    A.invisible($("#outOfScreenField")[0]);
    app.showElements();
    
//    A.visible($("#visibilityHiddenField"));
    Ash.visible($("#displayNoneField"));
//    A.visible($("#outOfScreenField"));
    
    Ash.endTest();
  };

  exampleTests.gotoAdvertPageObject = {
    //check if we are on correct sub-page
    validate: function(){
      console.log("Check if on advertisement page");
      var bg = $('.app').css('background-image');
      return bg.indexOf("img/ad.png") > -1;
    }
  };
  
  exampleTests.advertTest = function(){
    $(".app").click();
    Ash.isOnPage(exampleTests.gotoAdvertPageObject);
    $(".app").click();
    Ash.endTest();
  };
  
  exampleTests.runAll = function(){
    var conf = {app: "Ash Demo", appVersion: "0.1", desc: "Demo app for ASH testing framework", key: "demo"};
    Ash.config(conf).run([exampleTests.advertTest, exampleTests.visibilityTest, exampleTests.locationTest, exampleTests.captureAudioTest]/*exampleTests*/, function(errorData){
      exampleTests.appendResult(errorData.level, errorData.message);
    }, function(successData){
      exampleTests.appendResult("Success", "Test " + successData.index + " out of " + successData.length);
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
    exampleTests.runAll();
  }, false);
  
  win.tests = exampleTests;
  exampleTests.runAll();
})(window);
