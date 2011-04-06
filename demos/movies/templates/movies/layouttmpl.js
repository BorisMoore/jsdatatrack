$deferRun( function( $, folder ) {

$.template( folder + "layout", 
	'<tbody><tr class="topBoilerPlate">\
		<td colspan="3"><button class="editModeBtn">{{if $ctl.editMode}}Read Only{{else}}Edit{{/if}}</button>\
		<button class="addBtn" {{if !$ctl.editMode}}disabled="disabled"{{/if}}>Add a movie</button></td>\
	</tr><tr>\
		<th class="sortable" data-jqt-col="Name">Title<span class="ui-icon arrow-{{if $ctl.sortBy==="Name"}}s{{else $ctl.sortBy==="Name%20desc"}}n{{else}}x{{/if}}"></span></th>\
		<th class="sortable" data-jqt-col="ReleaseYear">Year<span class="ui-icon arrow-{{if $ctl.sortBy==="ReleaseYear"}}s{{else $ctl.sortBy==="ReleaseYear%20desc"}}n{{else}}x{{/if}}"></span></th>\
		<th>Director</th>\
	</tr>\
	{{tmpl(rowData, { ctl:this.ctl }) $ctl.rowTmpl}}\
	</tbody>' 
);
});