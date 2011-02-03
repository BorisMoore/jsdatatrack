$deferRun( function( $, folder ) {

$.template( folder + "edit", 
	'<tr {{if $item.data === $item.ctl.selectedData}}class ="selected"{{/if}}>\
		<td>{{link($data, { Name: "NameInput" })}}\
			<input name="NameInput" value="${Name}" />\
		{{/link}}</td>\
		<td>{{link($data, { ReleaseYear: "YearInput" })}}\
			<input name="YearInput" value="${ReleaseYear}" />\
		{{/link}}</td>\
		<td>${$ctl.getDirector($data)}\
		<span class="close">x</span></td>\
	</tr>' 
);

});


//		{{link firstName}}<input value="${firstName}" />{{/link}}\
//		{{link lastName}}<input value="${lastName}" />{{/link}}\


//{{link($data, { Name: "NameInput" })}}
//    <input name="NameInput" value="${Name}" />
//{{/link}}

//{{link($data, { "a.b.c": "[value]" })}}
//    <input value="${Name}" />
//{{/link}}
