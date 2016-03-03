describe( 'have-posts directive', function() {

	var $compile,
		$rootScope;

	beforeEach( module( 'wp' ) );

	beforeEach( inject( function( _$httpBackend_, _$compile_, _$rootScope_ ) {
		$httpBackend = _$httpBackend_;
		$compile = _$compile_;
		$rootScope = _$rootScope_;

		// list of the posts or pages
		$httpBackend.whenGET( /\/(posts)|(pages)\?/ ).respond( 200, [ {
			key: 'value'
		} ] );

		// singular
		$httpBackend.whenGET( /\/(posts)|(pages)\/[0-9]+$/ ).respond( 200, [ {
			key: 'value'
		} ] );
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
		expect( $rootScope.apiRoot ).toEqual( 'http://example.jp' );
	} ) );

	it( '<have-posts> should be div', inject( function( $rootScope, $compile ) {
		var element = $compile( '<have-posts api-root="http://example.com" post-type="posts">Post type is {{ postType }}</div>' )( $rootScope );
		$rootScope.$digest();
		$httpBackend.flush();
		expect( element.prop( 'tagName' ) ).toEqual( 'DIV' );
	} ) );

	it( 'Text should be "Post type is posts"', inject( function( $rootScope, $compile ) {
		var element = $compile( '<have-posts api-root="http://example.com" post-type="posts">Post type is {{ postType }}</div>' )( $rootScope );
		$rootScope.$digest();
		$httpBackend.flush();
		expect( element.text() ).toEqual( 'Post type is posts' );
	} ) );

	it( '<have-posts> should have class `posts`', inject( function( $rootScope, $compile ) {
		var element = $compile( '<have-posts api-root="http://example.com" post-type="posts" />' )( $rootScope );
		$rootScope.$digest();
		$httpBackend.flush();
		expect( element.hasClass( 'have-posts' ) ).toEqual( true );
	} ) );

	it( '<have-posts> should have class "pages"', inject( function( $rootScope, $compile ) {
		var element = $compile( '<have-posts api-root="http://example.com" post-type="pages" />' )( $rootScope );
		$rootScope.$digest();
		$httpBackend.flush();
		expect( element.hasClass( 'pages' ) ).toEqual( true );
	} ) );

	it( 'postType should be posts', inject( function( $rootScope, $compile ) {
		var element = $compile( '<have-posts api-root="http://example.com" post-type="posts" />' )( $rootScope );
		$rootScope.$digest();
		$httpBackend.flush();
		expect( $rootScope.postType ).toEqual( 'posts' );
	} ) );

	it( 'postId should be 123', inject( function( $rootScope, $compile ) {
		var element = $compile( '<have-posts api-root="http://example.com" post-type="posts" post-id="123" />' )( $rootScope );
		$rootScope.$digest();
		$httpBackend.flush();
		expect( $rootScope.query ).toEqual( { endpoint: 'posts', id: '123' } );
		expect( $rootScope.postId ).toEqual( '123' );
	} ) );
} );
