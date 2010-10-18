var httpk3y = {
  
  init: function(){
    this.consoleObject = Components.classes["@mozilla.org/consoleservice;1"].getService(Components.interfaces.nsIConsoleService);
    this.debug = true;
    this.keyset = {};
    
    this.mainKeysetCache();
    this.serverBoot();
    
    this.log("ready!");
  },
  
  unload: function(){
    this.serverHalt();
  },
  
  serverBoot: function(){
    this.server = Components.classes["@mozilla.org/server/jshttp;1"].
                  createInstance(Components.interfaces.nsIHttpServer);
    var port = 8801;
    
    for(var keyset_id in this.keyset){
      this.server.registerPathHandler("/" + keyset_id, this.serverKeyHandler);
      //this.log(keyset_id);
    }
    
    this.server.registerPathHandler("/", this.serverIndex);
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
    response.setStatusLine("1.1", 500, "Error");
    response.write("Error!!");
  },
  
  serverKeyHandler: function(request, response){
    var method = /\/(.*?)$/i.exec(request.path);
    httpk3y.log("request " + request.path);
    httpk3y.log(method);
    if (method && httpk3y.keyset[method[1]]){
      httpk3y.keyset[method[1]].doCommand();
    }
  },
  
  serverIndex: function(request, response){
    var arr = [];
    for(var keyset_id in httpk3y.keyset){
      arr.push(keyset_id);
    }
  
    response.setStatusLine("1.1", 200, "OK");
    response.write(arr.join("\n"));
  },
  
  mainKeysetCache: function(){
    // Reset keyset
    this.keyset = {};
    
    var wm = Components.classes["@mozilla.org/appshell/window-mediator;1"].getService(Components.interfaces.nsIWindowMediator);
    var enumerator = wm.getEnumerator("navigator:browser");
    
    while(enumerator.hasMoreElements()) {
      var win = enumerator.getNext();
      
      var mainKeyset = win.document.getElementById("httpk3y_key_fake").parentNode;
      
      for(var node=0; node < mainKeyset.childNodes.length; node++){
        var keyset_id = mainKeyset.childNodes[node].getAttribute("id");
        this.keyset[keyset_id] = mainKeyset.childNodes[node];
      }
      
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
