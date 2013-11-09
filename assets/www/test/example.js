
(function(win){
  //alert("Example tests");
  var exampleTests = {};
  
  exampleTests.orientationTest = function(){
    A.orientationHorizontal(function(msg){
      var element = $('#deviceorientationField');
      A.assert(element);
      A.assertEqual(element.text(), "landscape");
      console.log("CHECK Horizontal finished");
      
      A.orientationVertical(function(){
        console.log("CHECK Vertica start");
        var elementAfter = $('#deviceorientationField');
        A.assert(elementAfter);
        A.assertEqual(elementAfter.text(), "portrait");
       
        A.endTest();
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
    A.withFile(options, function(fileArray){
      app.captureSuccess(fileArray);
      
      var element = $('#recordField');
      A.assert(element);
      A.assert(element.html() != "Empty");
    })
  };
  
  exampleTests.runAll = function(){
    var conf = {app: "Ash Demo", appVersion: "0.1", desc: "Demo app for ASH testing framework", key: "demo"};
    A.config(conf).run(exampleTests, function(errorData){
      exampleTests.appendResult(errorData.level, errorData.message);
    }, function(successData){
      exampleTests.appendResult("Success", JSON.stringify(successData));
    })
  };
  
  exampleTests.appendResult = function(name, result){
    var tableRow = "<tr><td>" + name + "</td><td>" + result + "</td></tr>";
    $('#tableBody').append(tableRow);
  };
  
  document.getElementById('orientationTest').addEventListener('click', exampleTests.orientationTest, false);
  document.getElementById('connectionTest').addEventListener('click', exampleTests.connectionTest, false);
  document.getElementById('recordTest').addEventListener('click', exampleTests.captureAudioTest, false);
  document.getElementById('allTests').addEventListener('click', exampleTests.runAll, false);
  
  win.tests = exampleTests;
  exampleTests.runAll();
})(window);