var wp = angular.module( "wp", [ "ngResource" ] );

wp.factory( 'WP_Query', [ '$resource', function( $resource ){
	return function( apiRoot ) {
		var api = apiRoot + "/:endpoint/:id";
		var params = {
			endpoint: '@endpoint',
			id: '@id'
		};
		var actions = {};
		return $resource( api, params, actions );
	}
} ] );

wp.directive( "havePosts", [ 'WP_Query', function( WP_Query ) {
	return {
		restrict: "E",
		replace: true,
		multiElement: true,
		transclude: true,
		scope: false,
		controller: [ '$scope', function( $scope ) {
			//$rootScope.apiRoot = $scope.apiRoot;
		} ],
		link: function( scope, element, attrs, ctrl, transclude ) {
			scope.postType = attrs.postType;
			scope.postId = attrs.postId;
			scope.apiRoot = attrs.apiRoot;

			if ( scope.postId ) {
				scope.query = {
					'endpoint': scope.postType,
					'id': scope.postId
				}
			} else {
				scope.query = {
					'endpoint': scope.postType,
					'per_page': 10,
					'offset': 0,
					'filter[orderby]': 'date',
					'filter[order]': 'DESC',
					'_embed': true
				}
			}

			WP_Query( scope.apiRoot ).query( scope.query ).$promise.then( function( posts ) {
				// console.log( posts );
			} );
		},
		template: "<div class=\"have-posts {{ postType }}\" ng-transclude></div>"
	}
} ] );
