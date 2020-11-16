<template>
  <svg id="nwkmap" width="100%" height="100%" viewBox="-105 -105 210 210">
    <!-- transform coordinate system to be scale independent -->
    <g id="coords">
      <line class="axis" x1="0" y1="-100" x2="0" y2="100" />
      <line class="axis" x1="100" y1="0" x2="-100" y2="0" />
      <circle class="horizon" cx="0" cy="0" r="100" />
      <circle class="horizon" cx="0" cy="0" r="66.67" />
      <circle class="horizon" cx="0" cy="0" r="33.33" />

      <g v-for="mark in alteriMarks" :key="mark.d.id">
        <line x1="0" y1="0" :x2="mark.x" :y2="mark.y" />
        <circle
          :r="1.5"
          :cx="mark.x"
          :cy="mark.y"
          :class="{ selected: mark.d.isSelected }"
        />
        <text
          :x="mark.x"
          :y="mark.y"
          :text-anchor="mark.x < 0 ? 'end' : 'start'"
          :dx="mark.x < 0 ? -3 : 3"
          :dy="mark.y < 0 ? -1 : 4"
        >
          {{ mark.d.name }}
        </text>
      </g>
      <circle id="ego" cx="0" cy="0" r="1.5" />

      <!-- a background rect is necessary so that the whole display is clickable -->
      <rect id="position" x="-110" y="-110" width="220" height="220" />
    </g>
  </svg>
</template>

<script lang="ts">
import { Component, Prop, Vue } from "vue-property-decorator";

import * as d3 from "d3";
import { ContainerElement } from "d3";
import { Alter } from "@/data/Alter";
import { AlteriList } from "@/data/AlteriList";

interface AlteriMark {
  d: Alter;
  x: number;
  y: number;
}

@Component
export default class NetworkMap extends Vue {
  // @Prop(Array) private alteri!: Array<Alter>;
  @Prop(AlteriList) private alteri!: AlteriList;

  constructor() {
    super();
  }

  // x(distance: number, angle: number): number {
  //     return distance * Math.cos(angle * Math.PI/180)
  // }

  mounted() {
    // d3.mouse only works if the event is registered using D3 .on
    const g = d3.select("g#coords");
    g.on("click", () => {
      const coords = d3.mouse(g.node() as ContainerElement);
      console.log(coords);

      // cp. https://stackoverflow.com/a/33043899/1140589
      const distance = Math.sqrt(coords[0] * coords[0] + coords[1] * coords[1]);
      const angle = Math.atan2(-1 * coords[1], coords[0]) * (180 / Math.PI);

      this.$emit("map-click", { distance, angle });
    });
  }

  get alteriMarks(): Array<AlteriMark> {
    console.log("in computed alteri marks");
    const buffer: Array<AlteriMark> = [];
    this.alteri.getAlteri().forEach(el => {
      console.log("alter: " + el.name);
      buffer.push({
        d: el,
        x: el.distance * Math.cos((el.angle * Math.PI) / 180),
        y: -1 * el.distance * Math.sin((el.angle * Math.PI) / 180)
      });
    });
    // first draw marks further away from center to avoid overplotting
    return buffer.sort((a, b) => b.d.distance - a.d.distance);
  }
}
</script>

<style scoped lang="scss">
text {
  font-size: 5px;
}
circle.horizon {
  fill: none;
  stroke: lightgray;
  stroke-width: 1;
}
line.axis {
  stroke: lightgray;
  stroke-width: 1;
}
line {
  stroke: lightgray;
  stroke-width: 0.5;
}

#position {
  fill: white;
  fill-opacity: 0.01;
}

#ego {
  fill: $color-primary-0;
}

.selected {
  fill: $color-secondary-1-0;
}
</style>
