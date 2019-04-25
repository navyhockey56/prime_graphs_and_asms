<template>
  <ul>
    <li v-for="n in Number(length)">
      <Node :active="n === cursor"/>
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
    cursor: Number
  },
  methods: {
  },
  computed: {
  }
})
</script>

<style scoped>
  ul, li{
    display: inline;
    list-style: none;
  }
</style>