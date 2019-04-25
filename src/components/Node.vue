<template>
  <span>{{currentChar()}}</span>
</template>

<script lang="ts">
import Vue from 'vue';
export default Vue.extend({
  props: {
    type: {
      default: 'circle',
      type: String,
    },
    active: Boolean,
  },
  methods: {
    currentChar() {
      if (this.type === 'circle') {
        if (this.active) {
          return this.blackCircleChar;
        } else {
          return this.whiteCircleChar;
        }
      } else {
        if (this.active) {
          return this.blackSquareChar;
        } else {
          return this.whiteSquareChar;
        }
      }
    },
  },
  computed: {
    blackCircleChar() { return '⚫'; },
    whiteCircleChar() { return '⚪'; },
    blackSquareChar() { return '◼️'; },
    whiteSquareChar() { return '◻️'; },
  },
});
</script>
