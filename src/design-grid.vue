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
          v-bind:enabled="enabled"
          v-on:columnMouseDown="__column_header_on_mouse_down"
          v-on:columnDblClick="__column_header_on_dblclick"
          v-on:widthChanging="__column_header_on_width_changing"
          v-on:widthChanged="__column_header_on_width_changed">{{ col.caption || col.key }}</d-column-header><!--
     --><th class="d-column-header-holder"></th>
      </tr>
    </table><!--
 --><div class="d-grid-body" ref="gridbody"
         v-on:mousedown.left.self="__row_on_mousedown(-1, true)"
         v-on:scroll.passive="__grid_body_on_scroll">
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
            v-bind:enabled="enabled"
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
                            v-bind:enabled="enabled"
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

function checkIfSame(indexes, olds) {
  if (olds === indexes) {
    return true;
  }
  if (olds != null && indexes != null && olds.length === indexes.length) {
    const tmp = [];
    olds.forEach((i) => tmp[i] = 1);
    indexes.forEach((i) => tmp[i]--);
    let changed = false;
    tmp.forEach((i) => changed = changed && (tmp[i] !== 0));
    if (!changed) {
      return true;
    }
  }
  return false;
}

export default {
  name: 'design-grid',
  components: {
    'd-column-header': DesignGridHeader,
    'd-grid-row-header': DesignGridRowHeader,
    'd-column-input': DesignGridColumnInput,
  },
  props: {
    enabled: {
      type: Boolean,
      default() {
        return true;
      },
    },
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
  watch: {
    selectedIndexes(val) {
      if (checkIfSame(val, this._oldSelectedIndexes)) {
        return;
      }
      this.$emit('selected-indexes-changed', val, this._oldSelectedIndexes);
      this._oldSelectedIndexes = val;
    },
    selectedColIndexes(val) {
      if (checkIfSame(val, this._oldSelectedColIndexes)) {
        return;
      }
      this.$emit('selected-col-indexes-changed', val,
        this._oldSelectedColIndexes);
      this._oldSelectedColIndexes = val;
    },
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
      this.$emit('column-header-mouse-down', key, index);
    },
    __column_header_on_dblclick(key, index) {
      this.$emit('column-dbl-click', key, index);
    },
    __column_header_on_width_changing(index, width) {
      functions.updateBodyTop.call(this);
      utils.func.throttle(functions.widthChanging, 8, this, index, width);
    },
    __column_header_on_width_changed(index, width) {
      functions.resizeColumn.call(this, index, width);
      this.$emit('column-width-changed', index, width);
    },
    __row_header_on_height_changing(index, height) {
      utils.func.throttle(functions.heightChanging, 8, this, index, height);
    },
    __row_header_on_height_changed(index, height) {
      this.$emit('row-height-changed', index, height);
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
      if (s.width === '0px') {
        s.display = 'none';
      }
      s.height = `${height}px`;
      return s;
    },
    __grid_body_on_scroll(e) {
      const left = e.target.scrollLeft;
      if (this._scrollLeft !== left) {
        utils.set(this, '_scrollLeft', left);
        this.$refs.header.parentElement.style.marginLeft = `${-left}px`;
      }
    },
    __row_on_mousedown(index, e) {
      if (!this.enabled) {
        return;
      }
      let colIndex;
      let cancel;
      if (typeof e === 'boolean') {
        colIndex = e ? -2 : -1;
        cancel = index < 0;
        if (!cancel) {
          this.$emit('row-header-mouse-down', index);
        }
      } else {
        colIndex = functions.getSelectedColumnIndex.call(this, e);
        cancel = index < 0 || e.target.className === 'd-grid-row';
      }
      if (colIndex !== -1 || typeof e !== 'boolean') {
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
      if (colIndex < 0) {
        this.selectedColIndexes = [];
      } else if (this.selectedColIndex !== colIndex ||
        (this.selectedColIndexes && this.selectedColIndexes.length > 1)) {
        this.selectedColIndexes = [colIndex];
      }
    },
    __row_header_on_dblclick(index) {
      this.$emit('row-header-dbl-click', index);
    },
    _row_on_dblclick(e) {
      if (!this.enabled) {
        return;
      }
      const columnIndex = functions.getSelectedColumnIndex.call(this, e);
      if (columnIndex >= 0) {
        this.$emit('cell-dbl-click', this.selectedIndex, columnIndex);
      }
    },
    __row_on_value_changed(item, key, value) {
      this.$emit('cell-value-changed', item, key, value);
    },
  },
};
</script>
