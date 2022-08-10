<template>
  <nav class="panel">
    <p class="panel-heading">
      <span>{{ translate("contactsMsg6") }}</span>
      <span class="buttons are-small">
        <button
          class="button"
          title="{{ translate('contactsMsg3') }}"
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
      {{ translate("contactsMsg7") }}<br />
      {{ translate("contactsMsg8") }}
      <span class="icon is-small">
        <font-awesome-icon icon="user-plus" />
      </span>
      {{ translate("contactsMsg9") }}
    </p>

    <AlteriPanelEntry
      v-for="(alter, i) in alteri"
      :key="alter.id"
      :alter="alter"
      :alterIndex="i"
    ></AlteriPanelEntry>
  </nav>
</template>

<script lang="ts">
import { defineComponent, computed } from "vue";
import { useStore } from "@/store";

import AlteriPanelEntry from "@/components/AlteriPanelEntry.vue";
import de from "@/de";
import en from "@/en";

// handle from below: edit, edit-finished, <del>remove-alter</del> --> vuex store
// manages the edited-alter (from above or by itself) --> vuex store

export default defineComponent({
  mixins: [de, en],
  methods: {
    translate(prop: string) {
      console.log(document.documentElement.lang);
      return this[document.documentElement.lang][prop];
    },
  },
  data() {
    return {
      lang: "de",
    };
  },
  components: { AlteriPanelEntry },
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
