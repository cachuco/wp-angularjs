/**
 * @module wp.services
 */
angular.module( "wp.services", [ "ngResource" ] )

.service( "WP", [ "$resource", function( $resource ) {
	/**
	 * @name WP.Query
	 *
	 * @description
	 * Gets the WordPress objects from wp-api.
	 */
	this.Query = function( apiRoot ) {
		var api = apiRoot + "/:endpoint/:id";
		var params = {
			endpoint: '@endpoint',
			id: '@id'
		};
		var actions = {};
		return $resource( api, params, actions );
	}

	this.parseFilters = function( filters ) {

		var filter_strings = {};
		for ( var key in filters ) {
			filter_strings[ 'filter[' + key + ']' ] = filters[key];
		}

		return filter_strings;
	}
} ] )

;
