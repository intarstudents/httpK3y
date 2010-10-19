httpK3y
=======

Access keyboard shortcuts from outside (of Firefox and Prism)!

Building bundle for Firefox
---------------------------

Show some git love (if you haven't already)

    $ cd ~
    $ git clone git://github.com/intarstudents/httpK3y.git

Navigate your way to httpk3y's git directory and start hardcore archiving action

    $ cd httpK3y/
    $ rm -rf httpK3y.xpi && zip -r httpK3y.xpi {httpd,skin,components,content,defaults,install.rdf,chrome.manifest}
    
And that's it. Now you can install httpK3y.xpi inside your Firefox.
