<template>
  <div>
    <div v-bind:style="customStyle">
      <input type="text" v-bind="attributes" v-on="column.events"
            v-bind:readOnly.prop="!innerEnabled"
            v-bind:class="!innerEnabled && 'readonly-input'"
            v-bind:style="contentStyle"
            v-bind:value="value"
            v-on:input="onUpdateValue($event.target.value)"
            v-on:change="onChangeValue($event.target.value)" />
    </div>
  </div>
</template>

<script>
import utils from './utils';

export default {
  props: {
    item: null,
    column: null,
    index: Number,
    enabled: Boolean,
  },
  computed: {
    value() {
      return this.item && this.item[this.column.key];
    },
    innerEnabled() {
      if (!this.enabled) {
        return false;
      }
      const enabledKey = this.column.enabled;
      switch (typeof enabledKey) {
        case 'boolean': return enabledKey;
        case 'string': return this.item[enabledKey];
        case 'function': return enabledKey.call(this, this.item);
        default: return true;
      }
    },
    customStyle() {
      return utils.style.call(this, null, this.item, this.column, this.index);
    },
    contentStyle() {
      const style = utils.style.call(this, 'contentStyle',
        this.item,
        this.column,
        this.index);
      if (style != null && this.column.align !== 'left') {
        style.textAlign = this.column.align;
      }
      return style;
    },
    attributes() {
      if (this.item == null) {
        return null;
      }
      let attrs = this.column.attrs;
      if (typeof attrs === 'function') {
        attrs = attrs.call(this, this.item);
      }
      return attrs;
    },
  },
  methods: {
    onUpdateValue(value) {
      const old = this.item[this.column.key];
      if (old === value) {
        return;
      }
      this.$set(this.item, this.column.key, value);
      if (typeof this.column.onchanged === 'function') {
        this.column.onchanged.call(this, this.item, old);
      }
    },
    onChangeValue(value) {
      this.onUpdateValue(value);
      this.$emit('valueChanged', this.item, this.column.key, value);
    },
  },
};
</script>

