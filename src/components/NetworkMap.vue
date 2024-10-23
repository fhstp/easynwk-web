<template>
  <svg
    id="nwkmap"
    :viewBox="
      showVersionSlider && !isEditMode
        ? '-110 -117 220 220'
        : '-106 -106 212 212'
    "
  >
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

    <NetworkMapCoordinates :transform="transform" />

    <text v-if="isEditMode" text-anchor="middle" class="edithint">
      <tspan x="0" y="-1em">{{ t("maptext") }}</tspan>
      <tspan x="0" dy="2em">{{ t("maptext2") }}</tspan>
    </text>

    <g id="marksBackgroundLayer">
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
          :x1="egoCoords[0]"
          :y1="egoCoords[1]"
          :x2="mark.x"
          :y2="mark.y"
          :filter="mark.d.edgeType == 2 ? 'url(#dilate-and-xor)' : undefined"
        />
        <text
          v-if="alteriNames && useTextBG"
          :style="{ 'font-size': labelSize + 'px' }"
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
          :style="{ 'font-size': labelSize + 'px' }"
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
        :x="egoCoords[0]"
        :y="egoCoords[1]"
        class="mark"
        width="4"
        height="4"
        transform="translate(-2,-2)"
        v-if="!emoji || !egoEmoji"
      />
      <text
        v-if="emoji && egoEmoji"
        :x="egoCoords[0]"
        :y="egoCoords[1] + 1"
        class="mark"
        style="font-size: 4px; cursor: pointer; text-anchor: middle"
      >
        {{ egoEmoji }}
      </text>
    </g>
    <g class="brushParent"></g>
    <g class="marksForegroundLayer">
      <template v-for="mark in alteriMarks">
        <template v-if="mark.d.emoji && emoji">
          <text
            :key="mark.d.id"
            :x="mark.x - 3"
            :y="mark.y + 1"
            class="mark clickAble"
            @click.stop="clickAlter(mark.d)"
            style="font-size: 4px; cursor: pointer"
          >
            {{ mark.d.emoji }}
          </text>
        </template>
        <template v-else>
          <use
            :key="mark.d.id"
            :href="'#' + mark.shape"
            :x="mark.x"
            :y="mark.y"
            class="mark clickAble"
            width="4"
            height="4"
            transform="translate(-2,-2)"
            @click.stop="clickAlter(mark.d)"
          />
        </template>
      </template>
    </g>

    <NetworkMapSectors :transform="transform" @zoom-sector="zoomSector" />

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
    <text :x="0" y="-102" text-anchor="middle" class="ego">
      {{ egoLabel }}
    </text>
    <ComparisonSlider v-if="showVersionSlider && !isEditMode" />
  </svg>
  <div id="zoomBtns">
    <button
      id="zoomResetBtn"
      class="button is-medium"
      type="button"
      :title="t('zoomreset')"
      @click="resetZoom()"
      :disabled="isNotZoomed"
    >
      <span class="icon is-large">
        <font-awesome-icon icon="search-minus" />
      </span>
    </button>
    <button
      id="CliqueBtn"
      class="button is-medium"
      type="button"
      @click="findCliques"
    >
      <span class="icon is-large"> Clique </span>
    </button>
  </div>
  <div id="brushBtns" ref="brushBtns">
    <!-- <button
      id="btnClusterMove"
      class="button is-small"
      type="button"
      title="gemeinsam verschieben"
      disabled
    >
      <span class="icon is-small">
        <font-awesome-icon icon="arrows-alt" />
      </span>
    </button> -->
    <button
      id="btnClusterConnect"
      class="button is-small"
      type="button"
      :title="t('clusterconnect')"
      @click="clusterConnect"
      v-if="!isClusterFullyConnected"
      :disabled="!isClusterConnectPossible"
    >
      <span class="icon is-small">
        <font-awesome-icon icon="link" />
      </span>
    </button>
    <button
      id="btnClusterUnConnect"
      class="button is-small"
      type="button"
      :title="t('deconnect')"
      @click="clusterDisconnect"
      v-else
    >
      <span class="icon is-small">
        <font-awesome-icon icon="unlink" />
      </span>
    </button>
    <button
      id="zoomBtn"
      class="button is-small"
      type="button"
      title="Zoom"
      @click="zoomBrushedArea"
    >
      <span class="icon is-medium">
        <font-awesome-icon icon="search-plus" />
      </span>
    </button>
    <button
      class="button is-small"
      type="button"
      :title="t('closebrush')"
      @click="clearBrush"
    >
      <span class="icon is-small">
        <font-awesome-icon icon="times" />
      </span>
    </button>
  </div>
