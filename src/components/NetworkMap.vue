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
        y1="-102"
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

    <text v-if="isEditMode" text-anchor="middle" class="edithint">
      <tspan x="0" y="-1em">Klicke in die Karte, um</tspan>
      <tspan x="0" dy="2em">die Position festzulegen</tspan>
    </text>

    <g id="marks">
      <g v-for="mark in alteriMarks" :key="'shadow' + mark.d.id">
        <circle
          v-if="mark.selected"
          :cx="mark.x"
          :cy="mark.y"
          r="4"
          fill="url('#selected-gradient')"
        />
      </g>

      <g v-if="connections">
        <line
          v-for="(mark, index) in connectionMarks"
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
          :class="{ select: mark.selected }"
          x1="0"
          y1="0"
          :x2="mark.x"
          :y2="mark.y"
          :filter="mark.d.edgeType == 2 ? 'url(#dilate-and-xor)' : null"
        />
        <use
          :href="'#' + mark.shape"
          :x="mark.x"
          :y="mark.y"
          class="mark clickAble"
          width="4"
          height="4"
          transform="translate(-2,-2)"
          @click="clickAlter(mark.d)"
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
          {{
            markDetails ? (mark.d.age.length >= 1 ? "/ " + mark.d.age : "") : ""
          }}
          {{ markRoleDetails ? " / " + getRoleShort(mark.d.role) : "" }}
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
          {{
            markDetails ? (mark.d.age.length >= 1 ? "/ " + mark.d.age : "") : ""
          }}
          {{ markRoleDetails ? " / " + getRoleShort(mark.d.role) : "" }}
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

    <!-- a foreground rect is necessary so that the whole display is clickable -->
    <!-- a foreground rect is useful to prevent text selection -->
    <rect
      v-if="isEditMode"
      id="position"
      x="-110"
      y="-110"
      width="220"
      height="220"
    />
  </svg>
</template>

<script lang="ts">
import { defineComponent, computed, onMounted } from "vue";
import { useStore } from "@/store";

import * as d3 from "d3";
// import { ContainerElement } from "d3";
import { Alter, isConnectable } from "@/data/Alter";
import { Sectors } from "@/data/Sectors";
import { shapeByGender } from "@/data/Gender";
import { TAB_BASE, TAB_CONNECTIONS } from "@/store/viewOptionsModule";
import { SYMBOL_DECEASED } from "@/assets/utils";
import { getRoleAbbrev } from "../data/Roles";

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

// knows list of Alter from vuex
// knows editedAlter
// emit "map-click" (which is not currently used)

export default defineComponent({
  setup(props, { emit }) {
    const store = useStore();

    const isEditMode = computed(() => {
      return (
        store.state.view.editIndex != null &&
        store.state.view.editTab === TAB_BASE
      );
    });

    const isConnectMode = computed(
      () => store.state.view.editTab === TAB_CONNECTIONS
    );

    onMounted(() => {
      // d3.mouse only works if the event is registered using D3 .on
      const g = d3.select("#nwkmap");
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      g.on("click", (event: any) => {
        const coords = d3.pointer(event);

        // cp. https://stackoverflow.com/a/33043899/1140589
        const distance = Math.sqrt(
          coords[0] * coords[0] + coords[1] * coords[1]
        );
        const angle = Math.atan2(-1 * coords[1], coords[0]) * (180 / Math.PI);

        if (isEditMode.value) {
          const payload = {
            index: store.state.view.editIndex,
            changes: { distance: distance, angle: angle },
          };
          store.commit("editAlter", payload);
          // } else {
          //   store.commit("view/clearSelectedAlters");
        }

        emit("map-click", { distance, angle });
      });
    });

    const markDetails = computed(() => store.state.view.details);

    const getRoleShort = (role: string) => {
      return getRoleAbbrev(role);
    };
    const markRoleDetails = computed(() => store.state.view.roleShort);

    let clickTimeoutId: number | null = null;
    const clickAlter = (alter: Alter) => {
      if (isConnectMode.value && store.state.view.editIndex != null) {
        if (isConnectable(alter)) {
          const editId = store.state.nwk.alteri[store.state.view.editIndex].id;
          const payload = { id1: editId, id2: alter.id };
          store.commit("toggleConnection", payload);
        }
      } else {
        if (clickTimeoutId == null) {
          clickTimeoutId = setTimeout(() => {
            // simple click
            clickTimeoutId = null;
            console.log(alter.name + " clicked");

            // toggleSelection
            store.commit("view/selectSingleAlter", alter.id);
          }, 500); //tolerance in ms
        } else {
          // double click
          clearTimeout(clickTimeoutId);
          clickTimeoutId = null;
          console.log(alter.name + " dblclick");

          // open form
          store.commit("openAlterFormById", { alterId: alter.id });
        }
      }
    };

    /**
     * map of cartesian coords by alter.id (not the array index!)
     */
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
      egoShape: computed(() =>
        shapeByGender(true, store.state.nwk.ego.currentGender)
      ),
      isEditMode,
      isConnectMode,
      clickAlter,
      alteriMarks,
      connectionMarks,
      markDetails,
      markRoleDetails,
      getRoleShort,
      alteriNames: computed(() => store.state.view.alteriNames),
      showHorizons: computed(() => store.state.view.horizons),
      connections: computed(() => store.state.view.connections),
      Sectors,
      SYMBOL_DECEASED,
      // TODO browser detection b/c vector-effect seems not to work in Safari only as of 14 Dec 2021
      useTextBG: computed(
        () =>
          !(
            /Safari/.test(navigator.userAgent) &&
            /Apple Computer/.test(navigator.vendor)
          )
      ),
    };
  },
});
// x(distance: number, angle: number): number {
//     return distance * Math.cos(angle * Math.PI/180)
// }
</script>

<style scoped lang="scss">
@import "~bulma/sass/base/_all.sass";

text {
  font-family: $family-primary;
  font-size: 4px;
}

.textbg {
  stroke: white;
  stroke-width: 3;
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
  stroke: lightgray;
  stroke-width: 1;
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
}

#sectors text {
  font-weight: bold;
  fill: gray;
}

.edithint {
  fill: rgba(lightgray, 0.5);
  font-size: 1em;
  font-weight: bold;
}
</style>
