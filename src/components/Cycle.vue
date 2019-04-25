<template>
  <ul>
    <li v-for="n in Number(length)">
      <Node :type="getType(n)" :active="n === cursor"/>
    </li>
  </ul>
</template>

<script lang="ts">
import Vue from 'vue';
import Node from './Node.vue';


export default Vue.extend({
  components: { Node },
  props: {
    length: Number,
    cursor: Number,
  },
  methods: {
    getType(nodeNum: number) {
      if (nodeNum <= this.activators) {
        return 'square';
      } else {
        return 'circle';
      }
    },
  },
  computed: {
    activators(): number {
      return this.$store.state.asm.activators;
    },
  },
});
</script>

<style scoped>
ul,
li {
  display: inline;
  list-style: none;
}
</style>