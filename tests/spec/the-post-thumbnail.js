describe( 'Directives', function() {

	var $compile,
		$rootScope;

	var full_image = 'https://www.evernote.com/l/'
				+ 'ABURHaZ_cIJCyrUTUkp0urCtits38Jfl69sB/image.png';
	var thumbnail_image = 'https://www.evernote.com/l/'
				+ 'ABWrCUwgQt9BIJYGmO1A5dsqBTKobFqPlnYB/image.png';

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
				date_gmt: '2016-02-16T13:54:13',
				_embedded: {
					'https://api.w.org/featuredmedia': [
						{
							media_details: {
								sizes: {
									full: {
										source_url: full_image
									},
									'post-thumbnail': {
										source_url: thumbnail_image
									}
								}
							}
						}
					]
				}
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

	it( 'Tests for <the-post-thumbnail>', inject( function( $rootScope, $compile ) {
		var html = '<have-posts api-root="' + api + '" post-type="posts">'
						+ '<the-post-thumbnail></the-post-thumbnail></have-posts>';
		var element = $compile( html )( $rootScope );
		$rootScope.$digest();
		$httpBackend.flush();
		expect( angular.element( 'img', element ).length ).toEqual( 3 );
		expect( angular.element( 'img', element ).eq( 0 ).attr( 'src' ) )
				.toEqual( thumbnail_image );
	} ) );

	it( 'Tests for <the-post-thumbnail size="full">',
				inject( function( $rootScope, $compile ) {
		var html = '<have-posts api-root="' + api + '" post-type="posts">'
						+ '<the-post-thumbnail size="full"></the-post-thumbnail>'
							+ '</have-posts>';
		var element = $compile( html )( $rootScope );
		$rootScope.$digest();
		$httpBackend.flush();
		expect( angular.element( 'img', element ).length ).toEqual( 3 );
		expect( angular.element( 'img', element ).eq( 0 ).attr( 'src' ) )
				.toEqual( full_image );
	} ) );

	it( 'Image size should be full', inject( function( $rootScope, $compile ) {
		var html = '<have-posts api-root="' + api + '" post-type="posts">'
						+ '<the-post-thumbnail size="large"></the-post-thumbnail>'
							+'</have-posts>';
		var element = $compile( html )( $rootScope );
		$rootScope.$digest();
		$httpBackend.flush();
		expect( angular.element( 'img', element ).length ).toEqual( 3 );
		expect( angular.element( 'img', element ).eq( 0 ).attr( 'src' ) )
				.toEqual( full_image );
		expect( angular.element( '.the-post-thumbnail a', element ).length ).toEqual( 0 );
	} ) );

	it( 'A should be', inject( function( $rootScope, $compile ) {
		var html = '<have-posts api-root="' + api + '" post-type="posts">'
						+ '<the-post-thumbnail href="#/p/:id" size="large">'
							+ '</the-post-thumbnail></have-posts>';
		var element = $compile( html )( $rootScope );
		$rootScope.$digest();
		$httpBackend.flush();
		expect( angular.element( '.the-post-thumbnail > a', element ).length )
				.toEqual( 3 );
		expect( angular.element( '.the-post-thumbnail > a', element )
				.eq( 0 ).attr( 'href' ) ).toEqual( '#/p/1' );
		expect( angular.element( '.the-post-thumbnail > a > img', element ).length )
				.toEqual( 3 );
		expect( angular.element( '.the-post-thumbnail > a > img', element )
				.eq( 0 ).attr( 'src' ) ).toEqual( full_image );
	} ) );
} );
