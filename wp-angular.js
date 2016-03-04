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
		transclude: true,
		scope: {
			postType: '@',
			postId: '@',
			apiRoot: '@',
		},
		controller: [ '$scope', function( $scope ) {
			//$rootScope.apiRoot = $scope.apiRoot;
		} ],
		compile: function( tElement, tAttrs, transclude ) {
			return {
				pre: function preLink( scope, iElement, iAttrs, controller ) {
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
						scope.posts = posts;
					} );
				},
				post: function postLink( scope, iElement, iAttrs, controller ) {
				}
			}
		},
		template: "<div class=\"have-posts\"><article class=\"{{ postType }} post-{{ post.id }}\" ng-repeat=\"post in posts\"><div ng-transclude></div></article></div>"
	}
} ] );

wp.directive( "theTitle", [ function() {
	return{
		restrict:'E',
		replace: true,
		require : '^havePosts',
		link: function( scope, element ) {
			element.html( scope.$parent.post.title.rendered );
		}
	}
} ] );

wp.directive( "theContent", [ function() {
	return{
		restrict:'E',
		replace: true,
		require : '^havePosts',
		link: function( scope, element ) {
			element.html( scope.$parent.post.content.rendered );
		}
	}
} ] );

wp.directive( "thePostThumbnail", [ function() {
	return{
		restrict:'E',
		replace: true,
		require : '^havePosts',
		compile: function( tElement, tAttrs, transclude ) {
			return {
				post: function postLink( scope, element, attrs, controller ) {
					if ( ! attrs.size ) {
						attrs.size = 'post-thumbnail';
					}
					var scheme = 'https://api.w.org/featuredmedia';
					var post = scope.$parent.post;
					var img;
					if ( post._embedded && post._embedded[scheme] && post._embedded[scheme].length ) {
						if ( post._embedded[scheme][0].media_details.sizes[attrs.size] ) {
							img = post._embedded[scheme][0].media_details.sizes[attrs.size].source_url;
						} else {
							img = post._embedded[scheme][0].media_details.sizes['full'].source_url;
						}
					}
					if ( img ) {
						scope.image_src = img;
					}
				}
			}
		},
		template: "<div class=\"the-post-thumbnail\"><img ng-src=\"{{ image_src }}\"></div>"
	}
} ] );

wp.directive( "theId", [ function() {
	return{
		restrict:'E',
		replace: true,
		require : '^havePosts',
		compile: function( tElement, tAttrs, transclude ) {
			return {
				post: function postLink( scope, element, attrs, controller ) {
					scope.post_id = scope.$parent.post.id;
				}
			}
		},
		template: "<div class=\"the-id\">{{ post_id }}</div>"
	}
} ] );







