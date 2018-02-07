<template>
  <th ref="header" class="d-column-header"
      v-bind:style="headerClass"
      v-on:mousedown.left="onMouseDown"
      v-on:dblclick.left="onDblClick">
    <div class="d-column-header-text">
      <span><slot></slot></span>
    </div><!--
 --><span class="d-column-header-split"
          v-show="enabled"
          v-on:mousedown.prevent.stop.left="onResizeStart"
          v-on:touchstart.prevent.stop="onResizeStart"></span>
  </th>
</template>

<script>
import utils from './utils';
import functions from './design-grid-func';

export default {
  props: {
    index: Number,
    column: null,
    window: null,
    enabled: Boolean,
  },
  computed: {
    headerClass() {
      functions.setColumnStyle.call(this, this.column);
      return {
        width: `${this.column.width}px`,
        textAlign: 'center', // this.column.align,
      };
    },
  },
  methods: {
    onMouseDown(e) {
      if (!this.enabled) {
        return;
      }
      this.$emit('columnMouseDown', this.column.key, this.index);
    },
    onDblClick(e) {
      if (!this.enabled) {
        return;
      }
      this.$emit('columnDblClick', this.column.key, this.index);
    },
    onResizeStart(e) {
      this._cX = utils.ui.getClientX(e);
      this._width = this.column.width;
      this._index = this.index;
      this.window.addEventListener('mousemove', this.onResizeMove, false);
      this.window.addEventListener('mouseup', this.onResizeEnd, false);
      this.window.addEventListener('touchmove', this.onResizeMove, false);
      this.window.addEventListener('touchend', this.onResizeEnd, false);
    },
    onResizeMove(e) {
      this._isResizing = true;
      const cx = utils.ui.getClientX(e);
      const val = this._width + (cx - this._cX);
      if (val < this.column.minWidth) {
        val = this.column.minWidth;
      }
      if (this._innerWidth === val) {
        return;
      }
      this._innerWidth = val;
      this.$refs.header.style.width = `${val}px`;
      this.$emit('widthChanging', this._index, val);
    },
    onResizeEnd() {
      this.window.removeEventListener('mousemove', this.onResizeMove);
      this.window.removeEventListener('mouseup', this.onResizeEnd);
      this.window.removeEventListener('touchmove', this.onResizeMove);
      this.window.removeEventListener('touchend', this.onResizeEnd);
      setTimeout(() => delete this._isResizing, 100);
      if (this._innerWidth != null) {
        this.$emit('widthChanged', this._index, this._innerWidth);
        delete this._innerWidth;
      }
    },
  },
};
</script>
