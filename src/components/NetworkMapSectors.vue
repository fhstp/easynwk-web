<template>
  <g id="sectors">
    <text
      v-if="showSectors[0]"
      x="100"
      y="-100"
      text-anchor="end"
      @click="$emit('zoom-sector', 1, -1)"
    >
      {{ Sectors[0] }}
    </text>
    <text
      v-if="showSectors[1]"
      x="-100"
      y="-100"
      text-anchor="start"
      @click="$emit('zoom-sector', -1, -1)"
    >
      {{ Sectors[1] }}
    </text>
    <text
      v-if="showSectors[2]"
      x="-100"
      y="100"
      text-anchor="start"
      @click="$emit('zoom-sector', -1, 1)"
    >
      {{ Sectors[2] }}
    </text>
    <text
      v-if="showSectors[3]"
      x="87"
      y="100"
      text-anchor="end"
      @click="$emit('zoom-sector', 1, 1)"
    >
      {{ Sectors[3] }}
    </text>
  </g>
</template>

<script lang="ts">
import { defineComponent, computed } from "vue";

import { Sectors } from "@/data/Sectors";

// get Zoom Behavior transform as property
// emit 'zoom-sector' with index of sector

export default defineComponent({
  props: {
    transform: {
      type: Object,
      required: true,
    },
  },
  setup(props) {
    const showSectors = computed((): boolean[] => {
      // project to viewport using zoomBehaviour's transform
      const right = props.transform.applyX(10) < 100;
      const left = props.transform.applyX(-10) > -100;
      const bottom = props.transform.applyY(10) < 100;
      const top = props.transform.applyY(-10) > -100;

      return [right && top, left && top, left && bottom, right && bottom];
    });

    return {
      showSectors,
      Sectors,
    };
  },
});
</script>

<style scoped lang="scss">
@import "~bulma/sass/base/_all.sass";

text {
  font-family: $family-primary;
  font-size: 4px;
  -webkit-user-select: none; /* Safari */
  user-select: none;
}

#sectors text {
  font-weight: bold;
  fill: gray;
  cursor: zoom-in;
}
</style>
