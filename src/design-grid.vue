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
          v-on:columnMouseDown="__column_header_on_mouse_down"
          v-on:columnDblClick="__column_header_on_dblclick"
          v-on:widthChanging="__column_header_on_width_changing"
          v-on:widthChanged="__column_header_on_width_changed">{{ col.caption || col.key }}</d-column-header><!--
     --><th class="d-column-header-holder"></th>
      </tr>
    </table><!--
 --><div class="d-grid-body" ref="gridbody" v-on:mousedown.left.self="__row_on_mousedown(-1, $event)">
      <table class="d-grid-body-content">
        <tr ref="gridrows" class="d-grid-row"
            v-for="(item, rowidx) in source" v-bind:key="rowidx"
            v-bind:class="__contains_index(selectedIndexes, rowidx) ? 'd-grid-row-selected' : ''"
            v-on:mousedown.left.capture="__row_on_mousedown(rowidx, $event)"
            v-on:dblclick.left.capture="_row_on_dblclick">
          <d-grid-row-header
            v-bind:index="rowidx"
            v-bind:item="item"
            v-bind:window="__window"
            v-bind:defaultHeight="defaultHeight"
            v-on:rowHeaderMouseDown="__row_on_mousedown(rowidx, true)"
            v-on:rowHeaderDblClick="__row_header_on_dblclick(rowidx)"
            v-on:heightChanging="__row_header_on_height_changing"
            v-on:heightChanged="__row_header_on_height_changed"></d-grid-row-header><!--
       --><td v-for="(col, colidx) in columns" v-bind:key="colidx"
              v-bind:class="__contains_index(selectedColIndexes, colidx) ? 'd-grid-cell-selected' : ''"
              v-bind:style="__mixin_style(col.columnStyle, item)"
              v-show="col.visible">
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
import DesignGridRowHeader from './design-grid-row-header.vue';
import utils from './utils';
import functions from './design-grid-func';
import './design-grid.scss';


export default {
  name: 'design-grid',
  components: {
    'd-column-header': DesignGridHeader,
    'd-grid-row-header': DesignGridRowHeader,
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
    defaultHeight: {
      type: Number,
      default() {
        return utils.DEFAULT_LINE_HEIGHT;
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
    __column_header_on_mouse_down(key, index) {
      if (this.selectedIndex != null) {
        this.selectedIndexes = [];
      }
      // columns
      if (this.selectedColIndex !== index ||
        (this.selectedColIndexes && this.selectedColIndexes.length > 1)) {
        this.selectedColIndexes = [index];
      }
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
    __row_header_on_height_changing(index, height) {
      utils.func.throttle(functions.heightChanging, 8, this, index, height);
    },
    __row_header_on_height_changed(index, height) {
      this.$emit('rowHeightChanged', index, height);
    },
    __contains_index(indexes, index) {
      return indexes != null && indexes.indexOf(index) >= 0;
    },
    __mixin_style(style, item) {
      let height = Number(item.__height);
      if (isNaN(height)) {
        height = this.defaultHeight;
      }
      // eslint-disable-next-line object-curly-spacing
      const s = utils.assign({}, style);
      s.height = `${height}px`;
      return s;
    },
    __row_on_mousedown(index, e) {
      let colIndex;
      let cancel;
      if (typeof e === 'boolean') {
        colIndex = e ? -2 : -1;
        cancel = index < 0;
      } else {
        colIndex = functions.getSelectedColumnIndex.call(this, e);
        cancel = index < 0 || e.target.className === 'd-grid-row';
      }
      if (colIndex !== -1) {
        if (cancel) {
          if (this.selectedIndex != null) {
            this.selectedIndexes = [];
          }
        } else {
          if (this.selectedIndex !== index ||
            (this.selectedIndexes && this.selectedIndexes.length > 1)) {
            this.selectedIndexes = [index];
          }
        }
      }
      // columns
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
        this.$emit('cellDblClick', this.selectedIndex, columnIndex);
      }
    },
    __row_on_value_changed(item, key, value) {
      this.$emit('cellValueChanged', item, key, value);
    },
  },
};
</script>
