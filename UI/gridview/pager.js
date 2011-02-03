// Some code taken from the blog post http://www.j-dee.com/2008/12/22/jquery-pager-plugin/

((window.$deferRun || function( run ){ run(); }) (

function( $, options ) {

$.fn.pager = function ( options ) {
	var baseSelect = options.onSelect, baseLayoutRendered = options.onLayoutRendered;
	$.extend( options, {
		selectable: true,
		readonly: true,
		templates:"../templates/pager", // Fix this to use relative paths converting to absolute, from appropriate base path 
		onBeforeRender: function( options ) {
			var buttonCount = this.buttonCount || 4, pageCount = this.pageCount = Math.ceil( this.count/this.pageSize || 0 ),
				startIndex = 1,
				endIndex = 1 + buttonCount*2,
				selectedData = this.selectedData || 1;

			if (selectedData > buttonCount) {
				startIndex = selectedData - buttonCount;
				endIndex = selectedData + buttonCount;
			}
			if (endIndex > pageCount) {
				startIndex = pageCount - buttonCount*2;
				endIndex = pageCount;
			}
			if (startIndex < 1) {
				startIndex = 1;
			}
			var pagerData = [];
			for (var page = startIndex; page <= endIndex; page++) {
				pagerData.push( page );
			}
			this.currentData = pagerData;
		},
		onSelect: function( selectedIndex ) {
			this.selectedData = selectedIndex;
			this.render();
			if ( baseSelect ) {
				baseSelect( selectedIndex );
			}
		},
		onLayoutRendered: function( tmplItem ) {
			var ctl = this;
			$( ".pgFirst", tmplItem.nodes ).click( function() {
				ctl.onSelect( 1 );
			});
			$( ".pgPrev", tmplItem.nodes ).click( function() {
				ctl.onSelect( ctl.selectedData - 1 );
			});
			$( ".pgNext", tmplItem.nodes ).click( function() {
				ctl.onSelect( ctl.selectedData + 1 );
			});
			$( ".pgLast", tmplItem.nodes ).click( function() {
				ctl.onSelect( ctl.pageCount );
			});
			if ( baseLayoutRendered ) {
				baseLayoutRendered( tmplItem );
			}
		}
	});
	return this.gridview( options );
}

}));