((window.$deferRun || function( run ){ run(); }) (

function( $, options ) {

$.fn.genrePicker = function ( options ) {
	var baseSelect = options.onSelect, baseLayoutRendered = options.onLayoutRendered;
	$.extend( options, {
		selectable: true,
		readonly: true,
		templates:"../templates/genrePicker", // Fix this to use relative paths converting to absolute, from appropriate base path 
		onSelect: function( selectedIndex ) {
			this.selectedData = selectedIndex;
			this.render();
			if ( baseSelect ) {
				baseSelect( selectedIndex );
			}
		},
		onLayoutRendered: function( tmplItem ) {
			var ctl = this;
			$( ".gpFilter", tmplItem.nodes ).change( function() {
				ctl.setFilter && ctl.setFilter( this.value );
			});
			$( ".gpFilter", tmplItem.nodes ).click( function() {
				ctl.filterText = $( ".gpFilterText" ).val();
				ctl.setFilter && ctl.setFilter( ctl.filterText );
			});
			$( ".gpPrev", tmplItem.nodes ).click( function() {
				ctl.setPrev && ctl.setPrev();
			});
			$( ".gpNext", tmplItem.nodes ).click( function() {
				ctl.setNext && ctl.setNext();
			});
			if ( baseLayoutRendered ) {
				baseLayoutRendered( tmplItem );
			}
		}
	});
	return this.gridview( options );
}

}));