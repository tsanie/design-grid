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
          key: 'col1',
          caption: 'col 1',
          visible: true,
        },
        {
          key: 'col2',
          visible: true,
        },
      ],
      source: [{
          col1: 'abc',
          col2: 'd',
        },
        {
          col1: 'row2',
          col2: 'd2',
        },
      ],
    },
    events: {
      columnDblClick(key, index) {
        console.log(`double click ${key}, index of ${index}.`);
      },
    },
  },
});
