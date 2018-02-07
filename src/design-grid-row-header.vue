<template>
  <td v-bind:style="style" ref="header"
      v-on:mousedown.left="onMouseDown"
      v-on:dblclick.left="onDblClick">
    <div v-bind:style="divStyle">{{ index + 1 }}</div><!--
 --><span class="d-row-header-split"
          v-show="enabled"
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
    defaultHeight: Number,
    enabled: Boolean,
  },
  computed: {
    style() {
      return {
        height: `${this.getHeight()}px`,
      };
    },
    divStyle() {
      return {
        lineHeight: `${this.getHeight()}px`,
      };
    },
  },
  methods: {
    getHeight() {
      const height = Number(this.item.__height);
      if (isNaN(height)) {
        return this.defaultHeight;
      }
      return height;
    },
    onMouseDown(e) {
      if (!this.enabled) {
        return;
      }
      this.$emit('rowHeaderMouseDown', this.index);
    },
    onDblClick() {
      if (!this.enabled) {
        return;
      }
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
      let val = this._height + (cy - this._cY);
      // TODO: don't need to resize the row height below zero
      // because of the row-header resizer
      if (val < 1) {
        val = 1;
      }
      if (this._innerHeight === val) {
        return;
      }
      this._innerHeight = val;
      const h = `${val}px`;
      this.$refs.header.style.height = h;
      this.$refs.header.children[0].style.lineHeight = h;
      this.$emit('heightChanging', this._index, val);
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
