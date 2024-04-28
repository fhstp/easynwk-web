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
            <div class="field is-grouped is-grouped-multiline">
              <div class="control">
                <label class="checkbox">
                  <input
                    type="checkbox"
                    v-model="pseudonyms"
                    @change="togglePseudonyms"
                  />
                  <span class="icon">
                    <font-awesome-icon icon="user-secret" />
                  </span>
                  <span>{{
                    pseudonyms ? "De-Anonymisieren" : "Anonymisieren"
                  }}</span>
                </label>

                <br />

                <label class="checkbox">
                  <input type="checkbox" @click.stop="toggleHorizons" />
                  <span class="icon">
                    <font-awesome-icon icon="rss" />
                  </span>
                  <span v-if="horizons">Horizonte aus</span>
                  <span v-else>Horizonte ein</span>
                </label>

                <br />

                <label class="checkbox">
                  <input type="checkbox" @click.stop="toggleAlteriNames" />
                  <span class="icon">
                    <font-awesome-icon icon="font" />
                  </span>
                  <span v-if="alteriNames">Kontaktnamen aus</span>
                  <span v-else>Kontaktnamen ein</span>
                </label>

                <br />

                <label class="checkbox">
                  <input type="checkbox" @click.stop="toggleAge" />
                  <span class="icon">
                    <font-awesome-icon icon="info" />
                  </span>
                  <span v-if="showAge">Alter der Kontakte aus</span>
                  <span v-else>Alter der Kontakte ein</span>
                </label>

                <br />

                <label class="checkbox">
                  <input type="checkbox" @click.stop="toggleRoleShort" />
                  <span class="icon">
                    <font-awesome-icon icon="info" />
                  </span>
                  <span v-if="showRole">Rolle der Kontakte aus</span>
                  <span v-else>Rolle der Kontakte ein</span>
                </label>

                <br />
                <br />

                <button class="button" @click.stop="toggleConnections">
                  <span class="icon">
                    <font-awesome-icon icon="project-diagram" />
                  </span>
                  <span v-if="connections">Verbindungen aus</span>
                  <span v-else>Verbindungen ein</span>
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
      showAge: computed(() => store.state.view.ageInNwk),
      toggleAge: () => store.commit("view/toggle", "ageInNwk"),
      showRole: computed(() => store.state.view.roleInNwk),
      toggleRoleShort: () => store.commit("view/toggle", "roleInNwk"),
    };
  },
});
</script>

<style lang="scss">
.right {
  float: right;
}
</style>
