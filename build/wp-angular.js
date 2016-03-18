/**
 * @module wp
 */
angular.module( "wp", [
	"wp.services",
	"ngResource",
	"ngSanitize"
] )

/**
 * @name have-posts
 *
 * @description
 *
 * The `havePosts` directive is a WordPress loop.
 *
 * **Attributes**
 *
 * | Attribute | Type   | Details                                                        |
 * |-----------|--------|----------------------------------------------------------------|
 * | api-root  | string | Root url of the API. e.g. http://example.com/wp-json/wp/v2     |
 * | post-type | string | `posts` or `pages` or `media` or custom post type.             |
 * | per-page  | number | The number of posts per page. Default is 10.                   |
 * | offset    | number | The number of post to displace or pass over. Default is 0.     |
 * | post-id   | number | The ID of the post.                                            |
 * | filter    | object | The object of the filter.                                      |
 *
 * @example
 *
 * ```html
 * <have-posts api-root="http://example.com" post-type="posts">
 *   <h2 class="entry-title"><the-title></the-title></h2>
 *   <div class="entry-content"><the-content></the-content></div>
 * </have-posts>
 * ```
 *
 * If you want to get single post, you can use `post-id`.
 *
 * ```html
 * <have-posts api-root="http://example.com" post-type="posts" post-id="123">
 *   <h2 class="entry-title"><the-title></the-title></h2>
 *   <div class="entry-content"><the-content></the-content></div>
 * </have-posts>
 * ```
 *
 * You can pass filters to
 * [WP_Query](https://codex.wordpress.org/Class_Reference/WP_Query)
 * through via the `filter` argument.
 *
 * ```html
 * <have-posts api-root="http://example.com" post-type="posts"
 *            filter="{ order: 'ASC', cat: 123 }">
 *   <h2 class="entry-title"><the-title></the-title></h2>
 *   <div class="entry-content"><the-content></the-content></div>
 * </have-posts>
 * ```
 *
 */
.directive( "havePosts", [ "WP", function( WP ) {
	return {
		restrict: "E",
		replace: true,
		transclude: true,
		scope: {
			postType: '@',
			postId: '@',
			apiRoot: '@',
			perPage: '@',
			offset: '@',
			filter: '='
		},
		controller: [ "$scope", function( $scope ) {
			$scope.load = function() {
				if ( $scope.query == $scope.last_query ) {
					return;
				}
				$scope.last_query = $scope.query;
				if ( $scope.postId ) {
					WP.Query( $scope.apiRoot ).get( $scope.query ).$promise
							.then( function( posts ) {
						$scope.posts.push( posts );
					} );
				} else if ( $scope.filter && $scope.filter.name ) {
					WP.Query( $scope.apiRoot ).query( $scope.query ).$promise
								.then( function( posts ) {
						if ( posts.length ) {
							$scope.is_nextpage = false;
							$scope.posts = posts;
						}
					} );
				} else {
					WP.Query( $scope.apiRoot ).query( $scope.query ).$promise
								.then( function( posts ) {
						if ( posts.length ) {
							$scope.is_nextpage = true;
							$scope.posts = $scope.posts.concat( posts );
							$scope.last_query = {};
							$scope.query.offset = parseInt( $scope.query.offset )
									+ parseInt( $scope.perPage);
							// for ionic framework
							$scope.$broadcast( 'scroll.infiniteScrollComplete' );
							$scope.$broadcast( 'scroll.refreshComplete');
						} else {
							$scope.is_nextpage = false;
						}
					} );
				}
			}
		} ],
		compile: function( tElement, tAttrs, transclude ) {
			return {
				pre: function preLink( scope, element, attrs, controller ) {
					scope.posts = [];
					if ( scope.postId ) {
						scope.query = {
							'endpoint': scope.postType,
							'id': scope.postId,
							'_embed': true
						}
					} else {
						if ( ! scope.perPage ) {
							scope.perPage = 10;
						}
						if ( ! scope.offset ) {
							scope.offset = 0;
						}
						var query = {
							'endpoint': scope.postType,
							'per_page': scope.perPage,
							'offset': scope.offset,
							'filter[orderby]': 'date',
							'filter[order]': 'DESC',
							'_embed': true
						}

						scope.query = angular.extend(
							query,
							WP.parseFilters( scope.filter )
						);
					}
					scope.load();
				}
			}
		},
		link: function( $scope ) {
			$scope.$watch( 'filter', function( newValue ) {
				$scope.posts = [];
				scope.query = angular.extend(
					scope.query,
					WP.parseFilters( newValue )
				);
				scope.load();
			} );
		},
		template: function( tElement, tAttrs ) {
			try {
				if ( !! angular.module( 'infinite-scroll' ) ) {
					return "<div class=\"have-posts\">"
							+ "<div infinite-scroll=\"load()\""
							+ " infinite-scroll-immediate-check=\"false\""
							+ " infinite-scroll-distance=\"1\">"
							+ "<article class=\"{{ postType }}"
							+ " post-{{ post.id }}\" ng-repeat=\"post in posts\">"
							+ "<div ng-transclude></div></article>"
							+ "</div></div>";
				}
			} catch( e ) {
				try {
					if ( !! angular.module( 'ionic' ) ) {
						return "<div class=\"have-posts\">"
								+ "<article class=\"{{ postType }}"
								+ " post-{{ post.id }}\" ng-repeat=\"post in posts\">"
								+ "<div ng-transclude></div></article>"
								+ "<ion-infinite-scroll"
								+ " ng-if=\"is_nextpage\""
								+ " on-infinite=\"load()\""
								+ " immediate-check=\"false\""
								+ " distance=\"1%\">"
								+ "</ion-infinite-scroll>"
								+ "</div>";
					}
				} catch( e ) {
					return "<div class=\"have-posts\">"
							+ "<article class=\"{{ postType }}"
							+ " post-{{ post.id }}\" ng-repeat=\"post in posts\">"
							+ "<div ng-transclude></div></article>"
							+ "</div>";
				}
			}
		}
	}
} ] )

