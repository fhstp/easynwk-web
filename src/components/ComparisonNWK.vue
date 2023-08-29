<template>
  <div style="position: relative">
    <svg width="100%" height="120">
      <!-- Increased height to accommodate text -->
      <line x1="0" y1="50" x2="100%" y2="50" class="comparisonLine"></line>
      <a v-for="(version, index) in versions" :key="index">
        <circle
          :cx="`${1 + (100 / (versions.length + 1)) * (index + 1)}` + '%'"
          cy="50"
          r="9"
          @click="toggleCircle(index)"
          :class="{
            'comparisonCircle-selected': selectedCircles.includes(index),
            comparisonCircle: !selectedCircles.includes(index),
          }"
        />
        <text
          :x="`${1 + (100 / (versions.length + 1)) * (index + 1)}` + '%'"
          y="35"
          text-anchor="middle"
          class="versionText"
        >
          {{
            version.title
              ? version.title
              : version.date.substring(8, 10) +
                "." +
                version.date.substring(5, 7) +
                "." +
                version.date.substring(0, 4)
          }}
        </text>
      </a>
    </svg>
  </div>
  <svg
    id="nwkmap"
    ref="svgElement"
    width="100%"
    height="100%"
    viewBox="-106 -106 212 212"
  >
    <defs>
      <symbol id="square" viewBox="-1.5 -1.5 3 3">
        <path
          id="rectPath"
          d="M 0.886, 0.886 -0.886, 0.886 -0.886, -0.886 0.886, -0.886 Z"
        />
      </symbol>
      <symbol id="circle" viewBox="-1.5 -1.5 3 3">
        <circle id="circlePath" cx="0" cy="0" r="1" />
      </symbol>
      <symbol id="triangle" viewBox="-1.5 -1.5 3 3">
        <path id="trianglePath" d="M -1.347,0.778 1.347,0.778 0,-1.555 Z" />
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
          id="penPath"
          d="M -0.67565,0.93 0.67565,0.93 1.0932,-0.3551706841894581 0,-1.1495 -1.0932,-0.3551706841894581 Z"
        />
      </symbol>
      <symbol id="star" viewBox="-1.5 -1.5 3 3">
        <path
          id="starPath"
          d="M 0.69236155,1.054307 0.00345969,0.69533821 -0.68279921,1.0593342 -0.55428199,0.29322216 -1.1125284,-0.24696789 l 0.76832984,-0.11451451 0.34124363,-0.6978518 0.34633676,0.69533819 0.76914657,0.1088939 -0.55428196,0.54425715 z"
        />
      </symbol>
      <radialGradient id="selected-gradient">
        <stop offset="60%" stop-color="rgb(0, 80, 150)" stop-opacity="0.25" />
        <stop offset="100%" stop-color="rgb(0, 80, 150)" stop-opacity="0" />
      </radialGradient>
      <filter id="dilate-and-xor">
        <!-- h/t https://stackoverflow.com/a/63287731/1140589 -->
        <feMorphology
          in="SourceGraphic"
          result="dilate-result"
          operator="dilate"
          radius="0.35"
        />
        <feComposite
          in="SourceGraphic"
          in2="dilate-result"
          result="xor-result"
          operator="xor"
        />
      </filter>
    </defs>

    <!-- transform coordinate system to be scale independent -->
    <g id="coords" v-if="showHorizons">
      <!-- <rect x="-120" y="-120" width="240" height="240" fill="#bcbddc"/> -->
      <circle id="horizon-base" cx="0" cy="0" r="100" />
      <circle id="horizon-overlay" cx="0" cy="0" r="66.67" />
      <circle id="horizon-overlay" cx="0" cy="0" r="33.33" />
      <line x1="0" y1="-105" x2="0" y2="105" />
      <line x1="105" y1="0" x2="-105" y2="0" />
    </g>
    <g id="coords-min" v-else>
      <line
        vector-effect="non-scaling-stroke"
        x1="0"
        y1="-100"
        x2="0"
        y2="102"
      />
      <line
        vector-effect="non-scaling-stroke"
        x1="102"
        y1="0"
        x2="-102"
        y2="0"
      />
    </g>

    <g id="sectors">
      <text x="100" y="-100" text-anchor="end">{{ Sectors[0] }}</text>
      <text x="-100" y="-100" text-anchor="start">{{ Sectors[1] }}</text>
      <text x="-100" y="100" text-anchor="start">{{ Sectors[2] }}</text>
      <text x="100" y="100" text-anchor="end">{{ Sectors[3] }}</text>
    </g>

    <g id="marksBackgroundLayer">
      <g v-for="mark in alteriMarks" :key="'shadow' + mark.d.id">
        <circle
          v-if="mark.selected"
          :cx="mark.x"
          :cy="mark.y"
          fill="url('#selected-gradient')"
        />
      </g>

      <g v-if="connections">
        <line
          v-for="(mark, index) in connectionMarks"
          id="lineZoom"
          style="stroke-width: 0.5"
          :key="'conn' + index"
          :x1="mark.x1"
          :y1="mark.y1"
          :x2="mark.x2"
          :y2="mark.y2"
          :class="{ select: mark.selected }"
        />
      </g>

      <g v-for="mark in alteriMarks" :key="mark.d.id">
        <line
          v-if="connections && mark.d.edgeType >= 1"
          id="lineZoom"
          style="stroke-width: 0.5"
          :class="{ select: mark.selected }"
          x1="0"
          y1="0"
          :x2="mark.x"
          :y2="mark.y"
          :filter="mark.d.edgeType === 2 ? 'url(#dilate-and-xor)' : undefined"
        />
        <text
          v-if="alteriNames && useTextBG"
          class="textbg"
          vector-effect="non-scaling-stroke"
          :x="mark.x"
          :y="mark.y"
          :text-anchor="mark.x < 0 ? 'end' : 'start'"
          :dx="mark.x < 0 ? -3 : 3"
          :dy="mark.y < 0 ? -1 : 4"
        >
          {{ mark.label }}
          {{ showAge && mark.d.age.length >= 1 ? "/ " + mark.d.age : "" }}
          {{ showRole ? " / " + getRoleShort(mark.d.role) : "" }}
        </text>
        <text
          v-if="alteriNames"
          :x="mark.x"
          :y="mark.y"
          :text-anchor="mark.x < 0 ? 'end' : 'start'"
          :dx="mark.x < 0 ? -3 : 3"
          :dy="mark.y < 0 ? -1 : 4"
        >
          {{ mark.label }}
          {{ showAge && mark.d.age.length >= 1 ? "/ " + mark.d.age : "" }}
          {{ showRole ? " / " + getRoleShort(mark.d.role) : "" }}
        </text>
      </g>
      <use
        id="ego"
        :href="'#' + egoShape"
        x="0"
        y="0"
        class="mark"
        width="4"
        height="4"
        transform="translate(-2,-2)"
      />
    </g>
    <g class="brushParent"></g>
    <g class="marksForegroundLayer">
      <use
        v-for="mark in alteriMarks"
        :key="mark.d.id"
        :href="'#' + mark.shape"
        :x="mark.x"
        :y="mark.y"
        class="mark clickAble"
        width="4"
        height="4"
        transform="translate(-2,-2)"
      />
    </g>
    <text :x="0" y="-102" text-anchor="middle" class="ego">
      {{ egoLabel }}
    </text>
  </svg>
