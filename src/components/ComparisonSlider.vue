<template>
  <g id="comparisonSlider">
    <line
      :x1="versionMarks[0].x"
      y1="-113"
      :x2="versionMarks[0].x * -1"
      y2="-113"
    />
    <a
      v-for="(mark, index) in versionMarks"
      :key="index"
      @click="() => handleCircleClick(mark.d.id)"
    >
      <circle
        v-if="changeNWK"
        :cx="mark.x"
        cy="-113"
        r="2"
        :class="{
          comparisonCircle: !mark.selected,
          'comparisonCircle-selected': mark.selected,
        }"
      />
      <!-- TODO check if different template elements necessary-->
      <circle
        v-if="showComparison"
        :cx="mark.x"
        cy="-113"
        r="2"
        :class="{
          comparisonCircle: !mark.selected,
          'comparisonCircle-selected': mark.selected,
        }"
        @click="() => handleComparisonClick(mark.d.id)"
      />
      <text :x="mark.x" y="-108" text-anchor="middle" class="versionText">
        {{ mark.label }}
      </text>
    </a>
  </g>
</template>

<script lang="ts">
import { defineComponent, computed } from "vue";
import { useStore } from "@/store";
import { NWKVersion } from "@/data/NWKVersion";

interface VersionMark {
  d: NWKVersion;
  label: string;
  x: number;
  selected: boolean;
}

// get Zoom Behavior transform as property
// emit 'zoom-sector' with index of sector

export default defineComponent({
  setup() {
    const store = useStore();

    const versions = computed(() => store.state.record.versions);

    const versionMarks = computed((): Array<VersionMark> => {
      const currentVersion = store.state.record.currentVersion;
      const buffer: Array<VersionMark> = [];
      store.state.record.versions.forEach((version, index, array) => {
        // Julia's formula, scaled between 0 and 1
        // 2 version --> 1/3 and 2/3
        // 3 version --> 1/4 and 2/4 and 3/4
        const xrel = (index + 1) / (array.length + 1);
        const x = (xrel - 0.5) * 200;

        // TODO locale specific date format
        const label = version.title
          ? version.title
          : version.date.substring(8, 10) +
            "." +
            version.date.substring(5, 7) +
            "." +
            version.date.substring(0, 4);

        buffer.push({
          d: version,
          label,
          x,
          selected: version.id === currentVersion,
        });
      });
      // first draw marks further away from center to avoid overplotting
      // return buffer.sort((a, b) => b.d.distance - a.d.distance);
      return buffer;
    });

    function handleCircleClick(versionId: number) {
      const clickedVersion = versions.value.find(
        (version) =>
          version.id === versionId &&
          versionId !== store.state.record.currentVersion
      );
      if (clickedVersion) {
        console.log(`Clicked version: ${clickedVersion.title}`);
        store.commit("switchNWK", versionId);
        console.log("Changed Version");
      }
    }

    function handleComparisonClick(versionId: number) {
      const clickedVersion = versions.value.find(
        (version) =>
          version.id === versionId &&
          versionId !== store.state.record.currentVersion
      );
      console.log(
        "Click for Comparison - not yet implemented! Clicked Version: " +
          clickedVersion
      );
    }

    return {
      versionMarks,
      handleCircleClick,
      handleComparisonClick,
      showComparison: computed(() => store.state.view.nwkcomparison),
      changeNWK: computed(() => store.state.view.nwkchange),
    };
  },
});
</script>

<style scoped lang="scss">
@import "~bulma/sass/base/_all.sass";

.versionText {
  font-size: 4px;
}

line {
  stroke: #afafaf;
  stroke-width: 0.5;
}

.comparisonCircle {
  fill: #d6dae9;
}

.comparisonCircle-selected {
  fill: $color-primary-1;
}
</style>
