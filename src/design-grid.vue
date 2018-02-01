<template>
  <div class="d-grid">
    <table class="d-grid-table-header">
      <tr class="d-grid-header" ref="header">
        <d-column-header v-for="(col, idx) in columns" v-show="col.visible"
          v-bind:window="__window"
          v-bind:key="idx" v-bind:index="idx"
          v-bind:column="col"
          v-on:columnDblClick="__column_header_on_dblclick"
          v-on:widthChanging="__column_header_on_width_changing"
          v-on:widthChanged="__column_header_on_width_changed">{{ col.caption }}</d-column-header><!--
     --><th class="d-column-header-holder"></th>
      </tr>
    </table><!--
 --><div class="d-grid-body" ref="gridbody">
      <table class="d-grid-body-content">
        <tr v-for="(item, rowidx) in source" v-bind:key="rowidx"
            v-bind:class="__index_of_selected_indexes(rowidx) >= 0 ? 'd-grid-row-selected' : ''">
          <td v-for="(col, tdidx) in columns" v-bind:key="tdidx"
              v-bind:style="col.columnStyle" v-show="col.visible"></td>
        </tr>
      </table>
    </div>
  </div>
</template>

<script>
import DesignGridHeader from './design-grid-header.vue';
import utils from './utils';
import functions from './design-grid-func';
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
      selectedIndexes: [],
    };
  },
  mounted() {
    functions.wrapColumns.call(this, this.columns);
    this.__window.addEventListener('resize', this.__window_on_resize, false);
  },
  beforeDestroy() {
    this.__window.removeEventListener('resize', this.__window_on_resize);
  },
  updated() {
    functions.updateBodyTop.call(this);
  },
  computed: {
    __window() {
      return this.window || window;
    },
  },
  methods: {
    __window_on_resize() {
      utils.func.throttle(functions.windowResizing, 8, this);
    },
    __column_header_on_dblclick(key, index) {
      this.$emit('columnDblClick', key, index);
    },
    __column_header_on_width_changing(index, width) {
      functions.updateBodyTop.call(this);
      utils.func.throttle(functions.widthChanging, 8, this, index, width);
    },
    __column_header_on_width_changed(index, width) {
      functions.resizeColumn.call(this, index, width);
      this.$emit('columnWidthChanged', index, width);
    },
    __index_of_selected_indexes(index) {
      return this.selectedIndexes.indexOf(index);
    },
  },
};
</script>