/**
 * @name the-title
 *
 * @description
 *
 * Displays the post title of the current post.
 * This tag must be used within The `<have-posts>`.
 *
 * **Attributes**
 *
 * | Attribute | Type   | Details                                                        |
 * |-----------|--------|----------------------------------------------------------------|
 * | href      | string | Specify a link URL like `#/app/posts/:id`.                     |
 *
 * @example
 *
 * ```html
 * <the-title></the-title>
 * ```
 * Then:
 * ```html
 * <div class="the-title">Hello World</div>
 * ```
 * If you need a link to the post on your app. Please add `href` as attribute.
 * ```html
 * <the-title href="#/posts/:id"></the-title>
 * ```
 * Then:
 * ```html
 * <div class="the-title"><a href="#/posts/123">Hello World</a></div>
 * ```
 * `:id` is a placeholder of the post's id. You can use `:slug` as post's slug too.
 * ```html
 * <the-title href="#/posts/:slug"></the-title>
 * ```
 * Then:
 * ```html
 * <div class="the-title"><a href="#/posts/hello-world">Hello World</a></div>
 * ```
 */
.directive( "theTitle", [ "$sce", function( $sce ) {
	return{
		restrict:'E',
		replace: true,
		require : '^havePosts',
		transclude: true,
		compile: function( tElement, tAttrs, transclude ) {
			return {
				post: function postLink( scope, element, attrs, controller ) {
					var post = scope.$parent.post;
					scope.title = post.title.rendered;
					if ( tAttrs.href ) {
						scope.permalink = tAttrs.href;
						scope.permalink = scope.permalink.replace( ':id', post.id );
						scope.permalink = scope.permalink.replace( ':slug', post.slug );
					} else {
						scope.permalink = '';
					}
				}
			}
		},
		template: function( tElement, tAttrs ) {
			if ( tAttrs.href ) {
				return "<div class=\"the-title\">"
						+ "<a ng-href=\"{{ permalink }}\" ng-bind-html=\"title\">"
							+ "{{ title }}</a></div>";
			} else {
				return "<div class=\"the-title\" ng-bind-html=\"title\">"
						+ "{{ title }}</div>";
			}
		}
	}
} ] )

/**
 * @name the-content
 *
 * @description
 *
 * Displays the post content of the current post.
 * This tag must be used within The `<have-posts>`.
 *
 * @example
 *
 * ```html
 * <the-content></the-content>
 * ```
 * Then:
 * ```html
 * <div class="the-content"><p>Hello World</p></div>
 * ```
 */
