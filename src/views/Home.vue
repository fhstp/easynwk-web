<template>
  <div id="container">
    <!-- TODO use slots to separate layout from logic https://vuejs.org/v2/guide/components.html#Content-Distribution-with-Slots -->
    <div id="main">
      <div class="scrollwrapper">
        <div id="titlebar" class="box has-text-black">
          <SideMenu :nwkdata="alteri" @new-nwk="egoEditMode = true" />
          <div id="brand"><i>easy</i>NWK</div>
          <EgoHeader :ego="alteri.ego" @edit="egoEditMode = true" />
        </div>

        <div id="forms">
          <EgoEditForm
            v-if="egoEditMode"
            :ego="alteri.ego"
            @edit-finished="editEgoFinished"
          />

          <AlteriPanel
            v-if="!egoEditMode"
            v-bind:alteri="alteri"
            v-bind:editedAlter="editedAlter"
            @edit="editAlterClicked"
            @edit-finished="editAlterFinished"
          />
        </div>
        <!-- <div>
            Über die easyNWK &nbsp; &nbsp; &nbsp; Impressum
        </div> -->
      </div>
    </div>
    <div id="chart">
      <NetworkMap
        v-bind:alteri="alteri"
        v-bind:editedAlter="editedAlter"
        @map-click="mapclick"
      />
    </div>
  </div>
</template>

<script lang="ts">
// @ is an alias to /src
// import Form from "@/components/Form.vue";
// import MapParent from "@/components/MapParent.vue";

import { Component, Vue } from "vue-property-decorator"; // Prop,

import EgoHeader from "@/components/EgoHeader.vue";
import EgoEditForm from "@/components/EgoEditForm.vue";
import AlteriPanel from "@/components/AlteriPanel.vue";
import NetworkMap from "@/components/NetworkMap.vue";
import SideMenu from "@/components/SideMenu.vue";
import { Alter } from "@/data/Alter";
import { AlteriList } from "@/data/AlteriList";

@Component({
  components: {
    EgoHeader,
    EgoEditForm,
    AlteriPanel,
    NetworkMap,
    SideMenu
  }
})
export default class Home extends Vue {
  private alteri: AlteriList;
  private editedAlter: Alter | null;
  private egoEditMode: boolean;

  constructor() {
    super();
    this.alteri = new AlteriList();
    this.editedAlter = null;

    // if Ego Name is empty --> start in Ego edit mode
    this.egoEditMode = this.alteri.getEgo().name.length == 0;
  }

  // addRandomContact() {
  //   this.alteri.addAlter(
  //     new Alter(
  //       "Neu",
  //       Math.round(Math.random() * 360 - 180),
  //       Math.round(Math.random() * 100)
  //     )
  //   );
  // }

  editAlterClicked(newEditAlter: Alter) {
    // if another alter is currently being edited
    if (this.editedAlter != null) this.alteri.persistAlteri();

    this.editedAlter = newEditAlter;
  }

  editAlterFinished() {
    this.alteri.persistAlteri();
    this.editedAlter = null;
  }

  editEgoFinished() {
    this.alteri.persistEgo();
    this.egoEditMode = false;
  }

  mapclick(coords: { distance: number; angle: number }) {
    console.log("map click at (" + coords.angle + ", " + coords.distance + ")");
  }
}
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
