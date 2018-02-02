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
        },
        {
          key: 'B',
        },
      ],
      source: [{
          A: 'abc',
          B: 'd',
        },
        {
          A: 'row2',
          B: 'd2',
        },
      ],
    },
    events: {
      columnDblClick(key, index) {
        console.log(`double click ${key} [${index}].`);
      },
      rowHeaderDblClick(index) {
        console.log(`double click [row header], index of ${index}.`);
      },
    },
  },
});