.directive( "theContent", [ "$sce", function( $sce ) {
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
} ] )

/**
 * @name the-post-thumbnail
 *
 * @description
 *
 * Displays the post thumbnail of the current post.
 * This tag must be used within The `<have-posts>`.
 *
 * **Attributes**
 *
 * | Attribute | Type   | Details                                                        |
 * |-----------|--------|----------------------------------------------------------------|
 * | size      | string | Size of the post thumbnail. Default is `full`.                 |
 * | href      | string | Specify a link URL like `#/app/posts/:id`.                     |
 *
 * @example
 *
 * ```html
 * <the-post-thumbnail></the-post-thumbnail>
 * ```
 * Then:
 * ```
 * <div class="the-post-thumbnail"><img src="http://example.com/image.jpg"></div>
 * ```
 * Uses `size` attribute.
 * ```html
 * <the-post-thumbnail size="full"></the-post-thumbnail>
 * ```
 * Then:
 * ```
 * <div class="the-post-thumbnail"><img src="http://example.com/image.jpg"></div>
 * ```
 * If you need a link to the post on your app. Please add `href` as attribute.
 * ```html
 * <the-post-thumbnail href="#/posts/:id"></the-post-thumbnail>
 * ```
 * Then:
 * ```html
 * <div class="the-post-thumbnail">
 *   <a href="#/posts/123"><img src="http://example.com/image.jpg"></a>
 * </div>
 * ```
 * `:id` is a placeholder of the post's id. You can use `:slug` as post's slug too.
 *
 * ```html
 * <the-post-thumbnail href="#/posts/:slug"></the-post-thumbnail>
 * ```
 * Then:
 * ```html
 * <div class="the-post-thumbnail">
 *   <a href="#/posts/123"><img src="http://example.com/image.jpg"></a>
 * </div>
 * ```
 */
.directive( "thePostThumbnail", [ function() {
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

					var post = scope.$parent.post;
					if ( tAttrs.href ) {
						scope.permalink = tAttrs.href;
						scope.permalink = scope.permalink.replace( ':id', post.id );
						scope.permalink = scope.permalink.replace( ':slug', post.slug );
					} else {
						scope.permalink = '';
					}
				}
			}
		},
		template: function( tElement, tAttrs ) {
			if ( tAttrs.href ) {
				return "<div class=\"the-post-thumbnail\">"
						+ "<a ng-href=\"{{ permalink }}\">"
							+ "<img ng-src=\"{{ image_src }}\"></a></div>";
			} else {
				return "<div class=\"the-post-thumbnail\">"
							+ "<img ng-src=\"{{ image_src }}\"></div>"
			}
		}
	}
} ] )

/**
 * @name the-id
 *
 * @description
 *
 * Displays the ID of the current post.
 * This tag must be used within The `<have-posts>`.
 *
 * @example
 *
 * ```
 * <the-id></the-id>
 * ```
 * Then:
 * ```
 * <div class="the-id">123</div>
 * ```
 */
.directive( "theId", [ function() {
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
} ] )

/**
 * @name the-excerpt
 *
 * @description
 *
 * Displays the excerpt of the current post.
 * This tag must be used within The `<have-posts>`.
 *
 * @example
 *
 * Place the code like following into your HTML.
 * ```
 * <the-excerpt></the-excerpt>
 * ```
 * Then you will get like following.
 * ```
 * <div class="the-excerpt"><p>Hello World.</p></div>
 * ```
 */
.directive( "theExcerpt", [ '$sce', function( $sce ) {
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
} ] )

/**
 * @name the-date
 *
 * @description
 *
 * Displays the date of the current post.
 * This tag must be used within The `<have-posts>`.
 *
 * **Attributes**
 *
 * | Attribute | Type   | Details                                                        |
 * |-----------|--------|----------------------------------------------------------------|
 * | format    | string | See https://docs.angularjs.org/api/ng/filter/date              |
 *
 * @example
 *
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
 * <the-date format="yyyy/MM/dd"></the-date>
 * ```
 * Then you will get like following.
 * ```
 * <div class="the-date">2016-02-16</div>
 * ```
 */
.directive( "theDate", [ function() {
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
} ] )

;

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
