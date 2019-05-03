<template>
  <div>
    <canvas ref="canvas" width="800" height="1000"/>
  </div>
</template>

<script lang="ts">
import Vue from 'vue';

import { Rect } from '../lib/shapes'

export default Vue.extend({
  name: 'CanvasAsm',
  props: ['index'],
  mounted() {
    const rects = []

    for(let i = 1; i <= 10; i++) {
      rects.push(new Rect([50, i * 50], 40, 40))
      rects.push(new Rect([150, i * 50], 40, 40))
    }

    rects.forEach((r) => {
      r.fill(this.ctx)
      r.render(this.ctx)
    })

  },
  computed: {
    canvas(): HTMLCanvasElement {
      return this.$refs.canvas as HTMLCanvasElement
    },
    ctx(): CanvasRenderingContext2D {
      return this.canvas.getContext('2d') as CanvasRenderingContext2D
    }
  },
});
</script>

