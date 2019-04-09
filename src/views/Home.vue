<template>
  <Cycle type="square" :length="5" :activeIndex="3"/>
</template>

<script lang="ts">
import Vue from 'vue';
import HelloWorld from '@/components/HelloWorld.vue';
import Cycle from '@/components/Cycle.vue';

export default Vue.extend({
  name: 'home',
  components: {
    HelloWorld,
    Cycle,
  },
});
</script>

