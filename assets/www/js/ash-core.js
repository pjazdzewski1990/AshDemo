(function(win){
  if(!win.A) { win.A = {}; }

  win.A.assert = function(element) {
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
  
  win.A.assertEqual = function(valA, valB) {
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
  
  //check ash tag and append test suite if turned on
})(window);