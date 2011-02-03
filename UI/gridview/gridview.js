((window.$deferRun || function( run ){ run(); }) (

function( $, options ) {

function gridviewCtl( options, self ) {
	this.self = self;
	this.currentData = options.data || [];
	$.extend( this, options, { editMode: this.editMode } );
	this.setEditMode( options.editMode );
}

gridviewCtl.prototype = { 
	editMode: false,
	readonly: false, // Means editMode cannot be true.
	addBtn: null,
	editModeBtn: null,
	tmplItems: {},
	selectable: false,
	
	setEditMode: function( value ) {
		var em = this.editMode = !!value;
		this.rowTmpl = $.template( this.templates + (em ? "edit" : "readonly") );
		this.render();
	},
	setSortBy: function( value ) {
		this.sortBy = value;
		if ( this.onSortBy ) {
			this.onSortBy( value );
		} else {
			this.render();
		}
	},
	onRowRendered: function( tmplItem ) {
		var ctl = this;
		if ( tmplItem.ctl === ctl ) {
			ctl.tmplItems[ $.inArray( tmplItem.data, ctl.currentData  ) ] = tmplItem;
			if ( tmplItem.data === ctl.selectedData ) {
				$( tmplItem.nodes ).addClass( "selected");
			}
		}
		$( ".close", tmplItem.nodes ).click( function() {
			ctl.unselect();
			ctl.currentData.splice( $.inArray( tmplItem.data, ctl.currentData ), 1 );
			ctl.render();
			return false; 
		});
		if ( this.selectable ) {
			$( tmplItem.nodes ).click( function() {
				if ( tmplItem.data === tmplItem.ctl.selectedData ) {	
					ctl.unselect();
				} else {
					ctl.select( tmplItem);
				}
			});
		}
	},
	onItemRendered: function( tmplItem ) {
		var ctl = this;
		if ( tmplItem.tmpl === this.rowTmpl ) {
			this.onRowRendered( tmplItem );
			return;
		} else if ( this.onLayoutRendered ) {
			this.onLayoutRendered( tmplItem );
		}

		$( ".addBtn", tmplItem.nodes ).click( function () {
			var newItem = $.extend(true, {}, ctl.newItem );
	
			tmplItem.data.rowData.push( newItem );
			if ( ctl.selectable ) {
				ctl.selectedData = newItem;
			}
			ctl.render();
		});
		
		$( ".editModeBtn", tmplItem.nodes ).click( function () {
			ctl.setEditMode( !ctl.editMode );
		});
		
		$( ".sortable", tmplItem.nodes ).click( function () {
			var colName = $( this ).attr( "data-jqt-col" );
			ctl.setSortBy( colName + (ctl.sortBy === colName ? "%20desc" : "" ));
		});
	},
	render: function( options ) {
		if ( options ) {
			$.extend( this, options );
		}			
		if ( this.onBeforeRender ) {
			this.onBeforeRender();
		}
		this.self.empty(); 
		$.tmpl( this.templates + "layout" , { rowData: this.currentData }, { ctl: this } ).appendTo( this.self );
	},
	select: function( tmplItem ) {
		if ( !this.selectable ) {
			return;
		}
		var selectedData = this.selectedData;
		if ( tmplItem.data === selectedData ) {
			return;
		} else if ( selectedData ) {
			this.unselect( true );
		}
		$( tmplItem.nodes ).addClass( "selected");
		
		this.selectedData = tmplItem.data;
		if ( this.onSelect ) {
			this.onSelect( this.selectedData );
		}
	},
	unselect: function( isSelect ) {
		if ( this.selectedData ) {
			$( this.tmplItems[ $.inArray( this.selectedData, this.currentData ) ].nodes ).removeClass( "selected");
			this.selectedData = null;
			if ( !isSelect  && this.onSelect ) {
				this.onSelect( this.selectedData );
			}
		}
	}
	// Could be optimized not to re-render header, do incremental rendering for insert or delete row, etc. 
};

$.fn.gridview = function ( options ) {
	if ( !arguments.length ) {
		return this.data( "gridview" );
	}
	var templatesFolder = options.templates, 
		self = this,
		templatePaths = [ path( "readonly"), path( "layout") ]; // TODO make these end up as absolute paths relative to page (using req.absUrl?)
	
	if ( !options.readonly ) {
		templatePaths.push( path( "edit" )); 
	}

	var promises = [], i = templatePaths.length;
	while ( i-- ) {
		promises.push( $.defer( templatePaths[ i ], templatesFolder ));
	}
	$.when.apply( $, promises ).done( function() { 
		// TODO Return false to script loader until these are loaded, then return true, so only then does script loader consider execution has happened...
		var ctl = new gridviewCtl( options, self );
		// self.data( "gridview", ctl ); // Could do this by default?
		if ( ctl.onCreated ) {
			ctl.onCreated();
		}

	});
	
	function path( name ) { 
		return templatesFolder + "/" + name + "Tmpl.js"; 
	}
	return self;
}

}));