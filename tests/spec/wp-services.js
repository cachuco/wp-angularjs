describe( 'Tests of the wp.services', function() {

	var $rootScope;

	beforeEach( module( 'wp' ) ); // It should be module for testing.

	beforeEach( inject( function( _$rootScope_ ) {
		$rootScope = _$rootScope_;
	} ) );


	it( 'module "wp.services" should be exists', inject( function( $rootScope ) {
		expect( angular.module( 'wp.services' ) ).not.toBeNull();
	} ) );

	it( 'module "wp" requires "wp.services"', inject( function( $rootScope ) {
		expect( angular.module( 'wp' ).requires ).toContain( 'wp.services' );
	} ) );

	it( 'Filters should be empty"', inject( function( $rootScope, WP ) {
		expect( WP.parseFilters() ).toEqual( {} );
	} ) );

	it( 'Filters should be empty"', inject( function( $rootScope, WP ) {
		expect( WP.parseFilters( {
			test1: 1,
			test2: 2
		} ) ).toEqual( {
			'filter[test1]': 1,
			'filter[test2]': 2
		} );
	} ) );

	it( 'Filters should be empty"', inject( function( $rootScope, WP ) {
		expect( WP.parseFilters( {
			test1: 1,
			test2: 2
		} ) ).toEqual( {
			'filter[test1]': 1,
			'filter[test2]': 2
		} );
	} ) );

	it( 'Filters should be empty"', inject( function( $rootScope, WP ) {
		var query = {
			"filter[test1]": "cherry",
			"filter[test3]": "pine"
		}

		var result = angular.extend( query, WP.parseFilters( {
			test1: "apple",
			test2: "orange"
		} ) );

		expect( result ).toEqual( {
			"filter[test1]": "apple",
			"filter[test2]": "orange",
			"filter[test3]": "pine"
		} );
	} ) );
} );
