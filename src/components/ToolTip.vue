<template>
  <svg id="tooltip" width="100%" height="100%" viewBox="-105 -105 210 210">
    <g v-for="mark in alter" :key="mark.d.id">
      <rect
        style="fill: white"
        class="toolhover"
        :markid="mark.d.id"
        :x="mark.x < 0 ? mark.x - 20.5 : mark.x + 2.5"
        :y="mark.y < 0 ? mark.y - 34.5 : mark.y - 30.5"
        :rx="2.5"
        :ry="2.5"
        :rect-anchor="mark.x < 0 ? 'end' : 'start'"
        :dx="mark.x < 0 ? -3 : 3"
        :dy="mark.y < 0 ? -15 : -11"
        :width="
          mark.d.role.length < mark.d.name.length
            ? mark.d.name.length * 2.6
            : mark.d.role.length * 2.6
        "
        :height="30"
      ></rect>
      <text
        id="div_template"
        v-if="alter && useTextBG"
        vector-effect="non-scaling-stroke"
        :x="mark.x"
        :y="mark.y"
        :text-anchor="mark.x < 0 ? 'end' : 'start'"
        :dx="mark.x < 0 ? -3 : 3"
        :dy="mark.y < 0 ? -1 : 4"
      >
        <tspan
          class="toolhover"
          :markid="mark.d.id"
          :x="mark.x"
          :y="mark.y"
          :dx="mark.x < 0 ? -4 : 4"
          :dy="mark.y < 0 ? -15 : -10"
        >
          {{ mark.d.name }}
        </tspan>
        <tspan
          class="toolhover"
          :markid="mark.d.id"
          :x="mark.x"
          :y="mark.y"
          :dx="mark.x < 0 ? -4 : 4"
          :dy="mark.y < 0 ? -10 : -5"
        >
          {{ mark.d.role }}
        </tspan>

        <tspan
          class="toolhover"
          :markid="mark.d.id"
          :x="mark.x"
          :y="mark.y"
          :dx="mark.x < 0 ? -4 : 4"
          :dy="mark.y < 0 ? -5 : 0"
        >
          {{ mark.d.age }}
        </tspan>
      </text>
    </g>
  </svg>
</template>

<script>
import { alteriNames } from "@/components/NetworkMap.vue";
import { computed, onMounted } from "vue";
import * as d3 from "d3";

d3.selectAll("tooltip").on("mouseover", function () {
  d3.select(this).raise();
});

export default {
  setup: function () {
    const alter = alteriNames;

    onMounted(() => {
      console.log(alteriNames);
    });
    return {
      alter,
      useTextBG: computed(
        () =>
          !(
            /Safari/.test(navigator.userAgent) &&
            /Apple Computer/.test(navigator.vendor)
          )
      ),
    };
  },
};
</script>

<style scoped lang="scss">
@import "~bulma/sass/base/_all.sass";

text {
  font-family: $family-primary;
  font-size: 4px;
}

.toolhover {
  display: none;
}

.rect {
  fill: #0c2c78;
}

.toolhover-active {
  display: block;
}

.tooltip {
  overflow-wrap: break-word;
  white-space: pre-line;
  hyphens: none;
  width: 10px;
  display: flex;
  background-color: red;
}

.textbg {
  stroke: white;
  stroke-width: 3;
}
</style>
