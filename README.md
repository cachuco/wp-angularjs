# wp-angular

[![Build Status](https://travis-ci.org/miya0001/wp-angular.svg?branch=master)](https://travis-ci.org/miya0001/wp-angular)

This project is in progress...

```
<have-posts api-root="http://api.wp-app.org/wp-json/wp/v2" post-type="posts">
	<the-post-thumbnail data-size="post-thumbnaiil" class="hello"></the-post-thumbnail>
	<h1 class="entry-title"><the-title></the-title></h1>
	<div class="entry-content">
		<the-content></the-content>
	</div>
</have-posts>
```

Demo: [http://miya0001.github.io/wp-angular/tests/tests.html](http://miya0001.github.io/wp-angular/tests/tests.html)

## Adds custom template tag

```
// Registers your module, you should import `wp`.
var myapp = angular.module( "myapp", [ "wp" ] );

// Adds `<my-the-id></my-the-id>` then `<div>123</div>`
myapp.directive( "myTheId", [ function() {
	return{
		restrict:'E',
		replace: true,
		require : '^havePosts',
		compile: function( tElement, tAttrs, transclude ) {
			return {
				post: function postLink( scope, element, attrs, controller ) {
					// `scope.$parent.post` is the post object
					scope.post_id = scope.$parent.post.id;
				}
			}
		},
		template: "<div>{{ post_id }}</div>"
	}
} ] );
```

## How to contribute

```
$ npm install
$ npm test
```
