httpK3y
=======

Toggle keyboard shortcuts from outside of Firefox or Prism!

Usage
-----

### FYI

Replace `PORT` with port number that you have chosen for httpK3y or with default one – `7700`.

### Configuration

+ In Firefox or Prism main window go to Tools > Add-ons > (in list find httpK3y and press Preferences);
+ If server is running, press `Stop`;
+ Now in `Port` input box, select your desired port number;
+ Check `Start with ...` checkbox, if you want to start server, when you open Firefox or Prism;
+ Press `Start` to run server;

### Giving it a try

To list all available methods (keyboard shortcuts ids) go to "http://localhost:PORT/" (without quotes). In response you should be greeted with something like this:

#### List of available methods

* key_newNavigator
* key_newNavigatorTab
* focusURLBar
* focusURLBar2
* key_search
* key_search2
* key_openDownloads
* key_errorConsole
* openFileKb
* key_savePage
* printKb
* key_close
* key_closeWindow
....

From these you can now figure out what you want remotly to do. If it was to open `Downloads` window go to "http://localhost:PORT/key_openDownloads" (without quotes). Downloads windows should apper in front of your eyes.

Building bundle for Firefox
---------------------------

Show some git love (if you haven't already)

    $ cd ~
    $ git clone git://github.com/intarstudents/httpK3y.git

Navigate your way to httpk3y's git directory and start hardcore archiving action

    $ cd httpK3y/
    $ rm -rf httpK3y.xpi && zip -r httpK3y.xpi {httpd,skin,components,content,defaults,install.rdf,chrome.manifest}
    
And that's it. Now you can install httpK3y.xpi inside your Firefox.

Building bundle for Prism
-------------------------

Show some git love (if you haven't already)

    $ cd ~
    $ git clone git://github.com/intarstudents/httpK3y.git
    
Navigate your way to httpk3y's git directory and start hardcore archiving action

    $ cd httpK3y/
    $ rm -rf httpK3y-prism.xpi && zip -r httpK3y-prism.xpi {httpd,skin,components,content,defaults} && cd prism/ && zip -r ../httpK3y-prism.xpi {install.rdf,chrome.manifest} && cd ..

And that's it. Now you can install httpK3y-prism.xpi inside your Prism.
