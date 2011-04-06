# An exploratory prototype of a 'Data Model' for jQuery

This prototype explores some aspects of a Data Model implementation that may be relevant to the requirements of jQueryUI Grid, in particular.

Another goal is to provide some of the features and scenario coverage provided by MicrosoftAjaxDataContext in the  Microsoft AJAX library.

_dataContext:_

* does identity management on the tracked items in the data context, 
* supports merge options so changes are not overwritten by new downloaded copies of objects
* TODO Change tracking for both object and collections, and synchronization with other dataContexts or with server data.

	
_dataView:_

* provides a view of a 'dataset', making request through dataContext for tracking of returned objects
* paging support with caching of previously returned pages
* sorting and filtering support

_oData:_

* 'pluggable' options for using the dataContext against an oData JSON service

_script loader:_

* See <a href="http://github.com/BorisMoore/jsdefer">http://github.com/BorisMoore/jsdefer</a>
* Async loading using manifest-based dependency management (deferdef.js)

_UI - Templated Controls:_

* application typically provides custom templates and css
* folder-based convention for finding templates
* async loading of templates, using the JsDefer script loader
* uses a modified/updated version of jquery.tmpl.js (Prototype version, under investigation), with support for ctl concept, 
as well as a feature allowing you to use a template tag for any plugin. Used in the editTmpl.js for declarative datalink: {{link}}. 
		
_Controls in this demo:_

* gridview	
* genrepicker ('User control', for movies app. 'Derived' from gridview, with additional opions, method overrides, etc.)
* pager ('Out of the box' pager control, 'derived' from gridview, with additional opions, method overrides, etc.)

_Demo Page:_ 

* movies\demos\pages\MoviesGridViewImperative.html

* Currently gridView editTmpl.js uses a declarative tag for datalink for the edit mode view, but readonlyTmpl.js does not. 
This is because of limitations in datalink. I hope to add better support for using datalink on element content, and some 
other scenarios too, and to provide declarative syntax for most of these scenarios. 
(TODO: Investigation and discussion around this.)
