import Vue from 'vue';
import DesignGrid from './design-grid.vue';

new Vue({
  el: '#app',
  components: {
    'd-grid': DesignGrid,
  },
  data: {
    /* eslint-disable max-len */
    /* eslint-disable object-curly-spacing */
    binds: {
      enabled: true,
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
    /* eslint-enable object-curly-spacing */
    events: {
      'column-dbl-click'(key, index) {
        console.log(`double click column header ${key}, column: [${index}].`);
      },
      'row-header-dbl-click'(index) {
        console.log(`double click row header, row: [${index}].`);
      },
      'column-width-changed'(index, width) {
        console.log(`column width changed, column: [${index}], width: ${width}px.`);
      },
      'row-height-changed'(index, height) {
        console.log(`row height changed, row: [${index}], height: ${height}px.`);
      },
      'cell-dbl-click'(rowIndex, columnIndex) {
        console.log(`double click cell, column: [${columnIndex}], row: [${rowIndex}].`);
      },
      'cell-value-changed'(item, key, value) {
        console.log(`cell value changed, item['${key}'] = '${value}'.`, item);
      },
      /* eslint-enable max-len */
    },
  },
});
