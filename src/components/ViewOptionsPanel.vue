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
            <div class="columns is-multiline">
              <div class="column is-half-desktop">
                <div class="control">
                  <label class="checkbox">
                    <input type="checkbox" @click.stop="toggleHorizons" />
                    <span class="icon">
                      <font-awesome-icon icon="rss" />
                    </span>
                    <span>Horizonte</span>
                  </label>
                </div>
                <div class="control">
                  <label class="checkbox">
                    <input type="checkbox" @click.stop="toggleAge" />
                    <span>Alter der Kontakte</span>
                  </label>
                </div>
                <div class="control">
                  <label class="checkbox">
                    <input type="checkbox" @click.stop="toggleRoleShort" />
                    <span>Rolle der Kontakte</span>
                  </label>
                </div>
                <br />
                <div class="control">
                  <button class="button" @click.stop="togglePseudonyms">
                    <span class="icon">
                      <font-awesome-icon icon="user-secret" />
                    </span>
                    <span v-if="pseudonyms">De-Anonymisieren</span>
                    <span v-else>Anonymisieren</span>
                    <span></span>
                  </button>
                </div>
              </div>
              <div class="column is-half-desktop">
                <div class="control">
                  <label class="checkbox">
                    <input
                      type="checkbox"
                      @click.stop="toggleAlteriNames"
                      checked
                    />
                    <span class="icon">
                      <font-awesome-icon icon="font" />
                    </span>
                    <span>Kontaktnamen</span>
                  </label>
                </div>
                <div class="control">
                  <label class="checkbox">
                    <input type="checkbox" @click.stop="toggleConnections" />
                    <span class="icon">
                      <font-awesome-icon icon="project-diagram" />
                    </span>
                    <span>Verbindungen</span>
                  </label>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
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
      showAge: computed(() => store.state.view.ageInNwk),
      toggleAge: () => store.commit("view/toggle", "ageInNwk"),
      showRole: computed(() => store.state.view.roleInNwk),
      toggleRoleShort: () => store.commit("view/toggle", "roleInNwk"),
    };
  },
});
</script>

<style scoped>
.right {
  float: right;
}
</style>
