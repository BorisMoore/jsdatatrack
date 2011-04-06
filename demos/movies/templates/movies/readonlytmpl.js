$deferRun( function( $, folder ) {

$.template( folder + "readonly", 
	'<tr {{if $item.data === $item.ctl.selectedData}}class ="selected"{{/if}}>\
		<td><strong>${Name}</strong></td>\
		<td>${ReleaseYear}</td>\
		<td>${$ctl.getDirector($data)}</td>\
	</tr>' 
);

});