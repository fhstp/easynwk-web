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
  <!-- Render ComparisonNWK components for selected circles -->
  <div v-for="index in selectedCircles" :key="index">
    <ComparisonNWK :selectedCircleIndex="index" />
  </div>
</template>

<script lang="ts">
import { useStore } from "@/store";
import { computed, ref, watch } from "vue";
import { Sectors } from "@/data/Sectors";

import { shapeByGender } from "@/data/Gender";

export default {
  components: {},
  name: "ComparisonCircle",

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

/* ... your other styles ... */
</style>
