(function(win){

  if(!win.A) { win.A = {}; }

//  win.A._navigateMethodName = "navigate";
//
//  win.A.isOnPage = function(pageObject) {
//    if(pageObject[this._navigateMethodName] === "function") {
//      var onPage = pageObject[_navigateMethodName]();
//      if(!onPage){
//        throw {
//          level:  "Error",
//          code: 11,
//          message: "Not on page!",
//          toString: function(){return JSON.stringify(this);}
//        }
//      }
//    }else{
//      throw {
//        level:  "Error",
//        code: 12,
//        message: "Page element doesn't implement required method!",
//        toString: function(){return JSON.stringify(this);}
//      }
//    }
//  };
})(window);