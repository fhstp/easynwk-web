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
          <button class="button is-primary" v-on:click.stop="removeAlter">
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
        v-on:click.stop="edit()"
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

    <AlteriEditForm v-if="isEditMode" :alter="alter"></AlteriEditForm>
  </div>
</template>

<script lang="ts">
import { defineComponent, ref, computed } from "vue";
import { useStore } from "@/store";
import AlteriEditForm from "@/components/AlteriEditForm.vue";
import { Alter } from "@/data/Alter";

export default defineComponent({
  components: { AlteriEditForm },
  props: {
    // gets Alter as prop cp. ToDo demo
    alter: Object,
    alterIndex: Number,
  },
  setup(props) {
    const store = useStore();

    // TODO confirm dialog not needed if undo available
    const confirmRemove = ref(false);

    const removeAlter = () => {
      store.commit("removeAlter", props.alterIndex);
    };

    const edit = () => {
      store.commit("openAlterForm", props.alterIndex);
    };

    // handles isEditMode
    const isEditMode = computed(() => {
      return store.state.nwk.editIndex === props.alterIndex;
    });

    // handles isSelected
    // TODO move selection out of NWK state?
    const toggleSelection = () => {
      if (!isEditMode.value) {
        const alter2 = props.alter as Alter;
        const changes = { isSelected: !alter2.isSelected };
        const payload = { index: props.alterIndex, changes };
        store.commit("editAlter", payload);
      }
    };

    return {
      confirmRemove,
      removeAlter,
      edit,
      isEditMode,
      toggleSelection,
    };
  },
});
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
