[![view on npm](http://img.shields.io/npm/v/reduce-without.svg)](https://www.npmjs.org/package/reduce-without)
[![npm module downloads](http://img.shields.io/npm/dt/reduce-without.svg)](https://www.npmjs.org/package/reduce-without)
[![Build Status](https://travis-ci.org/75lb/reduce-without.svg?branch=master)](https://travis-ci.org/75lb/reduce-without)
[![Dependency Status](https://david-dm.org/75lb/reduce-without.svg)](https://david-dm.org/75lb/reduce-without)
[![js-standard-style](https://img.shields.io/badge/code%20style-standard-brightgreen.svg)](https://github.com/feross/standard)

<a name="module_reduce-without"></a>
## reduce-without
<a name="exp_module_reduce-without--without"></a>
### without(toRemove) ⇒ <code>Array</code> ⏏
Returns a new array with the same content as the input minus the specified values. It accepts the same query syntax as [module:array-tools.where](module:array-tools.where).

**Kind**: Exported function  

| Param | Type | Description |
| --- | --- | --- |
| toRemove | <code>Array</code> | the input array |
|  | <code>any</code> &#124; <code>Array.&lt;any&gt;</code> | one, or more queries |

**Example**  
```js
> a.without([ 1, 2, 3 ], 2)
[ 1, 3 ]

> a.without([ 1, 2, 3 ], [ 2, 3 ])
[ 1 ]

> data = [
    { name: "Dana", age: 30 },
    { name: "Yana", age: 20 },
    { name: "Zhana", age: 10 }
]
> a.without(data, { name: /ana/ })
[]
```

* * *

&copy; 2016 Lloyd Brookes \<75pound@gmail.com\>. Documented by [jsdoc-to-markdown](https://github.com/jsdoc2md/jsdoc-to-markdown).
