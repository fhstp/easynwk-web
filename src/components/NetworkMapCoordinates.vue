<template>
  <g id="coords" v-if="showHorizons">
    <!-- <rect x="-120" y="-120" width="240" height="240" fill="#bcbddc"/> -->
    <circle
      id="horizon-base"
      :cx="egoCoords[0]"
      :cy="egoCoords[1]"
      :r="horiRadii.r3"
    />
    <circle
      id="horizon-overlay"
      :cx="egoCoords[0]"
      :cy="egoCoords[1]"
      :r="horiRadii.r2"
    />
    <circle
      id="horizon-overlay"
      :cx="egoCoords[0]"
      :cy="egoCoords[1]"
      :r="horiRadii.r1"
    />
    <line
      :x1="egoCoords[0]"
      :y1="egoCoords[1] - horiRadii.r3"
      :x2="egoCoords[0]"
      :y2="egoCoords[1] + horiRadii.r3"
    />
    <line
      :x1="egoCoords[0] - horiRadii.r3"
      :y1="egoCoords[1]"
      :x2="egoCoords[0] + horiRadii.r3"
      :y2="egoCoords[1]"
    />
  </g>
  <g id="coords-min" v-else>
    <circle :cx="egoCoords[0]" :cy="egoCoords[1]" :r="horiRadii.r3" />
    <line
      :x1="egoCoords[0]"
      :y1="egoCoords[1] - horiRadii.r3"
      :x2="egoCoords[0]"
      :y2="egoCoords[1] + horiRadii.r3"
    />
    <line
      :x1="egoCoords[0] - horiRadii.r3"
      :y1="egoCoords[1]"
      :x2="egoCoords[0] + horiRadii.r3"
      :y2="egoCoords[1]"
    />
  </g>

  <g id="sectors">
    <text v-if="showSectors[0]" x="100" y="-100" text-anchor="end">
      {{ Sectors[0] }}
    </text>
    <text v-if="showSectors[1]" x="-100" y="-100" text-anchor="start">
      {{ Sectors[1] }}
    </text>
    <text v-if="showSectors[2]" x="-100" y="100" text-anchor="start">
      {{ Sectors[2] }}
    </text>
    <text v-if="showSectors[3]" x="100" y="100" text-anchor="end">
      {{ Sectors[3] }}
    </text>
  </g>
</template>

<script lang="ts">
import { defineComponent, computed } from "vue";
import { useStore } from "@/store";

import { Sectors } from "@/data/Sectors";

// get Zoom Behavior transform as property
// emit <nothing>

export default defineComponent({
  props: {
    transform: {
      type: Object,
      required: true,
    },
  },
  setup(props) {
    const store = useStore();

    const egoCoords = computed(() => props.transform.apply([0, 0]));

    const horiRadii = computed((): { r1: number; r2: number; r3: number } => {
      // project to viewport using center and scaleF
      console.log("k: " + props.transform.k);
      return {
        r1: 33.33 * props.transform.k,
        r2: 66.67 * props.transform.k,
        r3: 100 * props.transform.k,
      };
    });
    const showSectors = computed((): boolean[] => {
      // project to viewport using zoomBehaviour's transform
      const right = props.transform.applyX(10) < 100;
      const left = props.transform.applyX(-10) > -100;
      const bottom = props.transform.applyY(10) < 100;
      const top = props.transform.applyY(-10) > -100;

      return [right && top, left && top, left && bottom, right && bottom];
    });

    return {
      // egoLabel: computed(
      //   () =>
      //     store.state.nwk.ego.name +
      //     (store.state.nwk.ego.age.length > 0
      //       ? " (" + store.state.nwk.ego.age + "a)"
      //       : "")
      // ),
      // egoShape: computed(() =>
      //   shapeByGender(true, store.state.nwk.ego.currentGender)
      // ),
      egoCoords,
      horiRadii,
      showSectors,
      showHorizons: computed(() => store.state.view.horizons),
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

circle#horizon-base {
  // fill: #dadaeb;
  fill: #c7e9c0;
}

circle#horizon-overlay {
  fill: rgb(255, 255, 255, 0.5);
}

#coords line {
  stroke: white;
  stroke-width: 2;
}

#coords-min line {
  vector-effect: non-scaling-stroke;
  stroke: lightgray;
  stroke-width: 1;
}

#coords-min circle {
  vector-effect: non-scaling-stroke;
  stroke: #f0f0f0;
  stroke-width: 2;
  fill: none;
}

#sectors text {
  font-weight: bold;
  fill: gray;
}
</style>
