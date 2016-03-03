describe( 'have-posts directive', function() {

	var $compile,
		$rootScope;

	beforeEach( module( 'wp' ) );

	beforeEach( inject( function( _$compile_, _$rootScope_ ) {
		$compile = _$compile_;
		$rootScope = _$rootScope_;
	} ) );

	it( '<have-posts> should be div', inject( function( $rootScope, $compile ) {
		var element = $compile( '<have-posts post-type="posts">Post type is {{ postType }}</div>' )( $rootScope );
		$rootScope.$digest();
		expect( element.prop( 'tagName' ) ).toEqual( 'DIV' );
	} ) );

	it( 'Text should be "Post type is posts"', inject( function( $rootScope, $compile ) {
		var element = $compile( '<have-posts post-type="posts">Post type is {{ postType }}</div>' )( $rootScope );
		$rootScope.$digest();
		expect( element.text() ).toEqual( 'Post type is posts' );
	} ) );

	it( '<have-posts> should have class `posts`', inject( function( $rootScope, $compile ) {
		var element = $compile( '<have-posts post-type="posts" />' )( $rootScope );
		$rootScope.$digest();
		expect( element.hasClass( 'have-posts' ) ).toEqual( true );
	} ) );

	it( '<have-posts> should have class "pages"', inject( function( $rootScope, $compile ) {
		var element = $compile( '<have-posts post-type="pages" />' )( $rootScope );
		$rootScope.$digest();
		expect( element.hasClass( 'pages' ) ).toEqual( true );
	} ) );

	it( 'postType should be posts', inject( function( $rootScope, $compile ) {
		var element = $compile( '<have-posts post-type="posts" />' )( $rootScope );
		$rootScope.$digest();
		expect( $rootScope.postType ).toEqual( 'posts' );
	} ) );

	it( 'postType should be posts', inject( function( $rootScope, $compile ) {
		var element = $compile( '<have-posts post-id="123" />' )( $rootScope );
		$rootScope.$digest();
		expect( $rootScope.postId ).toEqual( '123' );
	} ) );
} );
