<template>
  <p
    class="panel-block"
    v-bind:class="{ selected: alter.isSelected, alteriform: isEditMode }"
    v-on:click="toggleSelection()"
  >
    <span v-if="isEditMode">Kontakt bearbeiten</span>
    <span v-else>{{ alter.name }} / {{ alter.role }}</span>

    <span class="buttons are-small" v-if="alter.isSelected && ! isEditMode">
      <button class="button is-small" v-on:click.stop="isEditMode = true">
        <span class="icon is-small">
          <font-awesome-icon icon="pencil-alt" />
        </span>
      </button>
      <button class="button is-small">
        <span class="icon is-small">
          <font-awesome-icon icon="project-diagram" />
        </span>
      </button>
      <button class="button is-small">
        <span class="icon is-small">
          <font-awesome-icon icon="user-minus" />
        </span>
      </button>
    </span>

    <AlteriEditForm
      v-if="isEditMode"
      v-bind:alter="alter"
      @cancel="isEditMode = false"
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
  @Prop(Alter) private alter!: Alter;
  private isEditMode = false;

  constructor() {
    super();
    this.isEditMode = false;
  }

  toggleSelection() {
    if (! this.isEditMode) {
      this.alter.isSelected = !this.alter.isSelected
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
  background: rgba($color-secondary-1-0, .25);;
}

.panel-block.selected > span {
  font-weight: bold;
}

</style>
