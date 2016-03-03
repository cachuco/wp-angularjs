describe( 'have_posts directive', function() {

	var $compile,
		$rootScope;

	beforeEach( module( 'wp' ) );

	beforeEach( inject( function( _$compile_, _$rootScope_ ) {
		$compile = _$compile_;
		$rootScope = _$rootScope_;
	} ) );

	it( '<have_posts> should be div', inject( function( $rootScope, $compile ) {
		var element = $compile( '<have_posts postType="posts">Hello {{ hello }}</have_posts>' )( $rootScope );
		$rootScope.$digest();
		console.log( element );
		expect( element.prop( 'tagName' ) ).toEqual( 'DIV' );
	} ) );

	it( '<have-posts> should be div', inject( function( $rootScope, $compile ) {
		var element = $compile( '<have-posts post-type="posts" />' )( $rootScope );
		$rootScope.$digest();
		expect( element.prop( 'tagName' ) ).toEqual( 'DIV' );
	} ) );

	it( '<have_posts> should have class `posts`', inject( function( $rootScope, $compile ) {
		var element = $compile( '<have_posts post-type="posts" />' )( $rootScope );
		$rootScope.$digest();
		expect( element.hasClass( 'have-posts' ) ).toEqual( true );
	} ) );

	it( '<have_posts> should have class @postType', inject( function( $rootScope, $compile ) {
		var element = $compile( '<have_posts post-type="pages" />' )( $rootScope );
		$rootScope.$digest();
		expect( element.hasClass( 'pages' ) ).toEqual( true );
	} ) );

	it( 'postType should be posts', inject( function( $rootScope, $compile ) {
		var element = $compile( '<have_posts post-type="posts" />' )( $rootScope );
		$rootScope.$digest();
		expect( $rootScope.$$childTail.postType ).toEqual( 'posts' );
	} ) );

	it( 'postType should be posts', inject( function( $rootScope, $compile ) {
		var element = $compile( '<have_posts post-id="123" />' )( $rootScope );
		$rootScope.$digest();
		expect( $rootScope.$$childTail.postId ).toEqual( '123' );
	} ) );
} );
