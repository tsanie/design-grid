import Vue from 'vue';
import DesignGrid from './design-grid.vue';

new Vue({
  el: '#app',
  components: {
    'd-grid': DesignGrid,
  },
  data: {
    binds: {
      columns: [{
          key: 'A',
          caption: 'custom A',
          enabled: 'enabled',
          width: 260,
        },
        {
          key: 'B',
          width: 120,
        },
        {
          key: 'C',
          width: 50,
        },
      ],
      source: [{
          A: 'A3/B2',
          B: '//bing.com',
          C: '5',
          enabled: true,
        },
        {
          A: 'link-path-test.PFSTDNAME',
          B: '',
          C: '4',
          __height: 20,
        },
        {
          A: 'link-path-test.PFTYPE',
          B: '',
          C: '',
          __height: 35,
        },
        {
          A: 'test message',
          B: 'abc',
          C: '',
          enabled: true,
        },
      ],
      defaultHeight: 30,
    },
    events: {
      /* eslint-disable max-len */
      columnDblClick(key, index) {
        console.log(`double click column header ${key}, column: [${index}].`);
      },
      rowHeaderDblClick(index) {
        console.log(`double click row header, row: [${index}].`);
      },
      columnWidthChanged(index, width) {
        console.log(`column width changed, column: [${index}], width: ${width}px.`);
      },
      rowHeightChanged(index, height) {
        console.log(`row height changed, row: [${index}], height: ${height}px.`);
      },
      cellDblClick(rowIndex, columnIndex) {
        console.log(`double click cell, column: [${columnIndex}], row: [${rowIndex}].`);
      },
      /* eslint-enable max-len */
    },
  },
});
