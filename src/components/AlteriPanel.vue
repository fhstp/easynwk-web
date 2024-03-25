<template>
  <nav class="panel">
    <p class="panel-heading">
      <span>{{ t("contacts") }}</span>
      <span class="buttons are-small">
        <button
          class="button"
          :title="t('addcontact')"
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
      {{ t("nocontactsyet1") }}<br />
      {{ t("nocontactsyet2") }}
      <span class="icon is-small">
        <font-awesome-icon icon="user-plus" />
      </span>
      {{ t("nocontactsyet3") }}
    </p>

    <AlteriPanelEntry
      v-for="(alter, i) in alteri"
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
import de from "@/de";
import en from "@/en";

import AlteriPanelEntry from "@/components/AlteriPanelEntry.vue";

// handle from below: edit, edit-finished, <del>remove-alter</del> --> vuex store
// manages the edited-alter (from above or by itself) --> vuex store

export default defineComponent({
  mixins: [de, en],
  methods: {
    t(prop: string) {
      return this[document.documentElement.lang][prop];
    },
  },
  data() {
    return {
      lang: "de",
    };
  },
  components: { AlteriPanelEntry },
  props: {
    // toogled after each click on the map (resets keyboard cursor)
    mapclicked: Boolean,
  },
  setup() {
    const store = useStore();

    // knows list of Alter from vuex
    const alteri = computed(() => store.state.nwk.alteri);

    // button to add Alter
    const addAlter = () => {
      store.commit("addAlter");
    };

    return {
      alteri,
      addAlter,
      isAlterOpsAllowed: computed(() => store.getters.editedAlterValid),
    };
  },
});
</script>

<style scoped>
.panel-heading .buttons {
  float: right;
}
</style>
