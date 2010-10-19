var httpk3y = {
  
  init: function(){
    this.consoleObject = Components.classes["@mozilla.org/consoleservice;1"].getService(Components.interfaces.nsIConsoleService);
    this.debug = true;
    this.default_port = 7700;
    this.environment = typeof(WebRunner) != "undefined" ? "prism" : "firefox";
    this.keyset = {};
    
    this.mainKeysetCache();
    
    if (this.serverGetStartup())
      this.serverBoot();
    
    this.log("ready!");
  },
  
  unload: function(){
    this.serverHalt();
  },
  
  serverBoot: function(){
    try{
    
      this.server = Components.classes["@mozilla.org/server/jshttp;1"].
                    createInstance(Components.interfaces.nsIHttpServer);
      var port = this.serverGetPort();
      
      for(var keyset_id in this.keyset){
        this.server.registerPathHandler("/" + keyset_id, this.serverKeyHandler);
        //this.log(keyset_id);
      }
      
      this.server.registerPathHandler("/", this.serverIndex);
      this.server.registerErrorHandler(404, this.serverErrorParser);
      this.server.start(port);
      
      this.log("server booted (@ http://localhost:" + port + ")");
      return true;
      
    }catch(e){
    
      this.log("server boot failed (@ " + e + ")");
      return false;
      
    }
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
    response.setHeader("Cache-Control", "no-cache", false);
    var method = /\/(.*?)$/i.exec(request.path);
    
    if (method && httpk3y.keyset[method[1]]){
      try{
        httpk3y.keyset[method[1]].doCommand();
      }catch(e){
        try {
          httpk3y.mainKeysetCache();
          httpk3y.keyset[method[1]].doCommand();
        }catch(e){
          httpk3y.log(e);
          
          response.setStatusLine("1.1", 500, "Error");
          response.write("Failed to toggle keyboard shortcut '" + method[1] + "'\nException: " + e);
          
          return;
        }
      }
    }
    
    response.setStatusLine("1.1", 200, "OK");
    response.write("Toggled '" + method[1] + "'");
  },
  
  serverIndex: function(request, response){
    var arr = [];
    for(var keyset_id in httpk3y.keyset){
      arr.push("<li>" + keyset_id + "</li>");
    }
  
    response.setStatusLine("1.1", 200, "OK");
    response.write("<h2>List of available methods</h2>");
    response.write("<ul>" + arr.join("\n") + "</ul>");
  },
  
  mainKeysetCache: function(){
    // Reset keyset
    this.keyset = {};
    
    var wm = Components.classes["@mozilla.org/appshell/window-mediator;1"].getService(Components.interfaces.nsIWindowMediator);
    var enumerator = wm.getEnumerator("navigator:browser");
    
    if (enumerator.hasMoreElements()){
    
      var win = enumerator.getNext();
      var mainKeyset = win.document.getElementById("httpk3y_key_fake").parentNode;

      for(var node=0; node < mainKeyset.childNodes.length; node++){
        var keyset_id = mainKeyset.childNodes[node].getAttribute("id");
        if (keyset_id)
          this.keyset[keyset_id] = mainKeyset.childNodes[node];
      }

    }
  },
  
  optionsUI: function(){
    this.optionsDoc.getElementById("httpk3y-serverToggle").setAttribute("label", (this.server == undefined ? "Start" : "Stop"));
    this.optionsDoc.getElementById("httpk3y-serverStartupToggle").setAttribute("label", "Start with " + (this.environment == "prism" ? "Prism" : "Firefox"))
    this.optionsDoc.getElementById("httpk3y-serverStartupToggle").setAttribute("checked", this.serverGetStartup());
    
    
    var serverPortCheckbox = this.optionsDoc.getElementById("httpk3y-serverPortToggle");
    serverPortCheckbox.value = this.serverGetPort();
    
    if (this.server != undefined)
      serverPortCheckbox.setAttribute("disabled", true);
    
    this.log("options UI updated");
  },
  
  serverGetStartup: function(){
    var pref = Components.classes["@mozilla.org/preferences-service;1"]
               .getService(Components.interfaces.nsIPrefBranch);
    return pref.getBoolPref("extensions.httpk3y.server_autostart");
  },
  
  serverSetStartup: function(s){
    var pref = Components.classes["@mozilla.org/preferences-service;1"]
               .getService(Components.interfaces.nsIPrefBranch);
    pref.setBoolPref("extensions.httpk3y.server_autostart", (s ? true : false));
  },
  
  serverStartupToggle: function(){
    var serverStartupCheckbox = this.optionsDoc.getElementById("httpk3y-serverStartupToggle");
    this.serverSetStartup(serverStartupCheckbox.getAttribute("checked"));
  },
  
  serverGetPort: function(){
    var pref = Components.classes["@mozilla.org/preferences-service;1"]
               .getService(Components.interfaces.nsIPrefBranch);
    var port = pref.getIntPref("extensions.httpk3y.server_port");
    
    if (port >= 1024 && port <= 65535){
      return port;
    }else{
      return this.default_port;
    }
  },
  
  serverSetPort: function(s){
    var pref = Components.classes["@mozilla.org/preferences-service;1"]
               .getService(Components.interfaces.nsIPrefBranch);
    var port = parseInt(s);
    
    pref.setIntPref("extensions.httpk3y.server_port", (port >= 1024 && port <= 65535 ? port : this.default_port));
  },
  
  serverPortToggle: function(){
    this.serverSetPort(this.optionsDoc.getElementById("httpk3y-serverPortToggle").value);
  },
  
  serverToggle: function(){
    var toggleButton = this.optionsDoc.getElementById("httpk3y-serverToggle");
    var toggleServerPort = this.optionsDoc.getElementById("httpk3y-serverPortToggle");
    
    toggleButton.setAttribute("disabled", true);
    
    if (toggleButton.getAttribute("label") == "Start"){
      if (this.serverBoot()){
        toggleButton.setAttribute("label", "Stop");
        
        toggleButton.setAttribute("disabled", false);
        toggleServerPort.setAttribute("disabled", true);
      }else{
        toggleButton.setAttribute("label", "Couldn't start server!");
        
        setTimeout(function(){
          var toggleButton = keysharky.optionsDoc.getElementById("httpk3y-serverToggle");
          toggleButton.setAttribute("label", "Start");
          
          toggleButton.setAttribute("disabled", false);
          toggleServerPort.removeAttribute("disabled");
        }, 3000);
      }
      
    }else{
      if (!this.serverHalt())
        this.server = undefined;
        
      toggleButton.setAttribute("label", "Start");
      
      toggleButton.setAttribute("disabled", false);
      toggleServerPort.removeAttribute("disabled");
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
