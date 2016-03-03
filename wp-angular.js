var wp = angular.module( "wp", [ "ngResource" ] );

wp.directive( "havePosts", function () {
	return {
		restrict: "E",
		replace: true,
		transclude: true,
		scope: {
			postType: '@',
			postId: '@'
		},
		// controller: [ '$scope', function( $scope ) {

		// } ],
		link: function( scope, element, attrs, ctrl, transclude ) {
			scope.hello = 'Miya';
			transclude( scope, function( clone, scope ) {
				element.append( clone );
			});
		},
		template: "<div class=\"have-posts {{ postType }}\" ng-transclude></div>"
	}
} );

wp.factory( 'WP_Query', [ '$resource', '$config', function( $resource, $config ) {
	var api = $config.api + "/:endpoint/:id";
	var params = {
		endpoint: '@endpoint',
		id: '@id'
	};
	var actions = {};
	return $resource( api, params, actions );
} ] );
