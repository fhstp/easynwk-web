<template>
  <div class="panel">
    <p class="panel-heading" @click.stop="isOpen = !isOpen">
      <span>Ansichtseinstellungen</span>
      <span class="icon is-medium clickAble right">
        <font-awesome-icon v-if="isOpen" icon="chevron-up" />
        <font-awesome-icon v-else icon="chevron-down" size="1x" />
      </span>
    </p>
    <div class="panel-block form">
      <div class="field is-horizontal">
        <div class="field-body">
          <div id="view-settings" class="field" v-if="isOpen">
            <div class="control">
              <div class="buttons">
                <button class="button" @click.stop="togglePseudonyms">
                  <span class="icon">
                    <font-awesome-icon icon="user-secret" />
                  </span>
                  <span v-if="pseudonyms">De-Anonymisieren</span>
                  <span v-else>Anonymisieren</span>
                  <span></span>
                </button>

                <button class="button" @click.stop="toggleHorizons">
                  <span class="icon">
                    <font-awesome-icon icon="rss" />
                  </span>
                  <span v-if="horizons">Horizonte aus</span>
                  <span v-else>Horizonte ein</span>
                </button>

                <br />

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

                <button class="button" @click.stop="toggleDetails">
                  <span class="icon">
                    <font-awesome-icon icon="font" />
                  </span>
                  <span v-if="details">Details ein</span>
                  <span v-else>Details aus</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent, ref, computed } from "vue";
import { useStore } from "@/store";

export default defineComponent({
  setup() {
    const store = useStore();

    const isOpen = ref(false);

    return {
      pseudonyms: computed(() => store.state.pseudonym.active),
      togglePseudonyms: () => store.commit("pseudonym/toggle"),
      horizons: computed(() => store.state.view.horizons),
      toggleHorizons: () => store.commit("view/toggle", "horizons"),
      connections: computed(() => store.state.view.connections),
      toggleConnections: () => store.commit("view/toggle", "connections"),
      alteriNames: computed(() => store.state.view.alteriNames),
      toggleAlteriNames: () => store.commit("view/toggle", "alteriNames"),
      isOpen: isOpen,
      details: computed(() => store.state.view.details),
      toggleDetails: () => store.commit("view/toggle", "details")
    };
  },
});
</script>

<style lang="scss">
.right {
  float: right;
}
</style>
