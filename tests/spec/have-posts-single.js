describe( 'havePosts directive', function() {

	var $compile,
		$rootScope;

	beforeEach( module( 'wp' ) ); // It should be module for testing.

	beforeEach( inject( function( _$httpBackend_, _$compile_, _$rootScope_ ) {
		$httpBackend = _$httpBackend_;
		$compile = _$compile_;
		$rootScope = _$rootScope_;

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

	it( 'post id should be 3',
				inject( function( $rootScope, $compile ) {
		var html = '<have-posts api-root="' + api
						+ '" post-type="posts" post-id="3"></div>'
		var element = $compile( html )( $rootScope );
		$rootScope.$digest();
		$httpBackend.flush();
		expect( $rootScope.$$childTail.postId ).toEqual( "3" );
	} ) );

	it( 'query should be correct',
				inject( function( $rootScope, $compile ) {
		var html = '<have-posts api-root="' + api
						+ '" post-type="posts" post-id="3"></div>'
		var element = $compile( html )( $rootScope );
		$rootScope.$digest();
		$httpBackend.flush();
		expect( $rootScope.$$childTail.query )
				.toEqual( { endpoint: 'posts', id: '3', _embed: true } );
	} ) );

	it( 'template tag should be working',
				inject( function( $rootScope, $compile ) {
		var html = '<have-posts api-root="' + api
				+ '" post-type="posts" post-id="3"><the-id></the-id></div>'
		var element = $compile( html )( $rootScope );
		$rootScope.$digest();
		$httpBackend.flush();
		expect( $( '.the-id', element ).eq( 0 ).text() ).toEqual( "3" );
	} ) );
} );
