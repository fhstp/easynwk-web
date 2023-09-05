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
          <span>{{ t("newNWK") }}</span>
        </button>

        <div class="file">
          <label class="file-label">
            <input class="file-input" type="file" @change="open" />
            <span class="file-cta">
              <span class="file-icon">
                <font-awesome-icon icon="folder-open" />
              </span>
              <span class="file-label"> {{ t("open") }} </span>
            </span>
          </label>
        </div>

        <button class="button" @click="save">
          <span class="icon">
            <font-awesome-icon icon="save" />
          </span>
          <span>{{ t("save") }}</span>
        </button>

        <button class="button" @click="openDemoData">
          <!-- <span class="icon">
            <font-awesome-icon icon="save" />
          </span> -->
          <span>{{ t("openDemo") }}</span>
        </button>

        <p><br /></p>

        <button class="button" @click="exportPNG">
          <span class="icon">
            <font-awesome-icon icon="file-image" />
          </span>
          <span>{{ t("exportPNG") }}</span>
        </button>

        <button class="button" @click="exportCSV">
          <span class="icon">
            <font-awesome-icon icon="file-csv" />
          </span>
          <span>{{ t("exportkeyfigures") }}</span>
        </button>

        <a
          :href="
            '#/Pdf?pseudo=' +
            pseudonyms +
            '&hor=' +
            horizons +
            '&con=' +
            connections +
            '&alt=' +
            alteriNames +
            '&age=' +
            showAge +
            '&role=' +
            showRole
          "
          target="_blank"
          class="button"
        >
          <!-- Button richtig stylen-->
          <span class="icon">
            <font-awesome-icon icon="file-pdf" />
          </span>
          <span>{{ t("createPDF") }}</span>
        </a>

        <p><br /></p>

        <button class="button" @click="showStatistics">
          <span class="icon">
            <font-awesome-icon icon="chart-bar" />
          </span>
          <span>{{ t("keyfigures") }}</span>
        </button>
      </div>

      <div class="links">
        <a href="http://www.easynwk.com/" target="_blank">{{
          t("abouteasyNWK")
        }}</a>
        <a href="https://github.com/fhstp/easynwk-web" target="_blank"
          >{{ t("sourcecode") }} (Version {{ appVersion }})</a
        >
        <a href="http://www.easynwk.com/impressum/">{{ t("imprint") }}</a>
        <img src="fhstp_sw_pos.png" width="80" height="80" />
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { computed, defineComponent, ref } from "vue";
// @ is an alias to /src
import { useStore } from "@/store";
import { downloadSVGasPNG, downloadText } from "@/assets/utils";
import { statisticsCSV } from "@/data/statisticsCSV";
import { NWK } from "@/data/NWK";
import de from "@/de";
import en from "@/en";

export default defineComponent({
  mixins: [de, en],
  methods: {
    t(prop: string) {
      console.log(document.documentElement.lang);
      return this[document.documentElement.lang][prop];
    },
  },
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
      let nwkJSON = JSON.stringify(store.state.nwk);
      let filename = store.state.nwk.ego.name;

      if (store.state.pseudonym.active) {
        const tempNWK = JSON.parse(nwkJSON) as NWK;
        for (const alter of tempNWK.alteri) {
          alter.name = store.getters["pseudonym/pseudonize"](alter.id);
        }
        nwkJSON = JSON.stringify(tempNWK);
        filename += "_anonym";
      }

      downloadText(filename + ".json", nwkJSON);
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

    return {
      menuOpen,
      newNWK,
      open,
      save,
      openDemoData,
      appVersion: computed(() => process.env.VUE_APP_VERSION),
      exportPNG: () => {
        downloadSVGasPNG(store.state.nwk.ego.name + ".png", "svg#nwkmap");
      },
      exportCSV: () => {
        downloadText(
          store.state.nwk.ego.name + ".csv",
          statisticsCSV(store.state.nwk, store.getters["displayName"])
        );
      },

      showStatistics: () => store.commit("view/enable", "statistics"),

      pseudonyms: computed(() => store.state.pseudonym.active),
      togglePseudonyms: () => store.commit("pseudonym/toggle"),
      horizons: computed(() => store.state.view.horizons),
      toggleHorizons: () => store.commit("view/toggle", "horizons"),
      connections: computed(() => store.state.view.connections),
      toggleConnections: () => store.commit("view/toggle", "connections"),
      alteriNames: computed(() => store.state.view.alteriNames),
      toggleAlteriNames: () => store.commit("view/toggle", "alteriNames"),
      showAge: computed(() => store.state.view.ageInNwk),
      toggleAge: () => store.commit("view/toggle", "ageInNwk"),
      showRole: computed(() => store.state.view.roleInNwk),
      toggleRoleShort: () => store.commit("view/toggle", "roleInNwk"),
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

#sidepanel .links a,
#sidepanel .links img {
  padding: 8px 8px 8px 32px;
  text-decoration: none;
  color: #c1c1c1;
  display: block;
  transition: 0.3s;
}

/* When you mouse over the navigation links, change their color */
#sidepanel .links a:hover {
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
