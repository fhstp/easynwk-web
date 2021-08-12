<template>
  <div
    class="panel-block"
    v-bind:class="{ selected: alter.isSelected, alteriform: isEditMode }"
    v-on:click="toggleSelection()"
  >
    <span v-if="isEditMode" class="label">Kontakt bearbeiten</span>
    <span v-else class="contact">{{ alter.name }} / {{ alter.role }}</span>

    <span class="buttons are-small" v-if="!isEditMode && isAlterOpsAllowed">
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
        v-on:click.stop="removeAlter"
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
import { defineComponent, computed } from "vue";
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
      removeAlter,
      edit,
      isEditMode,
      isAlterOpsAllowed: computed(() => store.getters.editedAlterValid),
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

/* show buttons only when mouseover */
.panel-block > .buttons {
  display: none;
}
.panel-block:hover > .buttons {
  display: inline;
}

/* make text label as high as buttons to avoid height change */
.contact {
  padding: 3px 0px;
}
</style>
