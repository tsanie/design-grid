<template>
  <th ref="header" class="d-column-header"
      v-on:dblclick.left="dblclick">
    <div class="d-column-header-text">
      <span><slot></slot></span>
    </div><!--
 --><span class="d-column-header-split"
          v-on:mousedown.prevent.stop.left="onResizeStart"
          v-on:touchstart.prevent.stop="onResizeStart"></span>
  </th>
</template>

<script>
import utils from './utils';

export default {
  props: {
    index: Number,
    column: null,
    window: null,
  },
  methods: {
    dblclick(e) {
      this.$emit('columnDblClick', this.column.key, this.index);
    },
    onResizeStart(e) {
      this._cX = utils.ui.getClientX(e);
      this._width = this.column.width;
      this._index = this.index;
      this.window.addEventListener('mousemove', this.onresizeMove, false);
      this.window.addEventListener('mouseup', this.onresizeEnd, false);
      this.window.addEventListener('touchmove', this.onresizeMove, false);
      this.window.addEventListener('touchend', this.onresizeEnd, false);
    },
    onResizeMove(e) {
      this._isResizing = true;
      const cx = utils.ui.getClientX(e);
      const val = this._width + (cx - this._cX);
      if (val < this.column.minWidth) {
        return;
      }
      this._innerWidth = val;
      this.$refs.header.style.width = `${val}px`;
      this.$emit('widthChanging', this._index, val);
    },
    onResizeEnd() {
      this.window.removeEventListener('mousemove', this.onresizeMove);
      this.window.removeEventListener('mouseup', this.onresizeEnd);
      this.window.removeEventListener('touchmove', this.onresizeMove);
      this.window.removeEventListener('touchend', this.onresizeEnd);
      setTimeout(() => delete this._isResizing, 100);
      if (this._innerWidth != null) {
        this.$emit('widthChanged', this._index, this._innerWidth);
        delete this._innerWidth;
      }
    },
  },
};
</script>
