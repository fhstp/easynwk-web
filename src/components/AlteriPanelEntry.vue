<template>
  <div
    class="panel-block"
    v-bind:class="{ selected: isSelected, alteriform: isEditMode }"
    v-on:click="toggleSelection()"
  >
    <span v-if="!isEditMode" class="contact"
      >{{ alter.name }} / {{ alter.role }}</span
    >

    <span class="buttons are-small" v-if="!isEditMode && isAlterOpsAllowed">
      <button
        class="button is-small"
        title="Kontakt bearbeiten"
        @click.stop="edit()"
      >
        <span class="icon is-small">
          <font-awesome-icon icon="pencil-alt" />
        </span>
      </button>
      <button
        class="button is-small"
        title="Beziehungen des Kontakts bearbeiten"
        @click.stop="editConnections()"
      >
        <span class="icon is-small">
          <font-awesome-icon icon="people-arrows" />
        </span>
      </button>
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

    <AlteriEditForm v-if="isBaseForm" :alter="alter"></AlteriEditForm>
    <AlteriConnectionList
      v-if="isConnectionForm"
      :alter="alter"
    ></AlteriConnectionList>
  </div>
</template>

<script lang="ts">
import { defineComponent, computed } from "vue";
import { useStore } from "@/store";
import AlteriEditForm from "@/components/AlteriEditForm.vue";
import AlteriConnectionList from "@/components/AlteriConnectionList.vue";
import { TAB_BASE, TAB_CONNECTIONS } from "@/data/NWK";

export default defineComponent({
  components: { AlteriEditForm, AlteriConnectionList },
  props: {
    // gets Alter as prop cp. ToDo demo
    alter: {
      type: Object,
      required: true,
    },
    alterIndex: {
      type: Number,
      required: true,
    },
  },
  setup(props) {
    const store = useStore();

    const removeAlter = () => {
      store.commit("removeAlter", props.alterIndex);
    };

    const edit = () => {
      store.commit("openAlterForm", { alterIndex: props.alterIndex });
    };

    // handles isEditMode
    const isEditMode = computed(() => {
      return store.state.nwk.editIndex === props.alterIndex;
    });

    // handles isSelected
    const toggleSelection = () => {
      if (!isEditMode.value) {
        store.commit("view/toggleAlterSelected", props.alter.id);
      }
    };

    return {
      removeAlter,
      edit,
      editConnections: () => {
        store.commit("openAlterForm", {
          alterIndex: props.alterIndex,
          tab: TAB_CONNECTIONS,
        });
      },
      isSelected: computed(() =>
        store.getters["view/isSelected"](props.alter.id)
      ),
      isEditMode,
      isAlterOpsAllowed: computed(() => store.getters.editedAlterValid),
      isBaseForm: computed(
        () => isEditMode.value && store.state.nwk.editTab === TAB_BASE
      ),
      isConnectionForm: computed(
        () => isEditMode.value && store.state.nwk.editTab === TAB_CONNECTIONS
      ),
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
