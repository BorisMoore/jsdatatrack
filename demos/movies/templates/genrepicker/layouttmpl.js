$deferRun( function( $, folder ) {

$.template( folder + "layout", 
	'<ul><li class="noborder"><button class="gpFilter">Filter: </button> <input class="gpFilterText" value="${$ctl.filterText}"></input></li>\
	<li class="gpPrev"{{if $ctl.index<=1}} disabled="disabled"{{/if}}>Prev</li>\
	<li class="gpNext"{{if $ctl.index*$ctl.buttonCount>=$ctl.count}} disabled="disabled"{{/if}}>Next</li></ul>\
	<ul>{{tmpl(rowData, { ctl:this.ctl }) $ctl.rowTmpl}}</ul>' 
);

});