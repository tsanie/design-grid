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
        },
        {
          A: 'link-path-test.PFTYPE',
          B: '',
          C: '',
        },
        {
          A: 'test message',
          B: 'abc',
          C: '',
          enabled: true,
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
