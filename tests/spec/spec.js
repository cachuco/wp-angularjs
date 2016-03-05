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
		$httpBackend.whenGET( /\/(posts)|(pages)\?/ ).respond( 200, [
			{
				id: '123',
				title: {
					rendered: 'Title(1)'
				},
				content: {
					rendered: 'Hello World(1)'
				}
			},
			{
				id: '124',
				title: {
					rendered: 'Title(2)'
				},
				content: {
					rendered: 'Hello World(2)'
				}
			},
			{
				id: '125',
				title: {
					rendered: 'Title(3)'
				},
				content: {
					rendered: 'Hello World(3)'
				}
			}
		] );

		// singular
		// $httpBackend.whenGET( /\/(posts)|(pages)\/[0-9]+$/ ).respond( 200, [
		// 	{
		// 		content: {
		// 			rendered: 'Hello World'
		// 		}
		// 	}
		// ] );
	} ) );

	afterEach(function() {
		$httpBackend.verifyNoOutstandingExpectation();
		$httpBackend.verifyNoOutstandingRequest();
	});

	it( 'module "wp" should be exists', inject( function( $rootScope, $compile ) {
		expect( angular.module( 'wp' ) ).not.toBeNull()
	} ) );

	it( 'module "wp" requires "ngResource"', inject( function( $rootScope, $compile ) {
		expect( angular.module( 'wp' ).requires ).toContain( 'ngResource' )
	} ) );

	it( 'scope.apiRoot should be "http://example.jp"', inject( function( $rootScope, $compile ) {
		var element = $compile( '<have-posts api-root="http://example.jp" post-type="posts">Post type is {{ postType }}</div>' )( $rootScope );
		$rootScope.$digest();
		$httpBackend.flush();
		expect( $rootScope.$$childTail.apiRoot ).toEqual( 'http://example.jp' );
	} ) );

	it( '<have-posts> should be div', inject( function( $rootScope, $compile ) {
		var element = $compile( '<have-posts api-root="http://example.com" post-type="posts">Post type is {{ postType }}</div>' )( $rootScope );
		$rootScope.$digest();
		$httpBackend.flush();
		expect( element.prop( 'tagName' ) ).toEqual( 'DIV' );
	} ) );

	it( '<have-posts> should have class `posts`', inject( function( $rootScope, $compile ) {
		var element = $compile( '<have-posts api-root="http://example.com" post-type="posts" />' )( $rootScope );
		$rootScope.$digest();
		$httpBackend.flush();
		expect( element.hasClass( 'have-posts' ) ).toEqual( true );
	} ) );

	it( 'should have class "pages"', inject( function( $rootScope, $compile ) {
		var element = $compile( '<have-posts api-root="http://example.com" post-type="pages" />' )( $rootScope );
		$rootScope.$digest();
		$httpBackend.flush();
		for ( var i = 0; i < element.children().length; i++ ) {
			expect( angular.element( element.children()[i] ).hasClass( 'pages' ) ).toEqual( true );
		}
	} ) );

	it( 'postType should be posts', inject( function( $rootScope, $compile ) {
		var element = $compile( '<have-posts api-root="http://example.com" post-type="posts" />' )( $rootScope );
		$rootScope.$digest();
		$httpBackend.flush();
		expect( $rootScope.$$childTail.postType ).toEqual( 'posts' );
	} ) );

	// it( 'postId should be 123', inject( function( $rootScope, $compile ) {
	// 	var element = $compile( '<have-posts api-root="http://example.com" post-type="posts" post-id="123" />' )( $rootScope );
	// 	$rootScope.$digest();
	// 	$httpBackend.flush();
	// 	expect( $rootScope.$$childTail.query ).toEqual( { endpoint: 'posts', id: '123' } );
	// } ) );

	it( 'the-id should be like 123', inject( function( $rootScope, $compile ) {
		var element = $compile( '<have-posts api-root="http://example.com" post-type="posts"><the-id></the-id></have-posts>' )( $rootScope );
		$rootScope.$digest();
		$httpBackend.flush();
		for ( var i = 0; i < angular.element( 'a', element ).length; i++ ) {
			expect( angular.element( 'a', element ).eq(i).text() ).toEqual( ( i + 123 ).toString() );
		}
	} ) );

	it( 'Creates a custom template tag', inject( function( $rootScope, $compile ) {
		var element = $compile( '<have-posts api-root="http://example.com" post-type="posts"><my-permalink></my-permalink></have-posts>' )( $rootScope );
		$rootScope.$digest();
		$httpBackend.flush();
		for ( var i = 0; i < angular.element( 'a', element ).length; i++ ) {
			var n = i + 1;
			var id = 123 + i;
			expect( angular.element( 'a', element ).eq(i).text() ).toEqual( 'Title(' + n + ')' );
			expect( angular.element( 'a', element ).eq(i).attr( 'href' ) ).toEqual( '#!/post/' + id );
		}
	} ) );

	it( 'Tests for angular.extend()', inject( function( $rootScope, $compile ) {
		var dst = { key1: 'dst1', key2: 'dst2' };
		var src = { key1: 'src1', key3: 'src3' };
		var res = angular.extend( dst, src );
		expect( res ).toEqual( { key1: 'src1', key2: 'dst2', key3: 'src3' } );
	} ) );
} );
