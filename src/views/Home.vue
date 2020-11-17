<template>
  <div id="container">
    <div id="main">
      <div class="scrollwrapper">
        <div id="titlebar" class="has-text-black">
          <button
            data-behavior="menu-open"
            class="button is-burger"
            onclick="openNav()"
          >
            <span class="icon is-medium">
              <font-awesome-icon icon="bars" size="2x" />
            </span>
          </button>
          <div id="brand">NWK</div>
          <div id="ego">
            Rosa Braunsteigl-Müller &nbsp;
            <button class="button is-small">
              <span class="icon">
                <font-awesome-icon icon="pencil-alt" />
              </span>
            </button>
          </div>
        </div>
        <div id="sidepanel">
          <a href="javascript:void(0)" class="closebtn" onclick="closeNav()"
            >&times;</a
          >
          <a href="#">Neue NWK</a>
          <a href="#">Öffnen</a>
          <a href="#">Speichern</a>
          <a href="#">Über die easyNWK</a>
        </div>
        <div id="forms">
          <AlteriPanel
            v-bind:alteri="alteri"
            v-bind:editedAlter="editedAlter"
            @edit="editClicked"
            @edit-finished="editFinished"
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

import AlteriPanel from "@/components/AlteriPanel.vue";
import NetworkMap from "@/components/NetworkMap.vue";
import { Alter } from "@/data/Alter";
import { AlteriList } from "@/data/AlteriList";

@Component({
  components: {
    AlteriPanel,
    NetworkMap
  }
})
export default class Home extends Vue {
  private ego: string;
  private alteri: AlteriList;
  private editedAlter: Alter | null;

  constructor() {
    super();
    this.ego = "Alex";
    this.alteri = new AlteriList();
    this.editedAlter = null;
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

  editClicked(newEditAlter: Alter) {
    this.editedAlter = newEditAlter;
  }

  editFinished() {
    this.editedAlter = null;
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
  flex-shrink: 0;

  flex-direction: row;
  flex-wrap: nowrap;
  display: flex;
}

#brand {
  margin: 0 0.8em;
  font-weight: bold;
}

#titlebar > #ego {
  display: flex;
  align-items: center;
}

#ego > :last-child {
  margin-left: 0.8em;
}

#forms {
  padding: 1vmin 1vmin 1vmin 1vmin;
  /*            font-size: 120%; */
  flex-grow: 1;
}

/* https://github.com/jgthms/bulma/issues/1600#issuecomment-700153268
.button.is-circular {
  border-radius: 50%;
}
*/

.button.is-burger {
  width: 2.5rem;
  height: 2.5rem;
  padding: 0;
  background-color: transparent;
  border-color: transparent;
}

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

/* The sidepanel menu */
#sidepanel {
  height: 100vh; /* Specify a height */
  width: 0; /* 0 width - change this with JavaScript */
  position: fixed; /* Stay in place */
  z-index: 1; /* Stay on top */
  top: 0;
  left: 0;
  background-color: #111; /* Black*/
  overflow-x: hidden; /* Disable horizontal scroll */
  padding-top: 60px; /* Place content 60px from the top */
  transition: 0.5s; /* 0.5 second transition effect to slide in the sidepanel */
}

/* The sidepanel links */
#sidepanel a {
  padding: 8px 8px 8px 32px;
  text-decoration: none;
  color: #818181;
  display: block;
  transition: 0.3s;
}

/* When you mouse over the navigation links, change their color */
#sidepanel a:hover {
  color: #f1f1f1;
}

/* Position and style the close button (top right corner) */
#sidepanel .closebtn {
  position: absolute;
  top: 0;
  right: 25px;
  font-size: 36px;
  margin-left: 50px;
}
</style>
