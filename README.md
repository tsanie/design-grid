# design-grid

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

## Preview
![image](https://user-images.githubusercontent.com/980449/35720322-1861281c-0828-11e8-96c6-7f8f810a111e.png)

## Usage
  ```vue
  <div id="app"><d-grid v-bind:columns="columns" v-bind:source="source"></d-grid></div>
  ```
  ```js
  import DesignGrid from './design-grid.vue';
  
  new Vue({
    el: '#app',
    components: { 'd-grid': DesignGrid },
    data: {
      columns: [
        { key: 'A', caption: 'custom A', enabled: 'enabled', width: 260 },
        { key: 'B', width: 120 },
        { key: 'C', width: 50 },
      ],
      source: [
        { A: 'A3/B2', B: '//bing.com', C: '5', enabled: true },
        { A: 'link-path-test.PFSTDNAME', B: '', C: '4' },
        { A: 'link-path-test.PFTYPE', B: '', C: '' },
        { A: 'test message', B: 'abc', C: '', enabled: true },
      ],
    },
  }
  ```
