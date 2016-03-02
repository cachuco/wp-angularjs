describe( 'wp directive', function() {

	var $compile,
		$rootScope;

	beforeEach( module( 'wp' ) );

	beforeEach( inject( function( _$compile_, _$rootScope_ ) {
		$compile = _$compile_;
		$rootScope = _$rootScope_;
	} ) );

	it( 'Element should be div', inject( function( $rootScope, $compile ) {
		var element = $compile( '<wp post-type="posts" />' )( $rootScope );
		$rootScope.$digest();
		expect( element.prop('tagName') ).toEqual( 'DIV' );
	} ) );

	it( 'postType should be posts', inject( function( $rootScope, $compile ) {
		var element = $compile( '<wp post-type="posts" />' )( $rootScope );
		$rootScope.$digest();
		expect( $rootScope.$$childTail.postType ).toEqual( 'posts' );
	} ) );

	it( 'postType should be posts', inject( function( $rootScope, $compile ) {
		var element = $compile( '<wp post-id="123" />' )( $rootScope );
		$rootScope.$digest();
		expect( $rootScope.$$childTail.postId ).toEqual( '123' );
	} ) );
} );
