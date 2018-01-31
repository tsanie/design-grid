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
          caption: 'col 1',
          visible: true,
        },
        {
          caption: 'col 2',
          visible: true,
        },
      ],
    },
  },
});
