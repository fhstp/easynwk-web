<template>
  <div id="menu">
    <button
      data-behavior="menu-open"
      class="button is-burger"
      v-on:click.stop="menuOpen = !menuOpen"
    >
      <span class="icon is-medium">
        <font-awesome-icon icon="bars" size="2x" />
      </span>
    </button>

    <div
      id="sidepanel"
      :class="{ shown: menuOpen }"
      v-on:click="menuOpen = false"
    >
      <button
        class="button is-burger closebtn"
        v-on:click.stop="menuOpen = false"
      >
        <span class="icon is-medium">
          <font-awesome-icon icon="times" size="2x" />
        </span>
      </button>

      <div class="buttons">
        <button class="button" @click="newNWK">
          <span class="icon">
            <font-awesome-icon icon="file" />
          </span>
          <span>Neue NWK</span>
        </button>

        <div class="file">
          <label class="file-label">
            <input class="file-input" type="file" @change="open" />
            <span class="file-cta">
              <span class="file-icon">
                <font-awesome-icon icon="folder-open" />
              </span>
              <span class="file-label"> Öffnen </span>
            </span>
          </label>
        </div>

        <button class="button" @click="save">
          <span class="icon">
            <font-awesome-icon icon="save" />
          </span>
          <span>Speichern</span>
        </button>

        <button class="button" @click="openDemoData">
          <!-- <span class="icon">
            <font-awesome-icon icon="save" />
          </span> -->
          <span>Demo laden</span>
        </button>

        <p><br /></p>

        <button class="button" @click="exportPNG">
          <span class="icon">
            <font-awesome-icon icon="file-image" />
          </span>
          <span>PNG exportieren</span>
        </button>

        <button class="button" @click="exportCSV">
          <span class="icon">
            <font-awesome-icon icon="file-csv" />
          </span>
          <span>Kennzahlen exportieren</span>
        </button>

        <p><br /></p>

        <button class="button" @click="showStatistics">
          <span class="icon">
            <font-awesome-icon icon="chart-bar" />
          </span>
          <span>Kennzahlen</span>
        </button>

        <button class="button" @click.stop="toggleHorizons">
          <span class="icon">
            <font-awesome-icon icon="rss" />
          </span>
          <span v-if="horizons">Horizonte aus</span>
          <span v-else>Horizonte ein</span>
        </button>

        <button class="button" @click.stop="toggleConnections">
          <span class="icon">
            <font-awesome-icon icon="project-diagram" />
          </span>
          <span v-if="connections">Verbindungen aus</span>
          <span v-else>Verbindungen ein</span>
        </button>
      </div>

      <a href="http://www.easynwk.com/" target="_blank">Über die easyNWK</a>
    </div>
  </div>
</template>

<script lang="ts">
import { computed, defineComponent, ref } from "vue";
// @ is an alias to /src
import { useStore } from "@/store";
import { downloadSVGasPNG, downloadText } from "@/assets/utils";
import { statisticsCSV } from "@/data/statisticsCSV";

export default defineComponent({
  setup(props, { emit }) {
    const menuOpen = ref(false);

    const store = useStore();

    const newNWK = () => {
      store.commit("newNWK");
      emit("new-nwk");
    };

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const open = (event: any) => {
      // based on https://stackoverflow.com/a/36198572/1140589
      const files = event.target.files;

      if (files.length <= 0) {
        return false;
      }

      const fr = new FileReader();
      // eslint-disable-next-line
      fr.onload = (e: any) => {
        const nwkText = e.target.result;
        // TODO format checks & error messages
        // if (savedNWK.alteri && savedNWK.alteri instanceof Array) {
        // if (savedNWK.ego && isEgo(savedNWK.ego)) {
        store.commit("loadNWK", nwkText);
        emit("open-nwk");
      };
      fr.readAsText(files.item(0));
    };

    const save = () => {
      downloadText(
        store.state.nwk.ego.name + ".json",
        JSON.stringify(store.state.nwk)
      );
    };

    const openDemoData = () => {
      const DEMO_URL = "Rosa_Braunsteigl-Mueller.json";
      fetch(DEMO_URL)
        .then((res) => res.text())
        .then((nwkText) => {
          store.commit("loadNWK", nwkText);
          emit("open-nwk");
        })
        .catch((err) => {
          throw err;
        });
    };

    const horizons = computed(() => store.state.view.horizons);

    const toggleHorizons = () => {
      if (horizons.value) store.commit("view/disable", "horizons");
      else store.commit("view/enable", "horizons");
    };

    const connections = computed(() => store.state.view.connections);

    return {
      menuOpen,
      newNWK,
      open,
      save,
      openDemoData,
      exportPNG: () => {
        downloadSVGasPNG(store.state.nwk.ego.name + ".png", "svg#nwkmap");
      },
      exportCSV: () => {
        downloadText(
          store.state.nwk.ego.name + ".csv",
          statisticsCSV(store.state.nwk)
        );
      },

      showStatistics: () => {
        store.commit("view/enable", "statistics");
      },
      horizons,
      toggleHorizons,
      connections,
      toggleConnections: () => {
        if (connections.value) store.commit("view/disable", "connections");
        else store.commit("view/enable", "connections");
      },
    };
  },
});
</script>

<style lang="scss">
.button.is-burger {
  color: white;
  width: 2.5rem;
  height: 2.5rem;
  padding: 0;
  background-color: transparent;
  border-color: transparent;
}
.button.is-burger:hover {
  color: white;
}

/* The sidepanel menu */
#sidepanel {
  height: 100vh; /* Specify a height */
  width: 0; /* 0 width - change this with JavaScript */
  position: fixed; /* Stay in place */
  z-index: 1; /* Stay on top */
  top: 0;
  left: 0;
  color: #c1c1c1;
  background-color: #111; /* Black*/
  font-size: 1rem;
  overflow-x: hidden; /* Disable horizontal scroll */
  padding-top: 60px; /* Place content 60px from the top */
  transition: width 1s, visibility 0s 1s; /* 1 second transition effect to slide in the sidepanel, then hide */
  visibility: hidden;
  width: 0px;
}

#sidepanel.shown {
  transition: visibility 0s, width 1s; /* 1 second transition effect to slide in the sidepanel */
  visibility: visible;
  width: 280px;
}

/* The sidepanel links */
#sidepanel > .buttons {
  display: block;
}

#sidepanel > .buttons > * {
  margin-left: 32px;
  margin-bottom: 0.5em;
}

#sidepanel .file-cta {
  background-color: white;
}

#sidepanel a {
  padding: 8px 8px 8px 32px;
  text-decoration: none;
  color: #c1c1c1;
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
  color: #c1c1c1;
  top: 1em;
  right: 1em;
  margin-left: 50px;
}
</style>
