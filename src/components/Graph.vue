<template>
  <ul>
    <li v-for="n in Number(length)">
      <Cycle />
    </li>
  </ul>
</template>

<script lang="ts">
import Vue from 'vue'
import Cycle from './Cycle.vue'

export default Vue.extend({
  components: { Cycle },
  methods: {
  },
  computed: {
  }
})
</script>
