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
    <span v-if="!isEditMode" class="contact">
      {{ displayName }}
      <span v-if="alter.age">/ {{ alter.age + " " }}</span>
      <span :class="{ autovalue: alter.roleDefault }">
        / {{ getTranslatedRole(alter.role) }}
      </span>
    </span>

    <span class="buttons are-small" v-if="!isEditMode && isAlterOpsAllowed">
      <button
        class="button is-small"
        :title="t('editcontact')"
        @click.stop="edit()"
      >
        <span class="icon is-small">
          <font-awesome-icon icon="pencil-alt" />
        </span>
      </button>
      <button
        class="button is-small"
        :title="t('editconnections')"
        :disabled="isConnectionDisabled"
        @click.stop="editConnections()"
      >
        <span class="icon is-small">
          <font-awesome-icon icon="people-arrows" />
        </span>
      </button>
      <button
        class="button is-small"
        :title="t('deletecontact')"
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
import { TAB_BASE, TAB_CONNECTIONS } from "@/store/sessionModule";
import { Alter, isConnectable } from "@/data/Alter";
import de from "@/de";
import en from "@/en";
import roles from "@/data/roles_en.json";

export default defineComponent({
  mixins: [de, en],
  methods: {
    t(prop: string) {
      return this[document.documentElement.lang][prop];
    },
    langIsGerman() {
      if (document.documentElement.lang == "de") return true;
      else return false;
    },
  },
  components: { AlteriEditForm, AlteriConnectionList },
  computed: {
    getTranslatedRole() {
      return () => {
        const { role } = this.alter;
        const translatedRole = roles.find((r) => r.german === role);
        const translatedEng = roles.find((r) => r.label === role);

        if (translatedRole) {
          return this.langIsGerman()
            ? translatedRole.german
            : translatedRole.label;
        } else if (translatedEng) {
          return this.langIsGerman()
            ? translatedEng.german
            : translatedEng.label;
        } else {
          return role;
        }
      };
    },
  },

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
      store.commit("session/openAlterForm", { alterIndex: props.alterIndex });
    };

    // handles isEditMode
    const isEditMode = computed(() => {
      return store.state.session.editIndex === props.alterIndex;
    });

    // handles isSelected
    const toggleSelection = () => {
      if (!isEditMode.value) {
        store.commit("session/selectSingleAlter", props.alter.id);
      }
    };

    return {
      removeAlter,
      edit,
      editConnections: () => {
        store.commit("session/openAlterForm", {
          alterIndex: props.alterIndex,
          tab: TAB_CONNECTIONS,
        });
      },
      isSelected: computed(() =>
        store.getters["session/isSelected"](props.alter.id)
      ),
      isConnectionDisabled: computed(
        () => !isConnectable(props.alter as Alter)
      ),
      isEditMode,
      isAlterOpsAllowed: computed(() => store.getters.editedAlterValid),
      isBaseForm: computed(
        () => isEditMode.value && store.state.session.editTab === TAB_BASE
      ),
      isConnectionForm: computed(
        () =>
          isEditMode.value && store.state.session.editTab === TAB_CONNECTIONS
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

.autovalue {
  color: #656565;
}
</style>
