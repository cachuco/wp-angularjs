/**
 * @module wp.services
 */
angular.module( "wp.services", [ "ngResource" ] )

/**
 * @name wpQuery
 *
 * @description
 * Gets the WordPress objects from wp-api.
 */
.factory( "wpQuery", [ "$resource", function( $resource ){
	return function( apiRoot ) {
		var api = apiRoot + "/:endpoint/:id";
		var params = {
			endpoint: '@endpoint',
			id: '@id'
		};
		var actions = {};
		return $resource( api, params, actions );
	}
} ] )

;
