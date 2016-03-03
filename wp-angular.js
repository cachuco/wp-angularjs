var wp = angular.module( "wp", [ "ngResource" ] );

wp.factory( 'WP_Query', [ '$resource', function( $resource ) {
	var api = "/:endpoint/:id";
	var params = {
		endpoint: '@endpoint',
		id: '@id'
	};
	var actions = {};
	return $resource( api, params, actions );
} ] );

wp.directive( "havePosts", [ 'WP_Query', function ( WP_Query ) {
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

			// transclude(scope, function(clone, scope) {
			// 	if ( clone.html() ) {
			// 		element.html( clone.html() );
			// 	}
			// });
		},
		template: "<div class=\"have-posts {{ postType }}\" ng-transclude></div>"
	}
} ] );
