<template>
  <div class="field is-grouped">
    <p class="control">
      <label class="label">Activators</label>
      <input
        v-model="activators"
        @input="updateActivators"
        class="input is-rounded is-small"
        type="text"
      >
    </p>
    <p class="control">
      <label class="label">Non-Activators</label>
      <input
        v-model="nonActivators"
        @input="updateNonActivators"
        class="input is-rounded is-small"
        type="text"
      >
    </p>
    <p class="control">
      <button class="button" @click="nextState">Next</button>
    </p>
  </div>
</template>

<script lang="ts">
import Vue from 'vue';
import { mapActions, mapState } from 'vuex';

export default Vue.extend({
  data() {
    return {
      activators: 1,
      nonActivators: 1,
    };
  },
  methods: {
    nextState() {
      this.$store.dispatch('nextState');
    },
    updateActivators(e: Event) {
      const target = e.target as HTMLInputElement;
      this.$store.dispatch('setActivators', e.target && target.value);
    },
    updateNonActivators(e: Event) {
      const target = e.target as HTMLInputElement;
      this.$store.dispatch('setNonActivators', target && target.value);
    },
  },
});
</script>

