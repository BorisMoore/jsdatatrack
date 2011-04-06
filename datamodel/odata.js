// http://www.odata.org/developers/protocols/uri-conventions

((window.$deferRun || function( run ){ run(); }) (

function( $, options ) {

	$.dataContext.oDataSettings = {
		getIdentity: function( entity ) {
			return entity.__metadata && entity.__metadata.uri;
		},
		filter: function( data ) {
			this.count = data.d.__count;
			return data.d.results;
		},
		urlMapper: function( path, params, index, pageSize, sortBy, filterBy ) {
			index = index || 1;
			var questionMark = (path.indexOf("?") < 0 ? "?" : "&");
			for ( param in params ) {
				path = path.split( "$" + param ).join( params[param] );
			}
			path += questionMark + "$format=json" +
				"&$inlinecount=allpages" +				// get total number of records
				"&$skip=" + (index-1) * pageSize +		// skip to first record of page
				"&$top=" + pageSize;					// page size
		
			if ( sortBy ) {
				path += "&$orderby=" + sortBy; 
				// sortBy can be [LastName,FirstName].toString() for multiple. Can add "%20desc" to any sort token. 
			}
			if ( filterBy ) {
				path += "&$filter=" + filterBy;  
			}
			return path;
		}
	}
}));