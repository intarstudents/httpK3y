httpK3y
=======

Toggle keyboard shortcuts from outside of Firefox or Prism!

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
