<template>
  <ul>
    <li v-for="cycle in cycles">
      <Cycle :cursor="cycle.cursor" :length="cycle.length" />
    </li>
  </ul>
</template>

<script lang="ts">
import Vue from 'vue'
import { mapState } from 'vuex'

import Cycle from './Cycle.vue'

export default Vue.extend({
  components: { Cycle },
  methods: {
  },
  computed: mapState(['asm.graph.cycles'])
})
</script>
