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

    <div id="sidepanel" :style="menuOpen ? 'width: 250px' : 'width: 0px'">
      <button
        class="button is-burger closebtn"
        v-on:click.stop="menuOpen = false"
      >
        <span class="icon is-medium">
          <font-awesome-icon icon="times" size="2x" />
        </span>
      </button>

      <div class="buttons">
        <button class="button">
          <span class="icon">
            <font-awesome-icon icon="file" />
          </span>
          <span>Neue NWK</span>
        </button>

        <div class="file">
          <label class="file-label">
            <input class="file-input" type="file" />
            <span class="file-cta">
              <span class="file-icon">
                <font-awesome-icon icon="folder-open" />
              </span>
              <span class="file-label">
                Öffnen
              </span>
            </span>
          </label>
        </div>

        <button class="button">
          <span class="icon">
            <font-awesome-icon icon="save" />
          </span>
          <span>Speichern</span>
        </button>
      </div>

      <a href="http://www.easynwk.com/" target="_blank">Über die easyNWK</a>
    </div>
  </div>
</template>

<script lang="ts">
// @ is an alias to /src
// import Form from "@/components/Form.vue";
// import MapParent from "@/components/MapParent.vue";

import { Component, Vue, Prop } from "vue-property-decorator"; // Prop,

import { AlteriList } from "@/data/AlteriList";

@Component
export default class SideMenu extends Vue {
  @Prop(AlteriList) private nwkdata!: AlteriList;

  private menuOpen: boolean;

  constructor() {
    super();
    this.menuOpen = false;
  }
}
</script>

<style lang="scss">
.button.is-burger {
  width: 2.5rem;
  height: 2.5rem;
  padding: 0;
  background-color: transparent;
  border-color: transparent;
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
  transition: 0.5s; /* 0.5 second transition effect to slide in the sidepanel */
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
