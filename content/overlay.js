var httpk3y = {
  
  init: function(){
    this.consoleObject = Components.classes["@mozilla.org/consoleservice;1"].getService(Components.interfaces.nsIConsoleService);
    this.debug = true;
    
    this.log("INIT!");
  },
  
  // Debugging is half of victory!
  log: function(msg){
    if (this.debug && msg){
      this.consoleObject.logStringMessage("httpK3y ---> " + msg);
    }
  },
  
};

window.addEventListener("load", function(e) { httpk3y.init(e); }, false);
