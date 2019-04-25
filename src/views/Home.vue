<template>
  <div>
    <Controls/>
    <li v-for="cycle in cycles">
      <Cycle :cursor="cycle.cursor" :length="cycle.length" />
    </li>
  </div>

</template>

<script lang="ts">
import Vue from 'vue';
import { mapState } from 'vuex'

import Cycle from '@/components/Cycle.vue';
import Controls from '@/components/Controls.vue';

export default Vue.extend({
  name: 'Home',
  components: {
    Cycle,
    Controls
  },
  methods: {

  },
  computed: {
    cycles(): object[] { return this.$store.state.asm.cycles }
  }
});
</script>

