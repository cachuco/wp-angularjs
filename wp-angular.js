var wp = angular.module( "wp", [ "ngResource" ] );

wp.directive( "wp", function () {
	return {
		restrict: "E",
		replace: true,
		transclude: true,
		scope: {
			postType: '@postType',
			postId: '@postId'
		},
		controller: [ '$scope', '$http', function( $scope, $http ) {

		} ],
		template: "<div>{{ postType }}</div>"
	}
} )