</template>

<script lang="ts">
import { useStore } from "@/store";
import { computed, ref } from "vue";
import { Sectors } from "@/data/Sectors";

import { shapeByGender } from "@/data/Gender";
import { Alter } from "@/data/Alter";
import { getRoleAbbrev } from "@/data/Roles";

interface AlterMark {
  d: Alter;
  label: string;
  shape: string;
  x: number;
  y: number;
  selected: boolean;
}

interface ConnectionMark {
  x1: number;
  y1: number;
  x2: number;
  y2: number;
  selected: boolean;
}

export default {
  components: {},
  name: "ComparisonNWK",

  setup: function () {
    const store = useStore();

    const versions = computed(() => store.state.record.versions);
    const currentVersion = computed(() => store.state.record.currentVersion);

    const selectedCircles = ref<number[]>([]);

    const toggleCircle = (index: number) => {
      if (selectedCircles.value.includes(index)) {
        selectedCircles.value = selectedCircles.value.filter(
          (i) => i !== index
        );
      } else {
        selectedCircles.value.push(index);
      }
    };

    const getRoleShort = (role: string) => {
      return getRoleAbbrev(role);
    };

    const alteriCoords = computed((): Map<number, { x: number; y: number }> => {
      const buffer = new Map();

      store.state.nwk.alteri.forEach((alter) => {
        const x = alter.distance * Math.cos((alter.angle * Math.PI) / 180);
        const y = -1 * alter.distance * Math.sin((alter.angle * Math.PI) / 180);

        buffer.set(alter.id, { x, y });
      });

      return buffer;
    });

    const alteriMarks = computed((): Array<AlterMark> => {
      // console.log("in computed alteri marks");
      const buffer: Array<AlterMark> = [];
      store.state.nwk.alteri.forEach((el) => {
        // console.log("alter: " + el.name);
        const coords = alteriCoords.value.get(el.id);

        buffer.push({
          d: el,
          label: store.getters["displayName"](el),
          shape: shapeByGender(el.human, el.currentGender),
          x: coords ? coords.x : 0,
          y: coords ? coords.y : 0,
          selected: store.getters["view/isSelected"](el.id),
        });
      });
      // first draw marks further away from center to avoid overplotting
      return buffer.sort((a, b) => b.d.distance - a.d.distance);
    });

    const connectionMarks = computed((): Array<ConnectionMark> => {
      return store.state.nwk.connections.map((conn) => {
        const coords1 = alteriCoords.value.get(conn.id1);
        const coords2 = alteriCoords.value.get(conn.id2);

        const selected =
          store.getters["view/isSelected"](conn.id1) ||
          store.getters["view/isSelected"](conn.id2);

        return {
          x1: coords1 ? coords1.x : 0,
          y1: coords1 ? coords1.y : 0,
          x2: coords2 ? coords2.x : 0,
          y2: coords2 ? coords2.y : 0,
          selected,
        };
      });
    });

    return {
      egoLabel: computed(
        () =>
          store.state.nwk.ego.name +
          (store.state.nwk.ego.age.length > 0
            ? " (" + store.state.nwk.ego.age + "a)"
            : "")
      ),
      egoShape: computed(() =>
        shapeByGender(true, store.state.nwk.ego.currentGender)
      ),
      versions,
      Sectors,
      currentVersion,
      selectedCircles,
      toggleCircle,
      getRoleShort,
      alteriCoords,
      alteriMarks,
      connectionMarks,
      connections: computed(() => store.state.view.connections),
      alteriNames: computed(() => store.state.view.alteriNames),
      showAge: computed(() => store.state.view.ageInNwk),
      showRole: computed(() => store.state.view.roleInNwk),
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

.comparisonLine {
  stroke: black !important;
}
.comparisonCircle {
  fill: #ffc37d;
}
svg {
  overflow: visible;
}

text {
  font-family: $family-primary;
  font-size: 4px;
  -webkit-user-select: none; /* Safari */
  user-select: none;
}

.versionText {
  font-size: 12px !important;
}

text.ego {
  font-style: italic;
}

.textbg {
  stroke: white;
  stroke-width: 3;
}

line {
  stroke: #afafaf;
  stroke-width: 0.5;
}

line.select {
  // stroke: rgb(136, 159, 213);
  // stroke: rgb($fhstpblue, 0.6);
  stroke: rgb(102, 150, 192);
}

#position {
  fill: white;
  fill-opacity: 0.01;
  cursor: crosshair;
}

#ego {
  fill: $color-primary-0;
}

.mark {
  fill: rgb(54, 54, 54);
  stroke: white;
  stroke-width: 0.2;
}

.comparisonCircle {
  fill: #d6dae9;
}

.comparisonCircle-selected {
  fill: #ffc37d;
}
</style>
