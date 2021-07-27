<template>
  <div id="container">
    <!-- TODO use slots to separate layout from logic https://vuejs.org/v2/guide/components.html#Content-Distribution-with-Slots -->
    <div id="main">
      <div class="scrollwrapper">
        <div id="titlebar" class="box has-text-black">
          <SideMenu
            :nwkdata="alteri"
            @new-nwk="egoEditMode = true"
            @open-nwk="editEgoFinished"
          />
          <div id="brand"><i>easy</i>NWK</div>
          <EgoHeader @edit="egoEditMode = true" />
        </div>

        <div id="forms">
          <EgoEditForm v-if="egoEditMode" @edit-finished="editEgoFinished" />

          <!-- <AlteriPanel
            v-if="!egoEditMode"
            v-bind:alteri="alteri"
            v-bind:editedAlter="editedAlter"
            @edit="editAlterClicked"
            @edit-finished="editAlterFinished"
          /> -->
        </div>
        <!-- <div>
            Über die easyNWK &nbsp; &nbsp; &nbsp; Impressum
        </div> -->
      </div>
    </div>
    <div id="chart">
      <!-- <NetworkMap
        v-bind:alteri="alteri"
        v-bind:editedAlter="editedAlter"
        @map-click="mapclick"
      /> -->
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent, ref } from "vue";

// @ is an alias to /src
import EgoHeader from "@/components/EgoHeader.vue";
import EgoEditForm from "@/components/EgoEditForm.vue";
import SideMenu from "@/components/SideMenu.vue";
import { Alter } from "@/data/Alter";
import { AlteriList } from "@/data/AlteriList";

export default defineComponent({
  components: { EgoHeader, EgoEditForm, SideMenu },
  // components: { EgoHeader, EgoEditForm, AlteriPanel, NetworkMap, SideMenu },

  setup(props) {
    const alteri = ref(new AlteriList());

    // managing the currently open Alter
    const editedAlter = ref<Alter | null>(null);

    const editAlterClicked = (newEditAlter: Alter) => {
      // if another alter is currently being edited
      if (editedAlter.value != null) alteri.value.persistAlteri();

      editedAlter.value = newEditAlter;
    };

    const editAlterFinished = () => {
      alteri.value.persistAlteri();
      editedAlter.value = null;
    };

    // if Ego Name is empty --> start in Ego edit mode
    const egoEditMode = ref(alteri.value.getEgo().name.length == 0);

    const editEgoFinished = () => {
      // alteri.value.persistEgo();
      egoEditMode.value = false;
    };

    const mapclick = (coords: { distance: number; angle: number }) => {
      console.log(
        "map click at (" + coords.angle + ", " + coords.distance + ")"
      );
    };

    return {
      alteri,
      editedAlter,
      editAlterClicked,
      egoEditMode,
      editAlterFinished,
      editEgoFinished,
      mapclick
    };
  }
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
  width: 97vmin;
  height: 100vmin;
  /* background: aqua; */
}

.scrollwrapper {
  display: flex;
  flex-direction: column;
}

#titlebar {
  font-size: 180%;
  background: $color-primary-1; /* hsl(32, 100%, 50%); /* $light; */
  padding: 1vmin 1vmin 1vmin 1vmin;
  margin: 0.5rem 1px 1rem 1px;
  flex-shrink: 0;

  flex-direction: row;
  flex-wrap: nowrap;
  display: flex;
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

@media (min-width: 168vh) {
  #main {
    width: 70vmin;
  }

  .scrollwrapper {
    height: 100vmin;
    flex: 1;
  }

  #forms {
    overflow-y: auto;
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
</style>
