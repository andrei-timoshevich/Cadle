<template>
  <div
    class="k-line-chart-container">
    <h3>{{title}}</h3>
    <slot></slot>
  </div>
</template>

<script>
export default {
  name: 'Layout',
  props: {
    title: String
  }
}
</script>
