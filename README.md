# wp-angular

[![Build Status](https://travis-ci.org/miya0001/wp-angular.svg?branch=master)](https://travis-ci.org/miya0001/wp-angular)

This project is in progress...

## Getting Started

```html
<!DOCTYPE html>
<html ng-app="wp">
<head>
	<meta charset="UTF-8">
	<link rel="stylesheet" type="text/css" href="path/to/style.css">
	<title>WP-Angular</title>
	<script src="path/to/angularjs/1.5.0/angular.min.js"></script>
	<script src="path/to/angularjs/1.5.0/angular-resource.min.js"></script>
	<script src="path/to/angularjs/1.5.0/angular-sanitize.min.js"></script>
	<script src="path/to/wp-angular.min.js"></script>
</head>
<body>
	<have-posts api-root="http://example.com/wp-json/wp/v2"
						post-type="posts" offset="0" per-page="5">
		<header class="entry-header">
			<the-post-thumbnail size="post-thumbnaiil"></the-post-thumbnail>
			<h1 class="entry-title"><the-title></the-title></h1>
			<div class="entry-meta">
				<the-date format="yyyy/mm/dd"></the-date>
			</div>
		</header>
		<div class="entry-content">
			<the-content></the-content>
		</div>
	</have-posts>
</body>
</html>
```

Demo: [http://miya0001.github.io/wp-angular/tests/tests.html](http://miya0001.github.io/wp-angular/tests/tests.html)

## API Reference

* [<have-posts>](#have-posts)
* [<the-title>](#the-title)
* [<the-content>](#the-content)
* [<the-post-thumbnail>](#the-post-thumbnail)
* [<the-id>](#the-id)
* [<the-excerpt>](#the-excerpt)
* [<the-date>](#the-date)

---

### <have-posts>
The `havePosts` directive is a WordPress loop.

**Attributes**

| Attribute | Type   | Details                                                        |
|-----------|--------|----------------------------------------------------------------|
| api-root  | string | Root url of the API. e.g. http://example.com/wp-json/wp/v2     |
| post-type | string | `posts` or `pages` or `media` or custom post type.             |
| per-page  | number | The number of posts per page. Default is 10.                   |
| offset    | number | The number of post to displace or pass over. Default is 0.     |

**Example**  
```html
<have-posts api-root="http://example.com" post-type="posts">
  <h2 class="entry-title"><the-title></the-title></h2>
  <div class="entry-content"><the-content></the-content></div>
</have-posts>
```
---
### <the-title>
Displays the post title of the current post.

**Attributes**

| Attribute | Type   | Details                                                        |
|-----------|--------|----------------------------------------------------------------|
| href      | string | Specify a link URL like `#/app/posts/:id`.                     |

**Example**  
```html
<the-title></the-title>
```
Then:
```html
<div class="the-title">Hello World</div>
```

If you need a link to the post on your app. Please add `href` as attribute.

```html
<the-title href="#/posts/:id"></the-title>
```
`:id` is a placeholder of the post's id. You can use `:slug` as post's slug too.

Then:
```html
<div class="the-title"><a href="#/posts/123">Hello World</a></div>
```
---
### <the-content>
Displays the post content of the current post.

**Example**  
```html
<the-content></the-content>
```
Then:
```html
<div class="the-content"><p>Hello World</p></div>
```
---
### <the-post-thumbnail>
Displays the post thumbnail of the current post.

**Attributes**

| Attribute | Type   | Details                                                        |
|-----------|--------|----------------------------------------------------------------|
| size      | string | Size of the post thumbnail. Default is `full`.                 |
| href      | string | Specify a link URL like `#/app/posts/:id`.                     |

**Example**  
```html
<the-post-thumbnail></the-post-thumbnail>
```
Then:
```
<div class="the-post-thumbnail"><img src="http://example.com/image.jpg"></div>
```

Uses `size` attribute.
```html
<the-post-thumbnail size="full"></the-post-thumbnail>
```
Then:
```
<div class="the-post-thumbnail"><img src="http://example.com/image.jpg"></div>
```

If you need a link to the post on your app. Please add `href` as attribute.

```html
<the-post-thumbnail href="#/posts/:id"></the-post-thumbnail>
```
`:id` is a placeholder of the post's id. You can use `:slug` as post's slug too.

Then:
```html
<div class="the-post-thumbnail">
  <a href="#/posts/123"><img src="http://example.com/image.jpg"></a>
</div>
```
---
### <the-id>
Displays the ID of the current post.

**Example**  
```
<the-id></the-id>
```
Then:
```
<div class="the-id">123</div>
```
---
### <the-excerpt>
Displays the excerpt of the current post.

**Example**  
Place the code like following into your HTML.
```
<the-excerpt></the-excerpt>
```
Then you will get like following.
```
<div class="the-excerpt"><p>Hello World.</p></div>
```
---
### <the-date>
Displays the date of the current post.

**Attributes**

| Attribute | Type   | Details                                                        |
|-----------|--------|----------------------------------------------------------------|
| format    | string | See https://docs.angularjs.org/api/ng/filter/date              |

**Example**  
Place the code like following into your HTML.
```
<the-date></the-date>
```
Then you will get like following.
```
<div class="the-date">2016-02-16 13:54:13</div>
```

You can set format string like following.
See https://docs.angularjs.org/api/ng/filter/date.
```
<the-date  format="yyyy/MM/dd"></the-date>
```
Then you will get like following.
```
<div class="the-date">2016-02-16</div>
```
---

## Creates your custom template tag

```
// Registers your module, you should import `wp`.
var myapp = angular.module( "myapp", [ "wp" ] );

// Creates a `<my-permalink></my-permalink>` as custom template tag.
// If you place it in your HTML,
// then you can get `<a href="#!/post/123">Hello</a>`.
myapp.directive( "myPermalink", [ '$sce', function( $sce ) {
	return{
		restrict:'E',
		replace: true,
		require : '^havePosts',
		compile: function( tElement, tAttrs, transclude ) {
			return {
				post: function postLink( scope, element, attrs, controller ) {
					var post = scope.$parent.post; // post object
					scope.post_id = post.id;
					scope.title = post.title.rendered;
				}
			}
		},
		template: "<a ng-href=\"#!/post/\"></a>"
	}
} ] );
```

## Enables Infinite Scroll

Please load [ngInfiniteScroll](https://sroze.github.io/ngInfiniteScroll/) like following.

```
<script src="path/to/jquery.min.js"></script>
<script src="path/to/angularjs/1.5.0/angular.min.js"></script>
<script src="path/to/angularjs/1.5.0/angular-resource.min.js"></script>
<script src="path/to/angularjs/1.5.0/angular-sanitize.min.js"></script>
<script src="path/to/ng-infinite-scroll.min.js"></script>
```

Add `infinite-scroll` as a dependency.

```
angular.module( "app", [ "wp", "infinite-scroll" ] );
```

That's it.

## How to contribute

```
$ npm install
```

Run testing.

```
$ npm test
```

Build `js/wp-angular.min.js`.

```
$ npm run build
```

Build documentation.

```
$ npm run docs
```

