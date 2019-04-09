<template>
  <ul>
    <li v-for="n in Number(length)">
      <Node :active="n === activeIndex"/>
    </li>
  </ul>
</template>

<script lang="ts">
import Vue from 'vue'
import Node from './Node.vue'

export default Vue.extend({
  components: { Node },
  props: {
    length: Number,
    activeIndex: Number
  },
  methods: {
  },
  computed: {
  }
})
</script>

<style scoped>
  li {
    display: inline;
    list-style: none;
  }
</style>