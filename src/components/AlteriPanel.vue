<template>
  <nav class="panel">
    <p class="panel-heading">
      <span>Kontakte</span>
      <span class="buttons are-small">
        <button
          class="button"
          title="Kontakt hinzufügen"
          v-on:click.stop="addAlter"
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
    <p
      class="panel-block"
      style="display:block"
      v-if="alteri.getAlteri().length < 1"
    >
      Noch keine Kontakte vorhanden.<br />
      Klicken Sie auf den Button mit dem
      <span class="icon is-small">
        <font-awesome-icon icon="user-plus" />
      </span>
      Symbol, um Kontakte in der Netzwerkkarte anzulegen.
    </p>

    <AlteriPanelEntry
      v-for="alter in alteri.getAlteri()"
      :key="alter.id"
      v-bind:alter="alter"
      v-bind:editedAlter="editedAlter"
      @edit="$emit('edit', alter)"
      @edit-finished="$emit('edit-finished')"
      @remove-alter="removeAlter"
    ></AlteriPanelEntry>
  </nav>
</template>

<script lang="ts">
import { Options, Vue } from "vue-class-component";
// import { Component, Prop, Vue } from "vue-property-decorator";
import AlteriPanelEntry from "@/components/AlteriPanelEntry.vue";
import { Alter, initAlter } from "@/data/Alter";
import { AlteriList } from "@/data/AlteriList";

@Options({
  components: {
    AlteriPanelEntry
  },
  props: {
    alteri: AlteriList,
    editedAlter: Object
  },
})
export default class AlteriPanel extends Vue {
  private alteri!: AlteriList;
  private editedAlter!: Alter | null;

  constructor() {
    super();
  }

  addAlter() {
    const newAlter = initAlter();
    this.alteri.addAlter(newAlter);
    this.$emit("edit", newAlter);
  }

  removeAlter(alterToRemove: Alter) {
    // TODO modal dialog to confirm removal?
    this.alteri.removeAlter(alterToRemove);
  }
}
</script>

<style scoped>
.panel-heading .buttons {
  float: right;
}

.panel-block,
.panel-heading,
.panel-tabs {
  border-bottom: 1px solid #dbdbdb;
  border-left: 1px solid #dbdbdb;
  border-right: 1px solid #dbdbdb;
}
</style>
