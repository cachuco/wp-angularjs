describe( 'Directives', function() {

	var $compile,
		$rootScope;

	beforeEach( module( 'wp' ) ); // It should be module for testing.

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
					rendered: '<p>Hello World(1)</p>'
				},
				excerpt: {
					rendered: '<p>This is the excerpt. (1)</p>'
				},
				date_gmt: '2016-02-16T13:54:13'
			},
			{
				id: '2',
				title: {
					rendered: 'Title(2)'
				},
				content: {
					rendered: '<p>Hello World(2)</p>'
				},
				excerpt: {
					rendered: '<p>This is the excerpt. (2)</p>'
				},
				date_gmt: '2016-02-16T13:54:13'
			},
			{
				id: '3',
				title: {
					rendered: 'Title(3)'
				},
				content: {
					rendered: '<p>Hello World(3)</p>'
				},
				excerpt: {
					rendered: '<p>This is the excerpt. (3)</p>'
				},
				date_gmt: '2016-02-16T13:54:13'
			}
		] );
	} ) );

	afterEach(function() {
		$httpBackend.verifyNoOutstandingExpectation();
		$httpBackend.verifyNoOutstandingRequest();
	});

	var api = "http://example.jp";

	it( 'Tests for <the-title>', inject( function( $rootScope, $compile ) {
		var html = '<have-posts api-root="' + api + '" post-type="posts">'
						+ '<the-title></the-title></have-posts>';
		var element = $compile( html )( $rootScope );
		$rootScope.$digest();
		$httpBackend.flush();
		expect( angular.element( '.the-title', element ).length ).toEqual( 3 );
		for ( var i = 0; i < angular.element( '.the-title', element ).length; i++ ) {
			var n = i + 1;
			expect( angular.element( '.the-title', element ).eq(i).html() )
				.toEqual( 'Title(' + n + ')' );
		}
		expect( angular.element( '.the-title a', element ).length ).toEqual( 0 );
	} ) );

	it( 'Tests for <the-title>', inject( function( $rootScope, $compile ) {
		var html = '<have-posts api-root="' + api + '" post-type="posts">'
						+ '<the-title href="#/posts/:id"></the-title></have-posts>';
		var element = $compile( html )( $rootScope );
		$rootScope.$digest();
		$httpBackend.flush();
		expect( angular.element( '.the-title a', element ).length ).toEqual( 3 );
	} ) );
} );
