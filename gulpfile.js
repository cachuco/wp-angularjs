'use strict';

var gulp = require( "gulp" ),
    uglify = require( "gulp-uglifyjs" ),
    concat = require( "gulp-concat" );

gulp.task( 'concat', function() {
  return gulp.src( [ 'src/wp.js', 'src/wp-services.js' ] )
    .pipe( concat( 'wp-angular.js' ) )
    .pipe( gulp.dest( 'build' ) );
});

gulp.task( 'uglify', function() {
  return gulp.src( [ 'src/wp.js', 'src/wp-services.js' ] )
    .pipe( uglify( 'wp-angular.min.js' ) )
    .pipe( gulp.dest( 'build' ) );
});

gulp.task( 'default', [ 'concat', 'uglify' ], function () {

} );
