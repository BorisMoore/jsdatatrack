((window.$deferRun || function( run ){ run(); }) (

function( $, options ) {

/**************************** dataContext constructor **************************** 
 *********************************************************************************/ 


$.dataContext = function( path, options ) { // Should be .DataContext, since this is a factory method.
	if ( !this.trackData ) {
		return new $.dataContext( path, options );
	}
	this.path = path;
	this._items = {};
	$.extend( this, options );
}

/**************************** dataView constructor **************************** 
 ******************************************************************************/ 

$.dataContext.view = function( dc, queryParams, options ) {  // Should be .View, since this is a factory method.
	if ( !this.refresh) {
		return new $.dataContext.view( dc, queryParams, options );
	}
	if ( $.isPlainObject( queryParams ) ) {
		options = queryParams;
		queryParams = options.queryParams;
	} 
	this.queryParams = $.isArray( queryParams ) ? queryParams : [queryParams];
	this.urlMapper = dc.urlMapper;
	this.path = dc.path;
	this.filter = dc.filter;
	$.extend( this, options, { dataContext: dc } ); // Cannot override dataContext in options
}

/**************************** dataView prototype **************************** 
 ****************************************************************************/ 

$.dataContext.view.prototype = {
	refresh: function( options ) {
		var view = this, dc = view.dataContext, newIndex = false;
		if ( options ) {
			if ( options.sortBy || options.filterBy || (options.queryParams && (options.queryParams.toString() != view.queryParams.toString())) ) {
				newIndex = true;
				view.index =  1;
				view.count =  0;
				view.cachingIndex = {}; // Different queryparams => new cachingIndex (sparse array). Only cache pages on current cachingIndex... 
			}
			$.extend( view, options );
		}
		var i, index = view.index, cachedData, dataItem, pageSize = view.pageSize;
		if ( view.count ) {
			cachedData = [];
			for ( i=0, l=pageSize; i<l; i++ ) {
				dataItem = view.cachingIndex[ index*pageSize + i ]
				if ( dataItem ) {
					cachedData.push( dataItem );
				} else if ( i + (index-1)*pageSize < view.count ) {
					cachedData = null;
					break;
				}
			}
		}
		if ( cachedData ) {
			dataRetrieved( cachedData ); // No need to request data. It is already in the current cachingIndex
		} else {
			dc.fetchData( view.queryString(), function( data ) {
				if ( view.filter ) {
					data = view.filter( data );
				}
				dataRetrieved( data );
			});
		}
		function dataRetrieved( data ) {
			view.data = dc.trackData( data );
			
			for ( i=0, l=data.length; i<l; i++ ) {
				view.cachingIndex[ index*pageSize + i ] = data[ i ];
			}
			if ( view.onRefresh ) {
				view.onRefresh( view.data, newIndex );
			}
		}		
	},
	clear: function() {
		var view = this;
		view.data = [];
		view.count = 0;
		view.cachingIndex = {};  
		if ( view.onRefresh ) {
			view.onRefresh([]);
		}
	},
	queryString: function() {
		return this.urlMapper( this.path, this.queryParams, this.index, this.pageSize, this.sortBy, this.filterBy );
	},
	count: 0,
	index: 1,
	pageSize: 10,
	sortBy: "",
	filterBy: "",
	cachingIndex: {},
	data: []
}

/**************************** dataContext prototype **************************** 
 *******************************************************************************/ 

$.dataContext.prototype = {
	view: function( query, options ) {
		return new $.dataContext.view( this, query, options );
	},
	fetchData: function( query, callback ) {
		$.ajax({
			dataType: "jsonp",
			url: query,
			jsonp: "$callback",
			success: callback
		});
	},
	getIdentity: function( entity ) {
		return entity.id;
	},
	urlMapper: function( path, query ) {
		return path + query;
	},

/* =============== NOTE: The following code has been ported from MSAJAX DataContext.js =============== 
   =============== Included as is for proof of concept purposes, but but needs to be rewritten ===========*/

	trackData: function( data ) {
		if ( this.getIdentity ) {
			var trackedData;
			if ( data instanceof Array ) {
				data = this._storeEntities( data );
			}
			else if ((typeof(data) !== "undefined") && (data !== null)) {
				trackedData = this._storeEntities([data]);
				if (trackedData.length === 0) {
					data = null;
				}
			}
			var oldData = this._lastResults;
			this._lastResults = data;
			if (oldData !== null) {
				//this._raiseChanged("lastFetchDataResults");
			}
		}
		else {
			this._clearData(data);
		}
		return data;
	},
	_storeEntities: function(entities) {
		var i, l, filtered, deleted;
		for (i = 0, l = entities.length; i < l; i++) {
			var entity = entities[i], isObject = (entity && (typeof(entity) === "object"));
			if (isObject) {
				var identity = this.getIdentity(entity);
				if (identity !== null) {
					if (this._storeEntity(identity, entity, entities, i, null)) {
					}
				}
			}
		}
		return filtered || entities;
	},
	_storeEntity: function(identity, entity, parent, parentField, source) {
		var updated = true, storedEntity = this._items[identity];
		if ((typeof (storedEntity) !== "undefined")) {
			if (storedEntity === entity) {
				updated = false;
			}
			else {
				this._combine(storedEntity, entity);
			}
		}
		else {
			this._items[identity] = storedEntity = entity;
		}
		if (parent && (parent[parentField] !== storedEntity)) {
			this._setField(parent, parentField, source, storedEntity);
		}
		return updated;
	},
	_combine: function(target, source) {
		var removedChanges = false;
		for (var name in source) {
			var field = source[name], type = typeof(field);
			if (type === "function") continue;
			if (this.getIdentity && (field instanceof Array)) {
				field = this._storeEntities(field, mergeOption);
				if (target) {
					this._setField(target, name, source, field, mergeOption, true);
				}
			}
			else {
				var identity = null;
				if (field && (type === "object"))  {
					identity = this.getIdentity(field);
				}
				if (identity) {
					if (!excludeEntities) {
						this._storeEntity(identity, field, target, name, source, mergeOption);
					}
				}
				else if (target) {
					var targetField = target[name];
					if (targetField && (typeof(targetField) === "object") && this.getIdentity(targetField)) {
						continue;
					}
				}
			}
		}
	},
	_setField: function(target, name, source, value) {
		var doSet = true, isArray = (target instanceof Array);
		if (!isArray) {
			var targetField = target[name], valueType = this._getValueType(target, name, targetField);
			if (valueType === 2 &&
					(!targetField || !value ||
					(typeof(targetField) !== "object") ||
					(targetField instanceof Array) ||
					(typeof(value) !== "object") ||
					(value instanceof Array) ||
					(this.getIdentity(targetField) !== this.getIdentity(value)))) {
				doSet = false;
			}
		}
		if (doSet) {
			if (isArray) {
				target[name] = value;
			}
			else {
				this._ignoreChange = true;
				try {
					target[ name ] = value;
				}
				finally {
					this._ignoreChange = false;
				}
			}
		}
		return doSet;
	},

	_useIdentity: false,
	_lastResults: null,
	_items: null,
	clearData: function(newData) {
		if (this._useIdentity) {
			for (var identity in this._items) {
				var entity = this._items[identity];
				this._releaseEntity(entity);
			}
		}
		else if (this._lastResults) {
			//this._release(this._lastResults);
		}
		this._items = {};
		var oldData = this._lastResults;
		this._lastResults = newData || null;
		//this.clearChanges();
		if (newData) {
//			this._capture(newData);
		}
		if (oldData !== null) {
//			this._raiseChanged("lastFetchDataResults");
		}
	},
	_getValueType: function(parent, name, object) {
		var type = typeof(object);
		if (type === "undefined") return 0;
		if ((object === null) || (type !== "object")) return 2;
	//	if (this.isDeferredProperty(parent, name)) return 1;
		return 2;
	}
}
// =============== End of code ported from MSAJAX DataContext.js =============== 

}));