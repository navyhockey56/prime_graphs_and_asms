<template>
  <div>
    <h1 class="title">Welcome to Prime Graphs and ASMs</h1>
    <Controls/>
    <Cycle type="square" :length="5" :activeIndex="3"/>
  </div>
</template>

<script lang="ts">
import Vue from 'vue';
import HelloWorld from '@/components/HelloWorld.vue';
import Cycle from '@/components/Cycle.vue';
import Controls from '@/components/Controls.vue';

export default Vue.extend({
  name: 'home',
  components: {
    HelloWorld,
    Cycle,
    Controls
  },
});
</script>

