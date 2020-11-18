<template>
  <p
    class="panel-block"
    v-bind:class="{ selected: alter.isSelected, alteriform: isEditMode }"
    v-on:click="toggleSelection()"
  >
    <span v-if="isEditMode">Kontakt bearbeiten</span>
    <span v-else>{{ alter.name }} / {{ alter.role }}</span>

    <span class="buttons are-small" v-if="alter.isSelected && !isEditMode">
      <button class="button is-small" v-on:click.stop="$emit('edit', alter)">
        <span class="icon is-small">
          <font-awesome-icon icon="pencil-alt" />
        </span>
      </button>
      <button class="button is-small">
        <span class="icon is-small">
          <font-awesome-icon icon="project-diagram" />
        </span>
      </button>
      <button
        class="button is-small"
        v-on:click.stop="$emit('remove-alter', alter)"
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
  </p>
</template>

<script lang="ts">
import { Component, Prop, Vue } from "vue-property-decorator";
import AlteriEditForm from "@/components/AlteriEditForm.vue";
import { Alter } from "@/data/Alter";

@Component({
  components: {
    AlteriEditForm
  }
})
export default class AlteriPanelEntry extends Vue {
  @Prop(Object) private alter!: Alter;
  @Prop(Object) private editedAlter!: Alter | null;

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
