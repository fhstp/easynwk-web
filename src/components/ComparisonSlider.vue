<template>
  <div style="position: relative" v-if="changeNWK || showComparison">
    <svg width="100%" height="120">
      <!-- Increased height to accommodate text -->
      <line x1="0" y1="50" x2="100%" y2="50" class="comparisonLine"></line>
      <a v-for="(version, index) in versions" :key="index">
        <circle
          v-if="changeNWK"
          :cx="`${1 + (100 / (versions.length + 1)) * (index + 1)}` + '%'"
          cy="50"
          r="9"
          :class="{
            comparisonCircle: version.id !== currentVersion,
            'comparisonCircle-selected': version.id === currentVersion,
          }"
          @click="() => handleCircleClick(version.id)"
        />
        <circle
          v-if="showComparison"
          :cx="`${1 + (100 / (versions.length + 1)) * (index + 1)}` + '%'"
          cy="50"
          r="9"
          :class="{
            comparisonCircle: version.id !== currentVersion,
            'comparisonCircle-selected': version.id === currentVersion,
          }"
          @click="() => handleComparisonClick(version.id)"
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
</template>

<script lang="ts">
import { defineComponent, computed } from "vue";
import { useStore } from "@/store";

// get Zoom Behavior transform as property
// emit 'zoom-sector' with index of sector

export default defineComponent({
  setup() {
    const store = useStore();

    const versions = computed(() => store.state.record.versions);

    const currentVersion = computed(() => store.state.record.currentVersion);

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
      versions,
      currentVersion,
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
  font-size: 12px !important;
}

.comparisonLine {
  stroke: black !important;
}
.comparisonCircle {
  fill: #ffc37d;
}

.comparisonCircle {
  fill: #d6dae9;
}

.comparisonCircle-selected {
  fill: #ffc37d;
}
</style>
