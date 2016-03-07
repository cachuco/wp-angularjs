'use strict';

var wp = angular.module( "wp", [
	"wp.services",
	"ngResource",
	"ngSanitize"
] );

/**
 * @category directives
 * @name havePosts
 *
 * @description
 * The `havePosts` directive is a WordPress loop.
 *
 * ### Example
 *
 * ```
 * <have-posts api-root="http://example.com" post-type="posts">
 *   <h2 class="entry-title"><the-title></the-title></h2>
 *   <div class="entry-content"><the-content></the-content></div>
 * </have-posts>
 * ```
 *
 * ### Attributes
 * | Attribute | Type   | Details                                                        |
 * |-----------|--------|----------------------------------------------------------------|
 * | api-root  | string | Root url of the API. e.g. http://example.com/wp-json/wp/v2     |
 * | post-type | string | `posts` or `pages` or `media` or custom post type.             |
 * | per-page  | number | The number of posts per page. Default is 10.                   |
 * | offset    | number | The number of post to displace or pass over. Default is 0.     |
 */
wp.directive( "havePosts", [ "wpQuery", function( wpQuery ) {
	return {
		restrict: "E",
		replace: true,
		transclude: true,
		scope: {
			postType: '@',
			postId: '@',
			apiRoot: '@',
			perPage: '@',
			offset: '@'
		},
		controller: [ "$scope", function( $scope ) {
			// nothing to do, but we need here
			$scope.load = function() {
				if ( true == $scope.busy ) {
					return;
				}
				$scope.busy = true;
				wpQuery( $scope.apiRoot ).query( $scope.query ).$promise
							.then( function( posts ) {
					if ( posts.length ) {
						$scope.posts = $scope.posts.concat( posts );
						$scope.busy = false;
						$scope.query.offset = parseInt( $scope.query.offset )
								+ parseInt( $scope.perPage);
					}
				} );
			}
		} ],
		compile: function( tElement, tAttrs, transclude ) {
			return {
				pre: function preLink( scope, element, attrs, controller ) {
					scope.posts = [];
					if ( scope.postId ) {
						scope.query = {
							'endpoint': scope.postType,
							'id': scope.postId
						}
						wpQuery( scope.apiRoot ).get( scope.query ).$promise
								.then( function( posts ) {
							scope.posts.push( posts );
						} );
					} else {
						if ( ! scope.perPage ) {
							scope.perPage = 10;
						}
						if ( ! scope.offset ) {
							scope.offset = 0;
						}
						scope.query = {
							'endpoint': scope.postType,
							'per_page': scope.perPage,
							'offset': scope.offset,
							'filter[orderby]': 'date',
							'filter[order]': 'DESC',
							'_embed': true
						}
						scope.load();
					}
				}
			}
		},
		template: "<div class=\"have-posts\">"
					+ "<div infinite-scroll=\"load()\""
								+ " infinite-scroll-distance=\"2\">"
					+ "<article class=\"{{ postType }}"
						+ " post-{{ post.id }}\" ng-repeat=\"post in posts\">"
							+ "<div ng-transclude></div></article>"
								+ "</div></div>"
	}
} ] );


/**
 * @category directives
 * @name theTitle
 *
 * @description
 * Displays the post title of the current post.
 *
 * ### Example
 *
 * ```
 * <the-title></the-title>
 * ```
 * Then:
 * ```
 * <div class="the-title">Hello World</div>
 * ```
 */
wp.directive( "theTitle", [ "$sce", function( $sce ) {
	return{
		restrict:'E',
		replace: true,
		require : '^havePosts',
		transclude: true,
		compile: function( tElement, tAttrs, transclude ) {
			return {
				post: function postLink( scope, element, attrs, controller ) {
					scope.title = scope.$parent.post.title.rendered;
				}
			}
		},
		template: "<div class=\"the-title\" ng-bind-html=\"title\">{{ title }}</div>"
	}
} ] );


/**
 * @category directives
 * @name theContent
 *
 * @description
 * Displays the post content of the current post.
 *
 * ## Example
 *
 * ```
 * <the-content></the-content>
 * ```
 * Then:
 * ```
 * <div class="the-content"><p>Hello World</p></div>
 * ```
 */
