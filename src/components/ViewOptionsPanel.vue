<template>
  <div class="panel">
    <p class="panel-heading">
      <span>Ansichtseinstellungen</span>
      <span class="buttons are-small right">
        <button id="btn-toggle" class="button" @click.stop="toggle">
          <span id="icon-span" class="icon is-small">
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 384 512">
              <!--! Font Awesome Pro 6.1.1 by @fontawesome - https://fontawesome.com License - https://fontawesome.com/license (Commercial License) Copyright 2022 Fonticons, Inc. -->
              <path
                d="M192 384c-8.188 0-16.38-3.125-22.62-9.375l-160-160c-12.5-12.5-12.5-32.75 0-45.25s32.75-12.5 45.25 0L192 306.8l137.4-137.4c12.5-12.5 32.75-12.5 45.25 0s12.5 32.75 0 45.25l-160 160C208.4 380.9 200.2 384 192 384z"
              />
            </svg>
          </span>
        </button>
      </span>
    </p>
    <form class="panel-block form">
      <div class="field is-horizontal">
        <div class="field-body">
          <div id="view-settings" class="field invis">
            <div class="control">
              <div class="buttons">
              <a class="button" @click="togglePseudonyms">
                <span class="icon">
                  <font-awesome-icon icon="user-secret" />
                </span>
                <span v-if="pseudonyms">De-Anonymisieren</span>
                <span v-else>Anonymisieren</span>
                <span></span>
              </a>



              <button class="button" @click.stop="toggleHorizons">
                <span class="icon">
                  <font-awesome-icon icon="rss" />
                </span>
                <span v-if="horizons">Horizonte aus</span>
                <span v-else>Horizonte ein</span>
              </button>

              <br>

              <button class="button" @click.stop="toggleConnections">
                <span class="icon">
                  <font-awesome-icon icon="project-diagram" />
                </span>
                <span v-if="connections">Verbindungen aus</span>
                <span v-else>Verbindungen ein</span>
              </button>



              <button class="button" @click.stop="toggleAlteriNames">
                <span class="icon">
                  <font-awesome-icon icon="font" />
                </span>
                <span v-if="alteriNames">Kontaktnamen aus</span>
                <span v-else>Kontaktnamen ein</span>
              </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </form>
  </div>
</template>

<script>
import { defineComponent, ref, computed, onMounted, watch } from "vue";
import { useStore } from "@/store";

export default defineComponent({
  setup(props, { emit }) {
    const store = useStore();

    const toggle = () => {
      const btn = document.querySelector("#icon-span");
      const el = document.querySelector("#view-settings");
      if (el.classList.contains("invis")) {
        el.classList.remove("invis");
        btn.innerHTML = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 384 512"><!--! Font Awesome Pro 6.1.1 by @fontawesome - https://fontawesome.com License - https://fontawesome.com/license (Commercial License) Copyright 2022 Fonticons, Inc. --><path d="M352 352c-8.188 0-16.38-3.125-22.62-9.375L192 205.3l-137.4 137.4c-12.5 12.5-32.75 12.5-45.25 0s-12.5-32.75 0-45.25l160-160c12.5-12.5 32.75-12.5 45.25 0l160 160c12.5 12.5 12.5 32.75 0 45.25C368.4 348.9 360.2 352 352 352z"/></svg>`;
      } else {
        el.classList.add("invis");
        btn.innerHTML = `          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 384 512"><!--! Font Awesome Pro 6.1.1 by @fontawesome - https://fontawesome.com License - https://fontawesome.com/license (Commercial License) Copyright 2022 Fonticons, Inc. --><path d="M192 384c-8.188 0-16.38-3.125-22.62-9.375l-160-160c-12.5-12.5-12.5-32.75 0-45.25s32.75-12.5 45.25 0L192 306.8l137.4-137.4c12.5-12.5 32.75-12.5 45.25 0s12.5 32.75 0 45.25l-160 160C208.4 380.9 200.2 384 192 384z"/></svg>
`;
      }
    };

    return {
      pseudonyms: computed(() => store.state.pseudonym.active),
      togglePseudonyms: () => store.commit("pseudonym/toggle"),
      horizons: computed(() => store.state.view.horizons),
      toggleHorizons: () => store.commit("view/toggle", "horizons"),
      connections: computed(() => store.state.view.connections),
      toggleConnections: () => store.commit("view/toggle", "connections"),
      alteriNames: computed(() => store.state.view.alteriNames),
      toggleAlteriNames: () => store.commit("view/toggle", "alteriNames"),
      toggle,
    };
  },
});
</script>

<style lang="scss">
.invis {
  display: none;
  float: right;
}

.btn-toggle {
  display: inline-flex;
}

.right {
  float: right;
}
</style>
