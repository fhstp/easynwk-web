<template>
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

    <text v-if="isEditMode" text-anchor="middle" class="edithint">
      <tspan x="0" y="-1em">Klicke in die Karte, um</tspan>
      <tspan x="0" dy="2em">die Position festzulegen</tspan>
    </text>

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
          :filter="mark.d.edgeType == 2 ? 'url(#dilate-and-xor)' : undefined"
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
        @click.stop="clickAlter(mark.d)"
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
    <text :x="0" y="-102" text-anchor="middle" class="ego">
      {{ egoLabel }}
    </text>
  </svg>
  <div id="mapContainer" style="position: relative; right: -52%; bottom: 10%">
    <button
      id="zoomResetBtn"
      class="button is-medium"
      type="button"
      title="Zoom Zurücksetzen"
      @click="resetZoom()"
    >
      <span class="icon is-large">
        <font-awesome-icon icon="search-minus" />
      </span>
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
      title="komplett verbinden (Clique erzeugen)"
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
      title="alle Beziehungen lösen"
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
      title="Auswahlrechteck schließen"
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

import * as d3 from "d3";
// import { ContainerElement } from "d3";
import { Alter, isConnectable } from "@/data/Alter";
import { Sectors } from "@/data/Sectors";
import { shapeByGender } from "@/data/Gender";
import { TAB_BASE, TAB_CONNECTIONS } from "@/store/viewOptionsModule";
import { SYMBOL_DECEASED } from "@/assets/utils";
import { getRoleAbbrev } from "../data/Roles";
import { brushSelection, D3BrushEvent } from "d3";
import { zoom } from "d3-zoom";

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
  components: {},
  emits: ["map-click"],

  setup: function (props, { emit }) {
    const store = useStore();

    const isEditMode = computed(() => {
      return (
        store.state.view.editIndex != null &&
        store.state.view.editTab === TAB_BASE
      );
    });

    const getPositionPolar = (event: UIEvent) => {
      const coords = d3.pointer(event);

      // cp. https://stackoverflow.com/a/33043899/1140589
      const distance = Math.sqrt(coords[0] * coords[0] + coords[1] * coords[1]);
      const angle = Math.atan2(-1 * coords[1], coords[0]) * (180 / Math.PI);

      return { distance, angle };
    };

    const isConnectMode = computed(
      () => store.state.view.editTab === TAB_CONNECTIONS
    );

    onMounted(() => {
      // d3.mouse only works if the event is registered using D3 .on

      const svg = d3.select("#nwkmap");

      const zoomBehavior: any = zoom().scaleExtent([1, 7]).on("zoom", zoomed);

      //Zoom with mouse wheel
      svg.call(zoomBehavior).on("mousedown.zoom", null);
      svg.on("dblclick.zoom", null);

      function zoomed(event: any) {
        const { transform } = event;

        const scaleFactor = 1 / transform.k;

        d3.selectAll("#lineZoom").style("stroke-width", 0.5 * scaleFactor);

        d3.selectAll("svg#nwkmap").style("font-size", 4 * scaleFactor);

        d3.selectAll("#circlePath")
          .attr("r", 1 * scaleFactor)
          .style("stroke-width", 0.2 * scaleFactor);

        d3.selectAll("#rectPath")
          .attr(
            "d",
            "M" +
              " " +
              0.886 * scaleFactor +
              "," +
              0.886 * scaleFactor +
              "" +
              -0.886 * scaleFactor +
              "," +
              0.886 * scaleFactor +
              "" +
              -0.886 * scaleFactor +
              "," +
              -0.886 * scaleFactor +
              "" +
              0.886 * scaleFactor +
              "," +
              -0.886 * scaleFactor +
              " " +
              "Z"
          )
          .style("stroke-width", 0.2 * scaleFactor);

        d3.selectAll("#trianglePath")
          .attr(
            "d",
            "M" +
              " " +
              -1.347 * scaleFactor +
              "," +
              0.778 * scaleFactor +
              " " +
              1.347 * scaleFactor +
              "," +
              0.778 * scaleFactor +
              " " +
              0 * scaleFactor +
              "," +
              -1.555 * scaleFactor +
              "" +
              "Z"
          )
          .style("stroke-width", 0.2 * scaleFactor);

        d3.selectAll("#penPath")
          .attr(
            "d",
            "M" +
              " " +
              -0.67565 * scaleFactor +
              "," +
              0.93 * scaleFactor +
              " " +
              0.67565 * scaleFactor +
              "," +
              0.93 * scaleFactor +
              " " +
              1.0932 * scaleFactor +
              "," +
              -0.3551706841894581 * scaleFactor +
              " " +
              0 * scaleFactor +
              "," +
              -1.1495 * scaleFactor +
              " " +
              -1.0932 * scaleFactor +
              "," +
              -0.3551706841894581 * scaleFactor +
              " " +
              "Z"
          )
          .style("stroke-width", 0.2 * scaleFactor);

        d3.selectAll("#starPath")
          .attr(
            "d",
            "M" +
              " " +
              0.69236155 * scaleFactor +
              "," +
              1.054307 * scaleFactor +
              " " +
              0.00345969 * scaleFactor +
              "," +
              0.69533821 * scaleFactor +
              " " +
              -0.68279921 * scaleFactor +
              "," +
              1.0593342 * scaleFactor +
              " " +
              -0.55428199 * scaleFactor +
              "," +
              0.29322216 * scaleFactor +
              " " +
              -1.1125284 * scaleFactor +
              "," +
              -0.24696789 * scaleFactor +
              "" +
              "l" +
              "" +
              0.76832984 * scaleFactor +
              "," +
              -0.11451451 * scaleFactor +
              " " +
              0.34124363 * scaleFactor +
              "," +
              -0.6978518 * scaleFactor +
              " " +
              0.34633676 * scaleFactor +
              "," +
              0.69533819 * scaleFactor +
              " " +
              0.76914657 * scaleFactor +
              "," +
              0.1088939 * scaleFactor +
              " " +
              -0.55428196 * scaleFactor +
              "," +
              0.54425715 * scaleFactor +
              " " +
              "Z"
          )
          .style("stroke-width", 0.2 * scaleFactor);

        const mapContainer = d3.select("#nwkmap");

        const viewBoxWidth = 212 / transform.k;
        const viewBoxHeight = 212 / transform.k;

        if (viewBoxHeight === 212 && viewBoxWidth === 212) {
          mapContainer.attr("viewBox", `${-106} ${-106} ${212} ${212}`);
        } else {
          const centerX = transform.x / transform.k;
          const centerY = transform.y / transform.k;

          const viewBoxX = -centerX - viewBoxWidth / 2;
          const viewBoxY = -centerY - viewBoxHeight / 2;

          mapContainer.attr(
            "viewBox",
            `${viewBoxX} ${viewBoxY} ${viewBoxWidth} ${viewBoxHeight}`
          );
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
                index: store.state.view.editIndex,
                changes: posPol,
              };
              store.commit("editAlter", payload);
              // } else {
              //   store.commit("view/clearSelectedAlters");
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
            // alterAdded();
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

    /*
    function alterAdded() {
      const svg = d3.select("#nwkmap");

      const viewBoxValue = svg.attr("viewBox");

      const [width, height] = viewBoxValue.split(" ").map(Number);

      let transform;

      // Instead of using transform.k
      if (width <= height) {
        transform = height;
      } else {
        transform = width;
      }
      const scaleFactor = (1 / 212) * transform;

      console.log("alterAdded() called w" + scaleFactor);

      d3.selectAll("#lineZoom").style("stroke-width", 0.5 * scaleFactor);

      d3.selectAll("svg#nwkmap")
        .style("font-size", 4 * scaleFactor)
        .style("stroke-width", 0.2 * scaleFactor);
    }
    */

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
        brush.clear(d3.select("#nwkmap .brush"));
      }
    };

    let markIdsInExtent: number[] = [];
    let connectableIdsInExtent: number[] = [];

    // we need a DOM ref in order to focus
    const brushBtns = ref<InstanceType<typeof HTMLDivElement> | null>(null);

    const isClusterConnectPossible = ref(false);
    const isClusterFullyConnected = ref(false);

    function zoomBrushedArea() {
      const svg = d3.select("#nwkmap");
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

          const viewBoxX = x0 < x1 ? x0 : x1;
          const viewBoxY = y0 < y1 ? y0 : y1;
          const viewBoxWidth = Math.abs(x1 - x0);
          const viewBoxHeight = Math.abs(y1 - y0);

          let transform;

          // Instead of using transform.k
          if (viewBoxWidth <= viewBoxHeight) {
            transform = viewBoxHeight;
          } else {
            transform = viewBoxWidth;
          }

          const scaleFactor = (1 / 212) * transform;

          d3.selectAll("#lineZoom").style("stroke-width", 0.5 * scaleFactor);

          d3.selectAll("svg#nwkmap")
            .style("font-size", 4 * scaleFactor)
            .style("stroke-width", 0.2 * scaleFactor);

          d3.selectAll("#circlePath")
            .attr("r", scaleFactor)
            .style("stroke-width", 0.2 * scaleFactor);

          d3.selectAll("#rectPath")
            .attr(
              "d",
              "M" +
                " " +
                0.886 * scaleFactor +
                "," +
                0.886 * scaleFactor +
                "" +
                -0.886 * scaleFactor +
                "," +
                0.886 * scaleFactor +
                "" +
                -0.886 * scaleFactor +
                "," +
                -0.886 * scaleFactor +
                "" +
                0.886 * scaleFactor +
                "," +
                -0.886 * scaleFactor +
                " " +
                "Z"
            )
            .style("stroke-width", 0.2 * scaleFactor);

          d3.selectAll("#trianglePath")
            .attr(
              "d",
              "M" +
                " " +
                -1.347 * scaleFactor +
                "," +
                0.778 * scaleFactor +
                " " +
                1.347 * scaleFactor +
                "," +
                0.778 * scaleFactor +
                " " +
                0 * scaleFactor +
                "," +
                -1.555 * scaleFactor +
                "" +
                "Z"
            )
            .style("stroke-width", 0.2 * scaleFactor);

          d3.selectAll("#penPath")
            .attr(
              "d",
              "M" +
                " " +
                -0.67565 * scaleFactor +
                "," +
                0.93 * scaleFactor +
                " " +
                0.67565 * scaleFactor +
                "," +
                0.93 * scaleFactor +
                " " +
                1.0932 * scaleFactor +
                "," +
                -0.3551706841894581 * scaleFactor +
                " " +
                0 * scaleFactor +
                "," +
                -1.1495 * scaleFactor +
                " " +
                -1.0932 * scaleFactor +
                "," +
                -0.3551706841894581 * scaleFactor +
                " " +
                "Z"
            )
            .style("stroke-width", 0.2 * scaleFactor);

          d3.selectAll("#starPath")
            .attr(
              "d",
              "M" +
                " " +
                0.69236155 * scaleFactor +
                "," +
                1.054307 * scaleFactor +
                " " +
                0.00345969 * scaleFactor +
                "," +
                0.69533821 * scaleFactor +
                " " +
                -0.68279921 * scaleFactor +
                "," +
                1.0593342 * scaleFactor +
                " " +
                -0.55428199 * scaleFactor +
                "," +
                0.29322216 * scaleFactor +
                " " +
                -1.1125284 * scaleFactor +
                "," +
                -0.24696789 * scaleFactor +
                "" +
                "l" +
                "" +
                0.76832984 * scaleFactor +
                "," +
                -0.11451451 * scaleFactor +
                " " +
                0.34124363 * scaleFactor +
                "," +
                -0.6978518 * scaleFactor +
                " " +
                0.34633676 * scaleFactor +
                "," +
                0.69533819 * scaleFactor +
                " " +
                0.76914657 * scaleFactor +
                "," +
                0.1088939 * scaleFactor +
                " " +
                -0.55428196 * scaleFactor +
                "," +
                0.54425715 * scaleFactor +
                " " +
                "Z"
            )
            .style("stroke-width", 0.2 * scaleFactor);

          svg.attr(
            "viewBox",
            `${viewBoxX} ${viewBoxY} ${viewBoxWidth} ${viewBoxHeight}`
          );
          // Clear the brush selection
          clearBrush();
        }
      }
    }

    function afterBrushChanged(event: D3BrushEvent<unknown>) {
      // console.log(event);

      if (event.selection) {
        const extent = event.selection as [[number, number], [number, number]];

        const marksInExtent = alteriMarks.value.filter((am) =>
          isInBrushExtent(am, extent)
        );
        markIdsInExtent = marksInExtent.map((am) => am.d.id);
        store.commit("view/selectAlters", markIdsInExtent);

        // check if cluster connect is possible (more than 1 connectable alter)
        connectableIdsInExtent = marksInExtent
          .filter((am) => isConnectable(am.d))
          .map((am) => am.d.id);
        isClusterConnectPossible.value = connectableIdsInExtent.length >= 2;
        isClusterFullyConnected.value =
          isClusterConnectPossible.value &&
          clusterConnected(connectableIdsInExtent);

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
        console.log("Brush selection inactive");
        if (store.state.view.selected.size > 0) {
          store.commit("view/clearSelectedAlters");
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
      const zoom: d3.ZoomBehavior<Element, unknown> = d3.zoom();

      if (svg) {
        d3.select(svg)
          .transition()
          .duration(75) // Duration for the zoom reset transition
          .call((selection) => {
            selection.call(zoom.transform as any, d3.zoomIdentity);
          })
          .on("end", () => {
            // Update the SVG after reset
            updateSVG();
          });
      }
    }

    function updateSVG(): void {
      const svg: HTMLElement | null = document.getElementById("nwkmap");
      if (svg) {
        const viewBoxWidth = 212;
        const viewBoxHeight = 212;

        d3.selectAll("line").style("stroke-width", 0.5);

        d3.selectAll("svg#nwkmap").style("font-size", 4);

        d3.selectAll("#circlePath").attr("r", 1).style("stroke-width", 0.2);

        d3.selectAll("#rectPath")
          .attr(
            "d",
            "M 0.886, 0.886 -0.886, 0.886 -0.886, -0.886 0.886, -0.886 Z"
          )
          .style("stroke-width", 0.2);

        d3.selectAll("#trianglePath")
          .attr("d", "M -1.347,0.778 1.347,0.778 0,-1.555 Z")
          .style("stroke-width", 0.2);

        d3.selectAll("#penPath")
          .attr(
            "d",
            "M -0.67565,0.93 0.67565,0.93 1.0932,-0.3551706841894581 0,-1.1495 -1.0932,-0.3551706841894581 Z"
          )
          .style("stroke-width", 0.2);

        d3.selectAll("#starPath")
          .attr(
            "d",
            "M 0.69236155,1.054307 0.00345969,0.69533821 -0.68279921,1.0593342 -0.55428199,0.29322216 -1.1125284,-0.24696789 l 0.76832984,-0.11451451 0.34124363,-0.6978518 0.34633676,0.69533819 0.76914657,0.1088939 -0.55428196,0.54425715 z"
          )
          .style("stroke-width", 0.2);

        svg.setAttribute(
          "viewBox",
          `-${viewBoxWidth / 2} -${
            viewBoxHeight / 2
          } ${viewBoxWidth} ${viewBoxHeight}`
        );
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

    const getRoleShort = (role: string) => {
      return getRoleAbbrev(role);
    };

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
      isEditMode,
      isConnectMode,
      clickAlter,
      alteriMarks,
      connectionMarks,
      showAge: computed(() => store.state.view.ageInNwk),
      showRole: computed(() => store.state.view.roleInNwk),
      getRoleShort,
      alteriNames: computed(() => store.state.view.alteriNames),
      showHorizons: computed(() => store.state.view.horizons),
      connections: computed(() => store.state.view.connections),
      brushBtns,
      isClusterConnectPossible,
      isClusterFullyConnected,
      clusterConnect,
      clusterDisconnect,
      clearBrush,
      resetZoom,
      zoomBrushedArea,
      // alterAdded,
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

svg#nwkmap {
  font-size: 4px;
}

text {
  font-family: $family-primary;
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
  stroke: white;
  stroke-width: 0.2;
}

#sectors text {
  font-weight: bold;
  fill: gray;
}

.edithint {
  fill: rgba(lightgray, 0.5);
  font-size: 16px;
  font-weight: bold;
}

#brushBtns {
  position: absolute;
  visibility: hidden;
  // display: flex;
  // flex-direction: column;
}
#brushBtns > button {
  display: block;
  margin-bottom: 0.5rem;
}
</style>
