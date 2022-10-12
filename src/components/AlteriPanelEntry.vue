<template>
  <div
    class="panel-block"
    v-bind:class="{
      selected: isSelected,
      alteriform: isEditMode,
      clickAble: !isEditMode,
    }"
    v-on:click="toggleSelection()"
  >
    <span v-if="!isEditMode" class="contact"
      >{{ displayName }}
      <span v-if="alter.age">/ {{ alter.age + " " }} </span>
      <span :class="{ autovalue: alter.roleDefault }"
        >/ {{ alter.role }}</span
      ></span
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
        :disabled="isConnectionDisabled"
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

    <AlteriEditForm
      v-if="isBaseForm"
      :alter="alter"
      :mapclicked="mapclicked"
    ></AlteriEditForm>
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
import { TAB_BASE, TAB_CONNECTIONS } from "@/store/viewOptionsModule";
import { Alter, isConnectable } from "@/data/Alter";

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
    // toogled after each click on the map (resets keyboard cursor)
    mapclicked: Boolean,
  },
  setup(props) {
    const store = useStore();

    const removeAlter = () => {
      store.commit("removeAlter", props.alterIndex);
    };

    const edit = () => {
      store.commit("view/openAlterForm", { alterIndex: props.alterIndex });
    };

    // handles isEditMode
    const isEditMode = computed(() => {
      return store.state.view.editIndex === props.alterIndex;
    });

    // handles isSelected
    const toggleSelection = () => {
      if (!isEditMode.value) {
        store.commit("view/selectSingleAlter", props.alter.id);
      }
    };

    return {
      removeAlter,
      edit,
      editConnections: () => {
        store.commit("view/openAlterForm", {
          alterIndex: props.alterIndex,
          tab: TAB_CONNECTIONS,
        });
      },
      isSelected: computed(() =>
        store.getters["view/isSelected"](props.alter.id)
      ),
      isConnectionDisabled: computed(
        () => !isConnectable(props.alter as Alter)
      ),
      isEditMode,
      isAlterOpsAllowed: computed(() => store.getters.editedAlterValid),
      isBaseForm: computed(
        () => isEditMode.value && store.state.view.editTab === TAB_BASE
      ),
      isConnectionForm: computed(
        () => isEditMode.value && store.state.view.editTab === TAB_CONNECTIONS
      ),
      toggleSelection,
      displayName: computed(() => store.getters["displayName"](props.alter)),
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
  background: rgba($fhstpblue, 0.2);
}

.panel-block.selected > span {
  font-weight: bold;
}

@media (hover: hover) and (pointer: fine) {
  /* show buttons only when mouseover */
  .panel-block > .buttons {
    display: none;
  }
  .panel-block:hover > .buttons {
    display: inline;
  }
}

/* make text label as high as buttons to avoid height change */
.contact {
  padding: 3px 0px;
}

@import "~bulma/sass/base/_all.sass";
.autovalue {
  color: $grey-light;
}
</style>
