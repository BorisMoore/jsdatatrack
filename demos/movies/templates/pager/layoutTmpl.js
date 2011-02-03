$deferRun( function( $, folder ) {

var disabledFirst = '{{if $ctl.selectedData <= 1}} disabled="disabled"{{/if}}',
	disabledLast = '{{if $ctl.selectedData >= $ctl.pageCount}} disabled="disabled"{{/if}}';
 $.template( folder + "layout", 
	'<ul class="pages">\
		{{if $ctl.count}}<li class="pgFirst"' + disabledFirst + '>first</li><li class="pgPrev"' + disabledFirst + '>prev</li>\
		{{tmpl(rowData, { ctl:this.ctl }) $ctl.rowTmpl}}\
		<li class="pgNext"' + disabledLast + '>next</li><li class="pgLast"' + disabledLast + '>Last (${$ctl.pageCount})</li>{{/if}}\
	</ul>' 
);

});