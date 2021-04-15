<template>
  <svg id="nwkmap" width="100%" height="100%" viewBox="-105 -105 210 210">
    <defs>
      <symbol id="square" viewBox="-1.5 -1.5 3 3">
        <rect x="-0.886" y="-0.886" width="1.772" height="1.772" />
      </symbol>
      <symbol id="circle" viewBox="-1.5 -1.5 3 3">
        <circle cx="0" cy="0" r="1" />
      </symbol>
      <symbol id="triangle" viewBox="-1.5 -1.5 3 3">
        <path d="M -1.347,0.778 1.347,0.778 0,-1.555 Z" />
      </symbol>
      <!--
    const R = 1.1495;
    const r = 0.93;
    const a = 1.3513;
    const d= 2.1864;
    const y = Math.sqrt(a*a - Math.pow((d-a)/2, 2)) - r;
    console.log(`M ${a/-2},${r} ${a/2},${r} ${d/2},${-1*y} ${0},${-1*R} ${d/-2},${-1*y} Z`);
-->
      <symbol id="pentagram" viewBox="-1.5 -1.5 3 3">
        <path
          d="M -0.67565,0.93 0.67565,0.93 1.0932,-0.3551706841894581 0,-1.1495 -1.0932,-0.3551706841894581 Z"
        />
      </symbol>
      <symbol id="star" viewBox="-1.5 -1.5 3 3">
        <path
          d="M 0.69236155,1.054307 0.00345969,0.69533821 -0.68279921,1.0593342 -0.55428199,0.29322216 -1.1125284,-0.24696789 l 0.76832984,-0.11451451 0.34124363,-0.6978518 0.34633676,0.69533819 0.76914657,0.1088939 -0.55428196,0.54425715 z"
        />
      </symbol>
      <radialGradient id="horizon-gradient">
        <stop offset="85%" stop-color="rgb(211, 211, 211)" stop-opacity="0" />
        <stop offset="100%" stop-color="rgb(211, 211, 211)" stop-opacity="1" />
      </radialGradient>
      <radialGradient id="selected-gradient">
        <stop offset="60%" stop-color="rgb(18, 64, 171)" stop-opacity="0.25" />
        <stop offset="100%" stop-color="rgb(18, 64, 171)" stop-opacity="0" />
      </radialGradient>
    </defs>
    <!-- transform coordinate system to be scale independent -->
    <g id="coords">
      <circle cx="0" cy="0" r="100" fill="url('#horizon-gradient')" />
      <circle cx="0" cy="0" r="66.67" fill="url('#horizon-gradient')" />
      <circle cx="0" cy="0" r="33.33" fill="url('#horizon-gradient')" />
      <line class="axis" x1="0" y1="-100" x2="0" y2="100" />
      <line class="axis" x1="100" y1="0" x2="-100" y2="0" />

      <text x="100" y="-100" text-anchor="end">
        Familie
      </text>
      <text x="-100" y="-100" text-anchor="start">
        Freund*innen/Bekannte
      </text>
      <text x="-100" y="100" text-anchor="start">
        Kolleg*innen
      </text>
      <text x="100" y="100" text-anchor="end">
        prof. Helfer*innen
      </text>
    </g>

    <text v-if="editedAlter != null" text-anchor="middle" class="edithint">
      <tspan x="0" y="-1em">Klicke in die Karte, um</tspan>
      <tspan x="0" dy="2em">die Position festzulegen</tspan>
    </text>

    <g id="marks">
      <circle
        v-for="mark in selectedAlteriMarks"
        :key="'shadow' + mark.d.id"
        :cx="mark.x"
        :cy="mark.y"
        r="4"
        fill="url('#selected-gradient')"
      />

      <g v-for="mark in alteriMarks" :key="mark.d.id">
        <line x1="0" y1="0" :x2="mark.x" :y2="mark.y" />
        <use
          :href="'#' + mark.shape"
          :x="mark.x"
          :y="mark.y"
          class="mark"
          width="4"
          height="4"
          transform="translate(-2,-2)"
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
    </g>

    <!-- a foreground rect is necessary so that the whole display is clickable -->
    <!-- a foreground rect is useful to prevent text selection -->
    <rect id="position" x="-110" y="-110" width="220" height="220" />
  </svg>
</template>

<script lang="ts">
import { Component, Prop, Vue } from "vue-property-decorator";

import * as d3 from "d3";
import { ContainerElement } from "d3";
import { Alter } from "@/data/Alter";
import { AlteriList } from "@/data/AlteriList";
import { shapeByGender } from "@/data/Gender";

interface AlteriMark {
  d: Alter;
  shape: string;
  x: number;
  y: number;
}

@Component
export default class NetworkMap extends Vue {
  @Prop(AlteriList) private alteri!: AlteriList;
  @Prop(Object) private editedAlter!: Alter | null;

  constructor() {
    super();
  }

  // x(distance: number, angle: number): number {
  //     return distance * Math.cos(angle * Math.PI/180)
  // }

  mounted() {
    // d3.mouse only works if the event is registered using D3 .on
    const g = d3.select("#nwkmap");
    g.on("click", () => {
      const coords = d3.mouse(g.node() as ContainerElement);

      // cp. https://stackoverflow.com/a/33043899/1140589
      const distance = Math.sqrt(coords[0] * coords[0] + coords[1] * coords[1]);
      const angle = Math.atan2(-1 * coords[1], coords[0]) * (180 / Math.PI);

      if (this.editedAlter != null) {
        this.editedAlter.distance = distance;
        this.editedAlter.angle = angle;
      }

      this.$emit("map-click", { distance, angle });
    });
  }

  get alteriMarks(): Array<AlteriMark> {
    // console.log("in computed alteri marks");
    const buffer: Array<AlteriMark> = [];
    this.alteri.getAlteri().forEach(el => {
      // console.log("alter: " + el.name);
      buffer.push({
        d: el,
        shape: shapeByGender(el.currentGender),
        x: el.distance * Math.cos((el.angle * Math.PI) / 180),
        y: -1 * el.distance * Math.sin((el.angle * Math.PI) / 180)
      });
    });
    // first draw marks further away from center to avoid overplotting
    return buffer.sort((a, b) => b.d.distance - a.d.distance);
  }

  get selectedAlteriMarks(): Array<AlteriMark> {
    return this.alteriMarks.filter(m => m.d.isSelected);
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
  stroke: white;
  stroke-width: 3;
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

.mark {
  fill: rgb(54, 54, 54);
}

#coords text {
  font-weight: bold;
  fill: gray;
}

.edithint {
  fill: rgba(lightgray, 0.5);
  font-size: 1em;
  font-weight: bold;
}
</style>
