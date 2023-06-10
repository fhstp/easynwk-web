<template>
  <nav class="panel">
    <p class="panel-heading">
      <span>Kontakte</span>
      <span class="buttons are-small">
        <button
          class="button"
          title="Kontakt hinzufügen"
          @click.stop="addAlter"
          :disabled="!isAlterOpsAllowed"
        >
          <span class="icon is-small">
            <font-awesome-icon icon="user-plus" />
          </span>
        </button>
        <!-- <button class="button">
          <span class="icon is-small">
            <font-awesome-icon icon="exchange-alt" rotation="90" />
          </span>
        </button> -->
      </span>
    </p>
    <p class="panel-block" style="display: block" v-if="alteri.length < 1">
      Noch keine Kontakte vorhanden.<br />
      Klicken Sie auf den Button mit dem
      <span class="icon is-small">
        <font-awesome-icon icon="user-plus" />
      </span>
      Symbol, um Kontakte in der Netzwerkkarte anzulegen.
    </p>

    <AlteriPanelEntry
      v-for="(alter, i) in filteredAlteri"
      :key="alter.id"
      :alter="alter"
      :alterIndex="i"
      :mapclicked="mapclicked"
    ></AlteriPanelEntry>
  </nav>
</template>

<script lang="ts">
import { defineComponent, computed } from "vue";
import { useStore } from "@/store";

import AlteriPanelEntry from "@/components/AlteriPanelEntry.vue";

export default defineComponent({
  components: { AlteriPanelEntry },
  props: {
    mapclicked: Boolean,
  },
  setup() {
    const store = useStore();

    const alteri = computed(() => store.state.nwk.alteri);

    const addAlter = () => {
      store.commit("addAlter");
    };

    const filteredAlteri = computed(() => {
      const currentVersionId = store.state.nwk.currentVersion.id;
      return alteri.value.filter((alter) => alter.version === currentVersionId);
    });

    return {
      alteri,
      addAlter,
      isAlterOpsAllowed: computed(() => store.getters.editedAlterValid),
      filteredAlteri,
    };
  },
});
</script>

<style scoped>
.panel-heading .buttons {
  float: right;
}
</style>
