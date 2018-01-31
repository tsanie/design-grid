<template>
  <th ref="header" class="d-column-header">
    <div class="d-column-header-text">
      <span><slot></slot></span>
    </div><!--
 --><span class="d-column-header-split"></span>
  </th>
</template>

<script>
export default {
  props: {
    index: Number,
    column: null,
    window: null,
  },
};
</script>