</template>

<script lang="ts">
import { defineComponent, computed, onMounted, ref, watch } from "vue";
import { useStore } from "@/store";

import NetworkMapCoordinates from "@/components/NetworkMapCoordinates.vue";
import NetworkMapSectors from "@/components/NetworkMapSectors.vue";
import ComparisonSlider from "@/components/ComparisonSlider.vue";

import * as d3 from "d3";
import { Alter, isConnectable } from "@/data/Alter";
import { shapeByGender } from "@/data/Gender";
import { TAB_BASE, TAB_CONNECTIONS } from "@/store/sessionModule";
import { SYMBOL_DECEASED } from "@/assets/utils";
import { getRoleAbbrev } from "../data/Roles";
import { brushSelection, D3BrushEvent } from "d3";
import { zoom, ZoomTransform, zoomIdentity } from "d3-zoom";
import de from "@/de";
import en from "@/en";

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
  mixins: [de, en],
  methods: {
    t(prop: string) {
      return this[document.documentElement.lang][prop];
    },
  },
  components: { NetworkMapCoordinates, NetworkMapSectors, ComparisonSlider },
  emits: ["map-click"],

  setup: function (props, { emit }) {
    const store = useStore();

    const isEditMode = computed(() => {
      return (
        store.state.session.editIndex != null &&
        store.state.session.editTab === TAB_BASE
      );
    });

    function clusterClique(markIds: number[]): boolean {
      const connectedAlters: number[] = [];
      for (let i = 0; i < markIds.length; i++) {
        const connectedAlterIds = computed(() => {
          const myId = markIds[i];
          const id1s = store.state.nwk.connections
            .filter((d) => d.id2 == myId)
            .map((d) => d.id1);
          const id2s = store.state.nwk.connections
            .filter((d) => d.id1 == myId)
            .map((d) => d.id2);
          return [...id1s, ...id2s];
        });

        for (let x = i + 1; x < markIds.length; x++) {
          if (!connectedAlterIds.value.includes(markIds[x])) {
            return false;
          }
        }
        connectedAlters.push(markIds[i]);
      }

      // Check if at least 3 members in the clique
      if (connectedAlters.length >= 3) {
        const alterNames = connectedAlters.map((id) => {
          const alter = store.state.nwk.alteri.find((a) => a.id === id);
          return alter ? alter.name : `Unknown (ID: ${id})`;
        });

        console.log("Clique detected with members:", alterNames);
        return true;
      }

      return false;
    }

    const getPositionPolar = (event: UIEvent) => {
      const coords = d3.pointer(event);

      // revert viewport projection
      const xa = transform.value.invertX(coords[0]);
      const ya = transform.value.invertY(coords[1]);

      // cp. https://stackoverflow.com/a/33043899/1140589
      const distance = Math.sqrt(xa * xa + ya * ya);
      const angle = Math.atan2(-1 * ya, xa) * (180 / Math.PI);

      return { distance, angle };
    };

    const isConnectMode = computed(
      () => store.state.session.editTab === TAB_CONNECTIONS
    );

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const zoomBehavior: any = zoom();
    const transform = ref<ZoomTransform>(zoomIdentity);

    /**
     * brush selection in unzoomed coordinates
     */
    let brushAbsoluteCoords = [
      [0, 0],
      [0, 0],
    ] as [[number, number], [number, number]];

    onMounted(() => {
      // d3.mouse only works if the event is registered using D3 .on

      const svg = d3.select("#nwkmap");

      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      zoomBehavior
        .extent([
          [-106, -106],
          [212, 212],
        ])
        .translateExtent([
          [-106, -106],
          [212, 212],
        ])
        .scaleExtent([1, 8])
        .on("zoom", zoomed);

      svg.call(zoomBehavior).on("mousedown.zoom", null);
      svg.on("dblclick.zoom", null);

      //Zoom with mouse wheel
      function zoomed(event: { transform: ZoomTransform }) {
        // console.log(event.transform);
        // inform vue's reactivity of updated zoom
        transform.value = event.transform;

        // re-scale brush selection
        const brushElement = d3.select("#nwkmap g#brush").node() as SVGGElement;
        if (brushElement && brushSelection(brushElement)) {
          const myExtent = [
            transform.value.apply(brushAbsoluteCoords[0]),
            transform.value.apply(brushAbsoluteCoords[1]),
          ] as d3.BrushSelection;
          brush.move(d3.select(brushElement), myExtent);
        }
      }

      const g = d3.select("#nwkmap");

      let clickBackgroundTimeoutId: number | null = null;
      g.on("click", (event) => {
        const posPol = getPositionPolar(event);
        if (clickBackgroundTimeoutId == null) {
          // first click -> start timer
          clickBackgroundTimeoutId = setTimeout(() => {
            // timeout expired -> simple click
            clickBackgroundTimeoutId = null;

            if (isEditMode.value) {
              const payload = {
                index: store.state.session.editIndex,
                changes: posPol,
              };
              store.commit("editAlter", payload);
              // } else {
              //   store.commit("session/clearSelectedAlters");
            }
            emit("map-click", posPol);
          }, 500); //tolerance in ms
        } else {
          // 2nd click -> double click
          clearTimeout(clickBackgroundTimeoutId);
          clickBackgroundTimeoutId = null;

          if (isEditMode.value) {
            store.commit("editAndCloseAlterForm", { changes: posPol });
          } else {
            store.commit("addAlter", posPol);
          }
          emit("map-click", posPol);
        }
      });

      initBrushBehavior();
    });

    // disable brush as long as in edit or connect mode
    watch(
      () => isEditMode.value || isConnectMode.value,
      (newIsSomeMode: boolean) => {
        if (newIsSomeMode) {
          d3.select("#nwkmap #brush").remove();
          if (brushBtns.value) {
            brushBtns.value.style.visibility = "hidden";
          }
        } else {
          initBrushBehavior();
        }
      }
    );

    const brush = d3.brush().extent([
      [-105, -105],
      [105, 105],
    ]);

    function initBrushBehavior() {
      brush
        .on("start", () => {
          // when brush is changed (e.g. resized) -> hide buttons
          if (brushBtns.value) {
            brushBtns.value.style.visibility = "hidden";
          }
        })
        .on("end", afterBrushChanged);

      d3.select("#nwkmap g.brushParent")
        .append("g")
        .attr("class", "brush")
        .attr("id", "brush")
        .call(brush);

      d3.select("#nwkmap")
        .select("#brush > .selection")
        .style("fill", "steelblue")
        .style("opacity", "0.4")
        .style("stroke-width", "0.5");
    }

    /** resets the brush to a null selection */
    const clearBrush = () => {
      if (brush) {
        brush.clear(d3.select("#nwkmap #brush"));
      }
    };

    let markIdsInExtent: number[] = [];
    let connectableIdsInExtent: number[] = [];

    // we need a DOM ref in order to focus
    const brushBtns = ref<InstanceType<typeof HTMLDivElement> | null>(null);

    const isClusterConnectPossible = ref(false);
    const isClusterFullyConnected = ref(false);

    function zoomBrushedArea() {
      const brushElement = d3.select("#brush").node() as SVGGElement | null;

      if (brushElement) {
        const extent = brushSelection(brushElement) as [
          [number, number],
          [number, number]
        ];

        if (extent) {
          const x0 = extent[0][0];
          const y0 = extent[0][1];
          const x1 = extent[1][0];
          const y1 = extent[1][1];

          const brushWidth = Math.abs(x1 - x0);
          const brushHeight = Math.abs(y1 - y0);

          const k =
            (212 / Math.max(brushWidth, brushHeight)) * transform.value.k;

          // brush center in absolute coordinates
          const tx = transform.value.invertX((x0 + x1) / 2);
          const ty = transform.value.invertY((y0 + y1) / 2);
          console.log(`k: ${k}  t.x: ${tx}   t.y: ${ty}`);

          const nextTransform = new ZoomTransform(k, tx * k * -1, ty * k * -1);
          d3.select("#nwkmap")
            .transition()
            .duration(750)
            .call(zoomBehavior.transform, nextTransform);

          // Clear the brush selection
          clearBrush();
        }
      }
    }

    function zoomSector(dirX: number, dirY: number) {
      const nextTransform = new ZoomTransform(1.9, -94.4 * dirX, -94.4 * dirY);
      d3.select("#nwkmap")
        .transition()
        .duration(750)
        .call(zoomBehavior.transform, nextTransform);
    }

    function afterBrushChanged(event: D3BrushEvent<unknown>) {
      // console.log(event);

      if (event.selection) {
        // brush changed can also result from zooming, but then it has no source event
        if (event.sourceEvent) {
          const extent = event.selection as [
            [number, number],
            [number, number]
          ];

          // remember the brush coordinates
          brushAbsoluteCoords = [
            transform.value.invert(extent[0]),
            transform.value.invert(extent[1]),
          ];

          const marksInExtent = alteriMarks.value.filter((am) =>
            isInBrushExtent(am, extent)
          );
          markIdsInExtent = marksInExtent.map((am) => am.d.id);
          store.commit("session/selectAlters", markIdsInExtent);

          // check if cluster connect is possible (more than 1 connectable alter)
          connectableIdsInExtent = marksInExtent
            .filter((am) => isConnectable(am.d))
            .map((am) => am.d.id);
          isClusterConnectPossible.value = connectableIdsInExtent.length >= 2;
          isClusterFullyConnected.value =
            isClusterConnectPossible.value &&
            clusterConnected(connectableIdsInExtent);
        }

        // move buttons relative to selection box as SVG element
        // <https://stackoverflow.com/questions/26049488/how-to-get-absolute-coordinates-of-object-inside-a-g-group>
        const divChart = document.querySelector("div#chart");
        const svgExtent = document.querySelector("#brush > .selection");
        if (divChart && svgExtent) {
          // console.log(svgExtent);
          const chartRect = divChart.getBoundingClientRect();
          const selRect = svgExtent.getBoundingClientRect();
          // console.log(chartRect);
          // console.log(selRect);
          if (brushBtns.value) {
            brushBtns.value.style.visibility = "visible";
            brushBtns.value.style.top = selRect.y - chartRect.y + "px";
            brushBtns.value.style.right =
              chartRect.right - selRect.x + 4 + "px";
          }
        } else {
          console.warn("Brush rect not found");
        }
      } else {
        // console.log("Brush selection inactive");
        if (store.state.session.selected.size > 0) {
          store.commit("session/clearSelectedAlters");
        }
        if (brushBtns.value) {
          brushBtns.value.style.visibility = "hidden";
        }
      }
    }

    function isInBrushExtent(
      mark: AlterMark,
      extent: [[number, number], [number, number]]
    ) {
      return (
        mark.x >= extent[0][0] &&
        mark.x <= extent[1][0] &&
        mark.y >= extent[0][1] &&
        mark.y <= extent[1][1]
      );
    }

    //functionality of Reset button for zoom
    function resetZoom(): void {
      const svg: HTMLElement | null = document.getElementById("nwkmap");

      if (svg) {
        d3.select(svg)
          .transition()
          .duration(750)
          .call(zoomBehavior.transform, d3.zoomIdentity);
      }
    }

    function clusterConnect() {
      store.commit("addClusterConnections", connectableIdsInExtent);
      isClusterFullyConnected.value = true;
    }

    function clusterDisconnect() {
      store.commit("removeClusterConnections", connectableIdsInExtent);
      isClusterFullyConnected.value = false;
    }

    function clusterConnected(markIds: number[]) {
      for (let i = 0; i < markIds.length; i++) {
        const connectedAlterIds = computed(() => {
          const myId = markIds[i];
          const id1s = store.state.nwk.connections
            .filter((d) => d.id2 == myId)
            .map((d) => d.id1);
          const id2s = store.state.nwk.connections
            .filter((d) => d.id1 == myId)
            .map((d) => d.id2);
          return [...id1s, ...id2s];
        });
        for (let x = i + 1; x < markIds.length; x++) {
          if (!connectedAlterIds.value.includes(markIds[x])) {
            return false;
          }
        }
      }
      return true;
    }

    //- Clique -----------------------------------------------------------------

    function getConnectedAlterIds(alterId: number): number[] {
      const connections = store.state.nwk.connections;
      const id1s = connections
        .filter((conn) => conn.id2 === alterId)
        .map((conn) => conn.id1);
      const id2s = connections
        .filter((conn) => conn.id1 === alterId)
        .map((conn) => conn.id2);
      return [...id1s, ...id2s];
    }

    function isClique(alterIds: number[]): boolean {
      if (alterIds.length < 3 || alterIds.length > 12) return false; // mind. 3 und max. 12 für Clique

      for (let i = 0; i < alterIds.length; i++) {
        const connectedIds = getConnectedAlterIds(alterIds[i]);
        for (let j = 0; j < alterIds.length; j++) {
          if (i !== j && !connectedIds.includes(alterIds[j])) {
            return false;
          }
        }
      }

      return true;
    }

    function findCliques() {
      const alteri = store.state.nwk.alteri;
      const cliques: string[][] = [];

      // Lt Google-Suche ist eine Clique min 3 und max 12 Personen
      for (let size = 3; size <= 12; size++) {
        const combinations = getCombinations(alteri, size);

        combinations.forEach((potentialClique) => {
          const ids = potentialClique.map((alter) => alter.id);
          if (isClique(ids)) {
            const cliqueNames = ids.map(
              (id) =>
                alteri.find((alter) => alter.id === id)?.name || "Unbekannt"
            );
            cliques.push(cliqueNames);
          }
        });
      }

      // Duplizierte Cliquen entfernen, die Teil einer größeren Clique sind
      const uniqueCliques = removeSubCliques(cliques);

      uniqueCliques.forEach((clique) => {
        console.log("Clique gefunden:", clique);
      });

      if (uniqueCliques.length === 0) {
        console.log("Keine Cliquen gefunden");
      }
    }

    // Kombinationen von size im array
    function getCombinations(array: any[], size: number): any[][] {
      const results: any[][] = [];

      function combine(start: number, chosen: any[]) {
        if (chosen.length === size) {
          results.push([...chosen]);
          return;
        }

        for (let i = start; i < array.length; i++) {
          chosen.push(array[i]);
          combine(i + 1, chosen);
          chosen.pop();
        }
      }

      combine(0, []);
      return results;
    }

    function removeSubCliques(cliques: string[][]): string[][] {
      const filteredCliques: string[][] = [];

      // Sortiert nach Größe damit subcliquen nicht zuerst gezeigt werden
      cliques.sort((a, b) => b.length - a.length);

      cliques.forEach((clique) => {
        const isSubset = filteredCliques.some((filteredClique) =>
          clique.every((member) => filteredClique.includes(member))
        );

        if (!isSubset) {
          filteredCliques.push(clique);
        }
      });

      return filteredCliques;
    }

    /*

    // Methode für Clique
    function isClique(alterIds: number[]): boolean {
      if (alterIds.length < 3) return false; // mindestens 3 für Clique

      for (let i = 0; i < alterIds.length; i++) {
        const connectedIds = getConnectedAlterIds(alterIds[i]);
        for (let j = 0; j < alterIds.length; j++) {
          if (i !== j && !connectedIds.includes(alterIds[j])) {
            return false;
          }
        }
      }

      return true;
    }

    // Namen in der Konsole ausgeben
    function findCliques() {
      const alteri = store.state.nwk.alteri;
      const cliques: string[][] = [];

      // Alle möglichen Gruppen durchsuchen
      for (let i = 0; i < alteri.length; i++) {
        for (let j = i + 1; j < alteri.length; j++) {
          for (let k = j + 1; k < alteri.length; k++) {
            const potentialClique = [alteri[i].id, alteri[j].id, alteri[k].id];
            if (isClique(potentialClique)) {
              const cliqueNames = potentialClique.map(
                (id) =>
                  alteri.find((alter) => alter.id === id)?.name || "Unbekannt"
              );
              cliques.push(cliqueNames);
              console.log("Clique gefunden:", cliqueNames);
            }
          }
        }
      }

      if (cliques.length === 0) {
        console.log("Keine Cliquen gefunden");
      }
    }

     */

    const getRoleShort = (role: string) => {
      return getRoleAbbrev(role);
    };

    let clickTimeoutId: number | null = null;
    const clickAlter = (alter: Alter) => {
      if (isConnectMode.value && store.state.session.editIndex != null) {
        if (isConnectable(alter)) {
          const editId =
            store.state.nwk.alteri[store.state.session.editIndex].id;
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
            store.commit("session/selectSingleAlter", alter.id);
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

    const egoCoords = computed(() => transform.value.apply([0, 0]));

    /**
     * map of cartesian coords by alter.id (not the array index!)
     */
    const alteriCoords = computed((): Map<number, { x: number; y: number }> => {
      const buffer = new Map();

      store.state.nwk.alteri.forEach((alter) => {
        // calculate from polar coordinates
        const x = alter.distance * Math.cos((alter.angle * Math.PI) / 180);
        const y = -1 * alter.distance * Math.sin((alter.angle * Math.PI) / 180);

        // project to viewport using zoomBehaviour's transform
        const xp = transform.value.applyX(x);
        const yp = transform.value.applyY(y);

        buffer.set(alter.id, { x: xp, y: yp });
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
          selected: store.getters["session/isSelected"](el.id),
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
          store.getters["session/isSelected"](conn.id1) ||
          store.getters["session/isSelected"](conn.id2);

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
      egoEmoji: computed(() => store.state.nwk.ego.emoji),
      isEditMode,
      isConnectMode,
      clickAlter,
      transform,
      egoCoords,
      alteriMarks,
      connectionMarks,
      labelSize: computed(() => store.state.view.labelSizeInNwk),
      showAge: computed(() => store.state.view.ageInNwk),
      showRole: computed(() => store.state.view.roleInNwk),
      getRoleShort,
      alteriNames: computed(() => store.state.view.alteriNames),
      connections: computed(() => store.state.view.connections),
      emoji: computed(() => store.state.view.emoji),
      brushBtns,
      isClusterConnectPossible,
      isClusterFullyConnected,
      clusterConnect,
      clusterDisconnect,
      //clusterClique,
      clearBrush,
      findCliques,
      //isPartOfClique,
      zoomSector,
      isNotZoomed: computed(() => transform.value.k == 1),
      resetZoom,
      zoomBrushedArea,
      SYMBOL_DECEASED,
      // TODO browser detection b/c vector-effect seems not to work in Safari only as of 14 Dec 2021
      useTextBG: computed(
        () =>
          !(
            /Safari/.test(navigator.userAgent) &&
            /Apple Computer/.test(navigator.vendor)
          )
      ),
      showVersionSlider: computed(() => store.state.record.versions.length > 1),
    };
  },
});
// x(distance: number, angle: number): number {
//     return distance * Math.cos(angle * Math.PI/180)
// }
</script>

<style scoped lang="scss">
@import "~bulma/sass/base/_all.sass";

svg {
  overflow: visible;
}

text {
  font-family: $family-primary;
  font-size: 4px;
  -webkit-user-select: none; /* Safari */
  user-select: none;
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

.clique {
  stroke: purple;
  stroke-width: 2;
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

.edithint {
  fill: rgba(lightgray, 0.5);
  font-size: 1em;
  font-weight: bold;
}

#brushBtns {
  position: absolute;
  visibility: hidden;
  top: 0;
  right: 0;
  // display: flex;
  // flex-direction: column;
}

#brushBtns > button {
  display: block;
  margin-bottom: 0.5rem;
}

#zoomBtns {
  position: absolute;
  right: 2px;
  bottom: 1.5rem;
}
</style>
