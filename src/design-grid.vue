<template>
  <div class="d-grid">
    <table class="d-grid-table-header">
      <tr class="d-grid-header" ref="header">
        <d-column-header v-for="(col, idx) in columns" v-show="col.visible"
          v-bind:window="__window"
          v-bind:key="idx">{{ col.caption }}</d-column-header><!--
     --><th class="d-column-header-holder"></th>
      </tr>
    </table><!--
 --><div class="d-grid-body">

    </div>
  </div>
</template>

<script>
import DesignGridHeader from './design-grid-header.vue';
import './design-grid.scss';

export default {
  name: 'design-grid',
  components: {
    'd-column-header': DesignGridHeader,
  },
  props: {
    columns: {
      type: Array,
      default() {
        return [];
      },
      required: true,
    },
    source: {
      type: Array,
      default() {
        return [];
      },
    },
    window: {
      default() {
        return window;
      },
    },
  },
  data() {
    return {
      msg: 'Welcome to Your Vue.js App',
    };
  },
  computed: {
    __window() {
      return this.window || window;
    },
  },
};
</script>
