<template>
  <div id="container">
    <ErrorBoundary>
      <!-- TODO use slots to separate layout from logic https://vuejs.org/v2/guide/components.html#Content-Distribution-with-Slots -->
      <div id="main">
        <div class="scrollwrapper">
          <div id="titlebar">
            <SideMenu
              @new-nwk="egoEditMode = true"
              @open-nwk="editEgoFinished"
            />
            <div id="brand"><i>easy</i>NWK</div>
            <UndoRedo />
          </div>
          <div id="egobar">
            <EgoHeader v-if="!egoEditMode" @edit="egoEditMode = true" />
          </div>

          <div id="forms">
            <EgoEditForm v-if="egoEditMode" @edit-finished="editEgoFinished" />

            <AlteriPanel v-if="!egoEditMode" :mapclicked="mapclicked" />
            <ViewOptionsPanel />
            <ComparisonOptionsPanel />
            <StatisticsPanel v-if="showStatistics" />
          </div>
        </div>
      </div>
      <div id="chart">
        <NetworkMap @map-click="mapclick" />
      </div>
    </ErrorBoundary>
  </div>
</template>

<script lang="ts">
import { defineComponent, ref, computed } from "vue";
import { useStore } from "@/store";

// @ is an alias to /src
import ErrorBoundary from "@/components/ErrorBoundary.vue";
import AlteriPanel from "@/components/AlteriPanel.vue";
import EgoHeader from "@/components/EgoHeader.vue";
import EgoEditForm from "@/components/EgoEditForm.vue";
import SideMenu from "@/components/SideMenu.vue";
import NetworkMap from "@/components/NetworkMap.vue";
import UndoRedo from "@/components/UndoRedo.vue";
import StatisticsPanel from "@/components/StatisticsPanel.vue";
import ViewOptionsPanel from "@/components/ViewOptionsPanel.vue";
import ComparisonOptionsPanel from "@/components/ComparisonOptionsPanel.vue";

export default defineComponent({
  components: {
    ComparisonOptionsPanel,
    ErrorBoundary,
    EgoHeader,
    EgoEditForm,
    AlteriPanel,
    NetworkMap,
    SideMenu,
    UndoRedo,
    StatisticsPanel,
    ViewOptionsPanel,
  },

  setup() {
    // managing the currently open Alter --> moved to store

    const store = useStore();

    const mapclicked = ref(false);

    // if Ego Name is empty --> start in Ego edit mode
    const egoEditMode = ref(
      !store.state.nwk.ego ||
        !store.state.nwk.ego.name ||
        store.state.nwk.ego.name.length == 0
    );

    const editEgoFinished = () => {
      // alteri.value.persistEgo();
      egoEditMode.value = false;
    };

    const mapclick = (coords: { distance: number; angle: number }) => {
      mapclicked.value = !mapclicked.value;
      console.log(
        "map click at (" + coords.angle + ", " + coords.distance + ")"
      );
    };

    return {
      mapclicked,
      egoEditMode,
      editEgoFinished,
      mapclick,
      showStatistics: computed(() => store.state.view.statistics),
    };
  },
});
</script>

<style lang="scss">
#container {
  background: white;
  margin: 0;
  text-align: center;
  overflow: none;
}

#container > div {
  display: inline-block;
  vertical-align: top;
}

#main {
  width: 97vmin;
  /* width: 20em; */
  /*            background: hsl(0, 0%, 96%); /* $light; */
  text-align: left;
  overflow: none;
}

#chart {
  width: 99vmin;
  height: 100vmin;
  position: relative;
  /* background: aqua; */
}

.scrollwrapper {
  display: flex;
  flex-direction: column;
}

#titlebar {
  font-size: 180%;
  background: $fhstpblue; /* #005096; /* $light; */
  color: white;
  padding: 1vmin 1vmin 0.3rem 1vmin;
  margin: 1rem 1px 0 1px;
  border-radius: 6px 6px 0 0;
  flex-shrink: 0;

  flex-direction: row;
  flex-wrap: nowrap;
  display: flex;
}

#egobar {
  font-size: 1rem;
  background: $color-primary-1; /* hsl(32, 100%, 50%); /* $light; */
  padding: 0.5rem 1vmin 1vmin 1vmin;
  margin: 0 1px 1rem 1px;
  border-radius: 0 0 6px 6px;
}

#brand {
  margin: 0 0.5em;
  font-weight: bold;
}

#brand i {
  font-family: "Times New Roman", Times, serif;
  font-style: italic;
  font-size: 80%;
}

#forms {
  padding: 1px;
  /*            font-size: 120%; */
  flex-grow: 1;
}

/* https://github.com/jgthms/bulma/issues/1600#issuecomment-700153268
.button.is-circular {
  border-radius: 50%;
}
*/

@media (min-width: 133vh) {
  #main {
    width: 33vmin;
  }

  .scrollwrapper {
    height: 100vmin;
    flex: 1;
  }

  #forms {
    overflow-y: auto;
  }

  html {
    overflow-y: hidden !important;
  }

  /* Hide scrollbar for Chrome, Safari and Opera */
  body::-webkit-scrollbar {
    display: none;
  }

  /* Hide scrollbar for IE, Edge and Firefox */
  body {
    -ms-overflow-style: none; /* IE and Edge */
    scrollbar-width: none; /* Firefox */
  }
}

@media (min-width: 145vh) {
  #main {
    width: 45vmin;
  }
}

@media (min-width: 162vh) {
  #main {
    width: 62vmin;
  }
}
</style>
