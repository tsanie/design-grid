# design-grid

[![build-image]][build-url]
[![dependency-image]][dependency-url]
[![devDependency-image]][devDependency-url]

[build-image]: https://travis-ci.org/tsanie/design-grid.svg?branch=master
[build-url]: https://travis-ci.org/tsanie/design-grid?branch=master
[dependency-image]: https://img.shields.io/david/tsanie/design-grid.svg
[dependency-url]: https://david-dm.org/tsanie/design-grid
[devDependency-image]: https://img.shields.io/david/dev/tsanie/design-grid.svg
[devDependency-url]: https://david-dm.org/tsanie/design-grid?type=dev

> A Design-Grid vue component.

## Build Setup

``` bash
# install dependencies
npm install

# serve with hot reload at localhost:8080
npm run dev

# build for production with minification
npm run build
```

For detailed explanation on how things work, consult the [docs for vue-loader](http://vuejs.github.io/vue-loader).

## Features

- Custom columns (caption, style, filter)
- Drag to resize column width and row height
- Change the enabled and style of a specific cell
- Dynamic and observable
- ...

## Preview
![preview](https://user-images.githubusercontent.com/980449/35776599-713ec12a-09da-11e8-90b8-ff97f4eb1be5.png)

## Installation

  ### NPM

  ```sh
  $ npm install design-grid
  ```

  ### Reference

  ```js
  // CommonJS
  // var DesignGrid = require('design-grid');
  // ES6
  import DesignGrid from 'design-grid';

  new Vue({
    components: {
      'design-grid': DesignGrid,
    },
  });
  ```

  ### Browser

  ```html
  <script src="path/to/vue.min.js"></script>
  <script src="dist/design-grid.min.js"></script>

  <script type="text/javascript">
    var DesignGrid = window['design-grid'].default;
  </script>
  ```

## Usage

  ```vue
  <div id="app">
    <d-grid v-bind:columns="columns"
            v-bind:source="source"
            v-bind:default-height="defaultHeight"></d-grid>
  </div>
  ```
  ```js
  import Vue from 'vue';
  import DesignGrid from './design-grid.vue';
  
  new Vue({
    el: '#app',
    components: { 'd-grid': DesignGrid },
    data: {
      columns: [
        {
          key: 'A', width: 260,
          // whether the cell is enabled is depending on a PROPERTY of the item
          enabled: '__enabled',
          // the cell style is depending on a FUNCTION
          style: (item, index) => index === 2 && { borderBottom: '3px solid green' },
          // cell content style definition
          contentStyle: '__contentStyle',
        },
        {
          key: 'B', width: 120, caption: 'custom B',
          // the cell style is depending on a PROPERTY of the item
          style: '__style',
        },
        {
          key: 'C', width: 50, align: 'right',
          // the cell style is the fixed
          style: { borderRight: '4px solid orange' },
        },
      ],
      source: [
        { A: 'A3/B2', B: '//bing.com', C: '5', __enabled: true, __style: { border: '2px solid gray' } },
        { A: 'link-path-test.PFSTDNAME', B: '', C: '4', __contentStyle: { color: 'red', textDecoration: 'underline' } },
        // row 3 has a custom height: 45px
        { A: 'link-path-test.PFTYPE', B: '', C: '', __height: 45 },
        { A: 'test message', B: 'abc', C: '', __enabled: true },
      ],
      defaultHeight: 26,
    },
  }
  ```
