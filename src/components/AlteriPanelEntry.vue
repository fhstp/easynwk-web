<template>
  <div
    class="panel-block"
    v-bind:class="{ selected: alter.isSelected, alteriform: isEditMode }"
    v-on:click="toggleSelection()"
  >
    <div class="modal" :class="{ 'is-active': confirmRemove }">
      <div class="modal-background"></div>
      <div class="modal-card">
        <header class="modal-card-head">
          <p>
            Soll der Kontakt <b>{{ alter.name }}</b> wirklich entfernt werden?
          </p>
        </header>
        <footer class="modal-card-foot">
          <button
            class="button is-primary"
            v-on:click.stop="$emit('remove-alter', alter)"
          >
            Entfernen
          </button>
          <button class="button" v-on:click.stop="confirmRemove = false">
            Abbrechen
          </button>
        </footer>
      </div>
    </div>

    <span v-if="isEditMode">Kontakt bearbeiten</span>
    <span v-else>{{ alter.name }} / {{ alter.role }}</span>

    <span class="buttons are-small" v-if="alter.isSelected && !isEditMode">
      <button
        class="button is-small"
        title="Kontakt bearbeiten"
        v-on:click.stop="$emit('edit', alter)"
      >
        <span class="icon is-small">
          <font-awesome-icon icon="pencil-alt" />
        </span>
      </button>
      <!--      <button class="button is-small" title="Beziehungen des Kontakts bearbeiten (nicht nicht verfügbar)">
        <span class="icon is-small">
          <font-awesome-icon icon="project-diagram" />
        </span>
      </button> -->
      <button
        class="button is-small"
        title="Kontakt entfernen"
        v-on:click.stop="confirmRemove = true"
      >
        <span class="icon is-small">
          <font-awesome-icon icon="user-minus" />
        </span>
      </button>
    </span>

    <AlteriEditForm
      v-if="isEditMode"
      v-bind:alter="alter"
      @edit-finished="$emit('edit-finished')"
    ></AlteriEditForm>
  </div>
</template>

<script lang="ts">
import { Options, Vue } from "vue-class-component";
// import { Component, Prop, Vue } from "vue-property-decorator";
import AlteriEditForm from "@/components/AlteriEditForm.vue";
import { Alter } from "@/data/Alter";

@Options({
  components: {
    AlteriEditForm
  },
  props: {
    alter: Object,
    editedAlter: Object
  }
})
export default class AlteriPanelEntry extends Vue {
  private alter!: Alter;
  private editedAlter!: Alter | null;
  private confirmRemove = false;

  constructor() {
    super();
  }

  get isEditMode() {
    return this.editedAlter != null && this.editedAlter.id === this.alter.id;
  }

  toggleSelection() {
    if (!this.isEditMode) {
      this.alter.isSelected = !this.alter.isSelected;
    }
  }
}
</script>

<style scoped lang="scss">
.panel-block > .buttons {
  margin-left: auto;
}

.panel-block.alteriform {
  display: block;
}

.panel-block.selected {
  background: rgba($color-secondary-1-0, 0.25);
}

.panel-block.selected > span {
  font-weight: bold;
}
</style>
