$deferRun( function( $, folder ) {

$.template( folder + "readonly", 
	'<li class="page-number{{if $item.data === $item.ctl.selectedData}} pgCurrent{{/if}}">${$data}</li>' 
);

});