<template>
  <g id="sectors">
    <g @click="$emit('zoom-sector', 1, -1)" v-if="showSectors[0]">
      <rect x="80" width="21" y="-106" height="11" />
      <text x="100" y="-100" text-anchor="end">
        {{ langIsGerman() ? Sectors[0] : SectorsEng[0] }}
      </text>
    </g>
    <g @click="$emit('zoom-sector', -1, -1)" v-if="showSectors[1]">
      <rect x="-101" width="50" y="-106" height="11" />
      <text x="-100" y="-100" text-anchor="start">
        {{ langIsGerman() ? Sectors[1] : SectorsEng[1] }}
      </text>
    </g>
    <g @click="$emit('zoom-sector', -1, 1)" v-if="showSectors[2]">
      <rect x="-101" width="30" y="95" height="11" />
      <text x="-100" y="101" text-anchor="start">
        {{ langIsGerman() ? Sectors[2] : SectorsEng[2] }}
      </text>
    </g>
    <g @click="$emit('zoom-sector', 1, 1)" v-if="showSectors[3]">
      <rect x="50" width="40" y="95" height="11" />
      <text x="87" y="101" text-anchor="end">
        {{ langIsGerman() ? Sectors[3] : SectorsEng[3] }}
      </text>
    </g>
  </g>
</template>

<script lang="ts">
import { defineComponent, computed } from "vue";

import { Sectors, SectorsEng } from "@/data/Sectors";
import de from "@/de";
import en from "@/en";

// get Zoom Behavior transform as property
// emit 'zoom-sector' with index of sector

export default defineComponent({
  mixins: [de, en],
  methods: {
    t(prop: string) {
      console.log(document.documentElement.lang);
      return this[document.documentElement.lang][prop];
    },
    langIsGerman() {
      if (document.documentElement.lang == "de") return true;
      else return false;
    },
  },
  data() {
    return {
      lang: "de",
    };
  },
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
      SectorsEng,
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

rect {
  fill: white;
  fill-opacity: 0.25;
  cursor: zoom-in;
}
</style>
