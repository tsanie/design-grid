<template>
  <td v-bind:style="style" ref="header"
      v-on:dblclick.left="onDblClick">{{ index + 1 }}<!--
 --><span class="d-row-header-split"
          v-on:mousedown.prevent.stop.left="onResizeStart"
          v-on:touchstart.prevent.stop="onResizeStart"></span>
  </td>
</template>

<script>
import utils from './utils';

export default {
  props: {
    item: null,
    index: Number,
    window: null,
  },
  computed: {
    style() {
      return {
        height: `${this.getHeight()}px`,
      };
    },
  },
  methods: {
    getHeight() {
      const height = Number(this.item.__height);
      if (isNaN(height)) {
        return 26;
      }
      return height;
    },
    onDblClick() {
      this.$emit('rowHeaderDblClick', this.index);
    },
    onResizeStart(e) {
      this._cY = utils.ui.getClientY(e);
      this._height = this.getHeight();
      this._index = this.index;
      this.window.addEventListener('mousemove', this.onResizeMove, false);
      this.window.addEventListener('mouseup', this.onResizeEnd, false);
      this.window.addEventListener('touchmove', this.onResizeMove, false);
      this.window.addEventListener('touchend', this.onResizeEnd, false);
    },
    onResizeMove(e) {
      this._isResizing = true;
      const cy = utils.ui.getClientY(e);
      const val = this._height + (cy - this._cY);
      this._innerHeight = val;
      this.$refs.header.style.height = `${val}px`;
      // this.$emit('heightChanging', this._index, val);
    },
    onResizeEnd() {
      this.window.removeEventListener('mousemove', this.onResizeMove);
      this.window.removeEventListener('mouseup', this.onResizeEnd);
      this.window.removeEventListener('touchmove', this.onResizeMove);
      this.window.removeEventListener('touchend', this.onResizeEnd);
      setTimeout(() => delete this._isResizing, 100);
      if (this._innerHeight != null) {
        utils.set(this.item, '__height', this._innerHeight);
        this.$emit('heightChanged', this._index, this._innerHeight);
        delete this._innerHeight;
      }
    },
  },
};
</script>
