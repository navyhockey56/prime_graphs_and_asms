<template>
  <div class="field is-grouped">
    <p class="control">
      <label class="label">Activators</label>
      <input v-model="activators" @input="updateActivators" class="input is-rounded is-small" type="text">
    </p>
    <p class="control">
      <label class="label">Non-Activators</label>
      <input v-model="nonActivators" @input="updateNonActivators" class="input is-rounded is-small" type="text" value="1">
    </p>
    <p class="control">
      <button class="button">Next</button>
    </p>
  </div>
</template>

<script lang="ts">
import Vue from 'vue'
import { mapActions, mapState } from 'vuex'

export default Vue.extend({
  data() {
    return {
      activators: this.$store.state.activators,
      nonActivators: this.$store.state.nonActivators
    }
  },
  methods: {
    ...mapActions([
      'setActivators',
      'setNonActivators'
    ]),
    updateActivators(e: Event) {
      console.log('test')
      this.setActivators(e.target && e.target.value)
    },
    updateNonActivators(e: Event) {
      this.setNonActivators(e.target && e.target.value)
    }
  },
})
</script>

