'use strict';

angular.module( "wp.services", [ "ngResource" ] )

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
