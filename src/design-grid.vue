<template>
  <div class="d-grid">
    <table class="d-grid-table-header">
      <tr class="d-grid-header" ref="header">
        <th class="d-column-header"></th><!--
     --><d-column-header
          v-for="(col, idx) in columns" v-show="col.visible"
          v-bind:class="__contains_index(selectedColIndexes, idx) ? 'd-column-selected' : ''"
          v-bind:window="__window"
          v-bind:key="idx" v-bind:index="idx"
          v-bind:column="col"
          v-on:columnDblClick="__column_header_on_dblclick"
          v-on:widthChanging="__column_header_on_width_changing"
          v-on:widthChanged="__column_header_on_width_changed">{{ col.caption || col.key }}</d-column-header><!--
     --><th class="d-column-header-holder"></th>
      </tr>
    </table><!--
 --><div class="d-grid-body" ref="gridbody" v-on:mousedown.left.self="__row_on_mousedown(-1, $event)">
      <table class="d-grid-body-content">
        <tr ref="gridrows" class="d-grid-row" v-for="(item, rowidx) in source" v-bind:key="rowidx"
            v-bind:class="__contains_index(selectedIndexes, rowidx) ? 'd-grid-row-selected' : ''"
            v-on:mousedown.left.capture="__row_on_mousedown(rowidx, $event)"
            v-on:dblclick.left.capture="_row_on_dblclick">
          <td v-on:dblclick.left="__row_header_on_dblclick(rowidx)">{{ rowidx + 1 }}</td><!--
       --><td v-for="(col, colidx) in columns" v-bind:key="colidx"
              v-bind:style="col.columnStyle" v-show="col.visible">
            <d-column-input v-bind:item="item" v-bind:column="col"
                            v-bind:index="rowidx"
                            v-on:valueChanged="__row_on_value_changed"></d-column-input>
          </td><td></td>
        </tr>
      </table>
    </div>
  </div>
</template>

<script>
import DesignGridHeader from './design-grid-header.vue';
import DesignGridColumnInput from './design-grid-column-input.vue';
import utils from './utils';
import functions from './design-grid-func';
import './design-grid.scss';


export default {
  name: 'design-grid',
  components: {
    'd-column-header': DesignGridHeader,
    'd-column-input': DesignGridColumnInput,
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
      selectedColIndexes: [],
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
    selectedIndex() {
      const count = this.selectedIndexes && this.selectedIndexes.length;
      if (count > 0) {
        return this.selectedIndexes[count - 1];
      }
      return null;
    },
    selectedColIndex() {
      const count = this.selectedColIndexes && this.selectedColIndexes.length;
      if (count > 0) {
        return this.selectedColIndexes[count - 1];
      }
      return null;
    },
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
    __contains_index(indexes, index) {
      return indexes != null && indexes.indexOf(index) >= 0;
    },
    __row_on_mousedown(index, e) {
      if (index < 0 || e.target.className === 'd-grid-row') {
        if (this.selectedIndex != null) {
          this.selectedIndexes = [];
        }
      } else {
        if (this.selectedIndex !== index ||
          (this.selectedIndexes && this.selectedIndexes.length > 1)) {
          this.selectedIndexes = [index];
        }
      }
      // columns
      const colIndex = functions.getSelectedColumnIndex.call(this, e);
      if (this.selectedColIndex !== colIndex ||
        (this.selectedColIndexes && this.selectedColIndexes.length > 1)) {
        this.selectedColIndexes = [colIndex];
      }
    },
    __row_header_on_dblclick(index) {
      this.$emit('rowHeaderDblClick', index);
    },
    _row_on_dblclick(e) {
      const columnIndex = functions.getSelectedColumnIndex.call(this, e);
      if (columnIndex >= 0) {
        this.$emit('rowDblClick', this.selectedIndex, columnIndex);
      }
    },
    __row_on_value_changed(item, key, value) {
      this.$emit('cellValueChanged', item, key, value);
    },
  },
};
</script>