wp.directive( "theContent", [ "$sce", function( $sce ) {
	return{
		restrict:'E',
		replace: true,
		require : '^havePosts',
		compile: function( tElement, tAttrs, transclude ) {
			return {
				post: function postLink( scope, element, attrs, controller ) {
					var post = scope.$parent.post;
					scope.content = $sce.trustAsHtml( post.content.rendered );
				}
			}
		},
		template: "<div class=\"the-content\" ng-bind-html=\"content\">"
						+ "{{ content }}</div>"
	}
} ] );


/**
 * @category directives
 * @name thePostThumbnail
 *
 * @description
 * Displays the post thumbnail of the current post.
 *
 * ### Attributes
 * | Attribute | Type   | Details                                                        |
 * |-----------|--------|----------------------------------------------------------------|
 * | size      | string | Size of the post thumbnail. Default is `full`.                 |
 *
 * ### Example
 *
 * ```
 * HTML: <the-post-thumbnail></the-post-thumbnail>
 * Result: <div class="the-post-thumbnail"><img src="http://example.com/image.jpg"></div>
 * ```
 *
 * Sets the size `full`, so post thumbnail's size will be `full`.
 * ```
 * HTML: <the-post-thumbnail size="full"></the-post-thumbnail>
 * Result: <div class="the-post-thumbnail"><img src="http://example.com/image.jpg"></div>
 * ```
 */
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
					var _embedded = scope.$parent.post._embedded;
					var img;
					if ( _embedded && _embedded[scheme] && _embedded[scheme].length ) {
						if ( _embedded[scheme][0].media_details.sizes[attrs.size] ) {
							img = _embedded[scheme][0].media_details
									.sizes[attrs.size].source_url;
						} else {
							img = _embedded[scheme][0].media_details
									.sizes['full'].source_url;
						}
					}
					if ( img ) {
						scope.image_src = img;
					}
				}
			}
		},
		template: "<div class=\"the-post-thumbnail\">"
						+ "<img ng-src=\"{{ image_src }}\"></div>"
	}
} ] );


/**
 * @category directives
 * @name theId
 *
 * @description
 * Displays the ID of the current post.
 *
 * ```
 * <the-id></the-id>
 * ```
 * Then:
 * ```
 * <div class="the-id">123</div>
 * ```
 */
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


/**
 * @category directives
 * @name theExcerpt
 *
 * @description
 * Displays the excerpt of the current post.
 *
 * ### Example
 * Place the code like following into your HTML.
 * ```
 * <the-excerpt></the-excerpt>
 * ```
 * Then you will get like following.
 * ```
 * <div class="the-excerpt"><p>Hello World.</p></div>
 * ```
 */
wp.directive( "theExcerpt", [ '$sce', function( $sce ) {
	return{
		restrict:'E',
		replace: true,
		require : '^havePosts',
		compile: function( tElement, tAttrs, transclude ) {
			return {
				post: function postLink( scope, element, attrs, controller ) {
					var post = scope.$parent.post;
					scope.excerpt = $sce.trustAsHtml( post.excerpt.rendered );
				}
			}
		},
		template: "<div class=\"the-excerpt\" ng-bind-html=\"excerpt\">"
						+ "{{ excerpt }}</div>"
	}
} ] );


/**
 * @category directives
 * @name theDate
 *
 * @description
 * Displays the date of the current post.
 *
 * ### Attributes
 * | Attribute | Type   | Details                                                        |
 * |-----------|--------|----------------------------------------------------------------|
 * | format    | string | See https://docs.angularjs.org/api/ng/filter/date              |
 *
 * ### Example
 * Place the code like following into your HTML.
 * ```
 * <the-date></the-date>
 * ```
 * Then you will get like following.
 * ```
 * <div class="the-date">2016-02-16 13:54:13</div>
 * ```
 *
 * You can set format string like following.
 * See https://docs.angularjs.org/api/ng/filter/date.
 * ```
 * <the-date  format="yyyy/MM/dd"></the-date>
 * ```
 * Then you will get like following.
 * ```
 * <div class="the-date">2016-02-16</div>
 * ```
 */
wp.directive( "theDate", [ function() {
	return{
		restrict:'E',
		replace: true,
		require : '^havePosts',
		compile: function( tElement, tAttrs, transclude ) {
			return {
				post: function postLink( scope, element, attrs, controller ) {
					if ( ! attrs.format ) {
						scope.format = "yyyy/MM/ddTH:mm:ssZ";
					} else {
						scope.format = attrs.format;
					}
					var date = scope.$parent.post.date_gmt + "Z";
					scope.date = date;
				}
			}
		},
		template: "<div class=\"the-date\">{{ date | date: format }}</div>"
	}
} ] );
