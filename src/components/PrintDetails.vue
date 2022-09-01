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
  </div>
</template>

<script>
export default {
  name: "PrintDetails",
};
</script>

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
  },
  setup(props) {
    const store = useStore();

    return {
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
