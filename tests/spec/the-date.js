describe( 'theDate directive', function() {

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

	it( 'Tests for <the-date>', inject( function( $filter, $rootScope, $compile ) {
		var date = '2016-02-16T13:54:13Z';
		var format = 'yyyy/MM/ddTH:mm:ssZ';
		var html = '<have-posts api-root="' + api + '" post-type="posts">'
						+ '<the-date></the-date></have-posts>';
		var element = $compile( html )( $rootScope );
		$rootScope.$digest();
		$httpBackend.flush();
		expect( angular.element( '.the-date', element ).length ).toEqual( 3 );
		for ( var i = 0; i < angular.element( '.the-date', element ).length; i++ ) {
			var n = i + 1;
			expect( angular.element( '.the-date', element ).eq(i).text() )
				.toEqual( $filter('date')( date, format, 'Z' ) );
		}
	} ) );

	it( 'Tests for <the-date> with format',
				inject( function( $filter, $rootScope, $compile ) {
		var html = '<have-posts api-root="' + api + '" post-type="posts">'
						+ '<the-date format="yyyy/MM/dd"></the-date></have-posts>';
		var element = $compile( html )( $rootScope );
		$rootScope.$digest();
		$httpBackend.flush();
		expect( angular.element( '.the-date', element ).length ).toEqual( 3 );
		for ( var i = 0; i < angular.element( '.the-date', element ).length; i++ ) {
			var n = i + 1;
			expect( angular.element( '.the-date', element ).eq(i).text() )
				.toEqual( $filter('date')( '2016-02-16T13:54:13Z', 'yyyy/MM/dd', 'Z' ) );
		}
	} ) );
} );
