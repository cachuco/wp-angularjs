describe( 'have-posts directive', function() {

	/**
	 * Example of the custom template tag for testing
	 */
	var myapp = angular.module( "myapp", [ "wp" ] );

	myapp.directive( "myPermalink", [ '$sce', function( $sce ) {
		return{
			restrict:'E',
			replace: true,
			require : '^havePosts',
			compile: function( tElement, tAttrs, transclude ) {
				return {
					post: function postLink( scope, element, attrs, controller ) {
						// `scope.$parent.post` is the post object
						scope.post_id = scope.$parent.post.id;
						scope.title = scope.$parent.post.title.rendered;
					}
				}
			},
			template: "<a ng-href=\"#!/post/{{ post_id }}\">{{ title }}</a>"
		}
	} ] );
	// end custom template tag

	var $compile,
		$rootScope;

	beforeEach( module( 'myapp' ) ); // It should be module for testing.

	beforeEach( inject( function( _$httpBackend_, _$compile_, _$rootScope_ ) {
		$httpBackend = _$httpBackend_;
		$compile = _$compile_;
		$rootScope = _$rootScope_;

		// list of the posts or pages
		$httpBackend.when( 'GET', /\/(posts)|(pages)\?/ ).respond( 200, [
			{
				id: '1',
				title: {
					rendered: 'Title(1)'
				},
				content: {
					rendered: 'Hello World(1)'
				}
			},
			{
				id: '2',
				title: {
					rendered: 'Title(2)'
				},
				content: {
					rendered: 'Hello World(2)'
				}
			},
			{
				id: '3',
				title: {
					rendered: 'Title(3)'
				},
				content: {
					rendered: 'Hello World(3)'
				}
			}
		] );

		// get singular content
		$httpBackend.when( 'GET', /\/(posts)|(pages)\/[0-9]+/ ).respond( 200, {
			id: '3',
			title: {
				rendered: 'Title(3)'
			},
			content: {
				rendered: 'Hello World(3)'
			}
		} );
	} ) );

	afterEach(function() {
		$httpBackend.verifyNoOutstandingExpectation();
		$httpBackend.verifyNoOutstandingRequest();
	});

	var api = "http://example.jp";

	it( 'module "wp" should be exists', inject( function( $rootScope, $compile ) {
		expect( angular.module( 'wp' ) ).not.toBeNull()
	} ) );

	it( 'module "wp" requires "ngResource"', inject( function( $rootScope, $compile ) {
		expect( angular.module( 'wp' ).requires ).toContain( 'ngResource' )
	} ) );

	it( 'scope.apiRoot should be "http://example.jp"',
				inject( function( $rootScope, $compile ) {
		var html = '<have-posts api-root="' + api
						+ '" post-type="posts">Post type is {{ postType }}</div>'
		var element = $compile( html )( $rootScope );
		$rootScope.$digest();
		$httpBackend.flush();
		expect( $rootScope.$$childTail.apiRoot ).toEqual( api );
	} ) );

	it( '<have-posts> should be div', inject( function( $rootScope, $compile ) {
		var html = '<have-posts api-root="' + api
						+ '" post-type="posts">Post type is {{ postType }}</div>'
		var element = $compile( html )( $rootScope );
		$rootScope.$digest();
		$httpBackend.flush();
		expect( element.prop( 'tagName' ) ).toEqual( 'DIV' );
	} ) );

	it( '<have-posts> should have class `posts`',
				inject( function( $rootScope, $compile ) {
		var html = '<have-posts api-root="' + api + '" post-type="posts" />';
		var element = $compile( html )( $rootScope );
		$rootScope.$digest();
		$httpBackend.flush();
		expect( element.hasClass( 'have-posts' ) ).toEqual( true );
	} ) );

	it( 'should have class "pages"', inject( function( $rootScope, $compile ) {
		var html = '<have-posts api-root="' + api + '" post-type="pages" />';
		var element = $compile( html )( $rootScope );
		$rootScope.$digest();
		$httpBackend.flush();
		for ( var i = 0; i < element.children().length; i++ ) {
			expect( angular.element( element.children()[i] ).hasClass( 'pages' ) )
				.toEqual( true );
		}
	} ) );

	it( 'postType should be posts', inject( function( $rootScope, $compile ) {
		var html = '<have-posts api-root="' + api + '" post-type="posts" />';
		var element = $compile( html )( $rootScope );
		$rootScope.$digest();
		$httpBackend.flush();
		expect( $rootScope.$$childTail.postType ).toEqual( 'posts' );
	} ) );

	// it( 'postId should be 123', inject( function( $rootScope, $compile ) {
	// 	var html '<have-posts api-root="' + api + '" post-type="posts" post-id="3">'
	// 				+ '</have-posts>';
	// 	var element = $compile( html )( $rootScope );
	// 	$rootScope.$digest();
	// 	$httpBackend.flush();
	// 	expect( $rootScope.$$childTail.query ).toEqual( { endpoint: 'posts', id: '3' } );
	// } ) );

	it( 'the-id should be like 123', inject( function( $rootScope, $compile ) {
		var html = '<have-posts api-root="' + api + '" post-type="posts">'
						+ '<the-id></the-id></have-posts>'
		var element = $compile( html )( $rootScope );
		$rootScope.$digest();
		$httpBackend.flush();
		for ( var i = 0; i < angular.element( 'a', element ).length; i++ ) {
			var n = i + 1;
			expect( angular.element( 'a', element ).eq(i).text() ).toEqual( ( n )
				.toString() );
		}
	} ) );

	it( 'Creates a custom template tag', inject( function( $rootScope, $compile ) {
		var html = '<have-posts api-root="' + api + '" post-type="posts">'
						+ '<my-permalink></my-permalink></have-posts>';
		var element = $compile( html )( $rootScope );
		$rootScope.$digest();
		$httpBackend.flush();
		for ( var i = 0; i < angular.element( 'a', element ).length; i++ ) {
			var n = i + 1;
			expect( angular.element( 'a', element ).eq(i).text() )
				.toEqual( 'Title(' + n + ')' );
			expect( angular.element( 'a', element ).eq(i).attr( 'href' ) )
				.toEqual( '#!/post/' + n );
		}
	} ) );

	it( 'Tests for angular.extend()', inject( function( $rootScope, $compile ) {
		var dst = { key1: 'dst1', key2: 'dst2' };
		var src = { key1: 'src1', key3: 'src3' };
		var res = angular.extend( dst, src );
		expect( res ).toEqual( { key1: 'src1', key2: 'dst2', key3: 'src3' } );
	} ) );
} );
