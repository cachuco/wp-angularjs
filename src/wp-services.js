angular.module( "wp.services", [ "ngResource" ] )

/**
 * @category service
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
