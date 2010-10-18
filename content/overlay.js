var httpk3y = {
  
  init: function(){
    this.consoleObject = Components.classes["@mozilla.org/consoleservice;1"].getService(Components.interfaces.nsIConsoleService);
    this.debug = true;
    
    this.serverBoot();
    this.mainKeysetCache();
    
    this.log("ready!");
  },
  
  unload: function(){
    this.serverHalt();
  },
  
  serverBoot: function(){
    this.server = Components.classes["@mozilla.org/server/jshttp;1"].
                  createInstance(Components.interfaces.nsIHttpServer);
    var port = 8801;
    
    this.server.registerErrorHandler(404, this.serverErrorParser);
    this.server.start(port);
    
    this.log("server booted (@ http://localhost:" + port + ")");
  },
  
  serverHalt: function(){
    try{ this.server.stop(function(){}); }catch(e){}
    
    this.server = undefined;
    this.log("server halted");
    
    return true;
  },
  
  serverErrorParser: function(request, response){
    response.setStatusLine("1.1", 200, "OK");
    response.write("hello!");
  },
  
  mainKeysetCache: function(){
    var wm = Components.classes["@mozilla.org/appshell/window-mediator;1"].getService(Components.interfaces.nsIWindowMediator);
    var enumerator = wm.getEnumerator("navigator:browser");
    
    while(enumerator.hasMoreElements()) {
      var win = enumerator.getNext();
      
      var mainKeyset = win.document.getElementById("httpk3y_key_fake").parentNode;
      
      for(var node=0; node < mainKeyset.childNodes.length; node++){
        this.log(mainKeyset.childNodes[node].getAttribute("id"));
      }
      //this.log(mainKeyset);
    }
  },
  
  // Debugging is half of victory!
  log: function(msg){
    if (this.debug && msg){
      this.consoleObject.logStringMessage("httpK3y ---> " + msg);
    }
  }
  
};

window.addEventListener("load", function(e) { httpk3y.init(e); }, false);
window.addEventListener("unload", function(e) { httpk3y.unload(e); }, false);
