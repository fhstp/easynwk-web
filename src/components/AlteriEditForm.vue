<template>
  <p class="label" v-if="addingNewAlter">{{ translate("contactsMsg3") }}</p>
  <p class="label" v-else>{{ translate("contactsMsg4") }}</p>
  <form class="form" @submit.prevent="editAlterFinished">
    <div class="field has-text-danger" v-if="invalidPosition">
      <span class="icon is-small">
        <font-awesome-icon icon="exclamation-triangle" />
      </span>
      {{ translate("positionMsg") }}
    </div>

    <div class="field is-horizontal">
      <div class="field-label is-normal">
        <label class="label">{{ translate("nameMsg") }}</label>
      </div>
      <div class="field-body">
        <div class="field">
          <div class="control">
            <input
              class="input"
              :class="{ 'is-danger': invalidName }"
              ref="altername"
              v-model="alterNameInUI"
              @blur="commitEdit($event, 'name')"
              @keyup.esc="cancelEdit($event, 'name')"
              type="text"
              :placeholder="translate('nameMsg2')"
            />
          </div>
          <p class="help">{{ translate("fieldMsg") }}</p>
        </div>
      </div>
    </div>

    <div class="field is-horizontal">
      <div class="field-label is-normal">
        <label class="label" title="{{ translate('titleMsg1')}}">{{
          translate("roleMsg")
        }}</label>
      </div>
      <div class="field-body">
        <div class="control">
          <input
            class="input"
            :class="{ autovalue: alter.roleDefault }"
            type="text"
            :value="alter.role"
            list="predefined-roles"
            @blur="blurRole"
            @focus="focusRole"
            @keyup.esc="cancelEdit($event, 'role')"
          />
          <!-- <span class="icon is-small is-right has-text-link">
            <font-awesome-icon icon="chevron-down" />
          </span> -->
          <datalist id="predefined-roles">
            <option v-for="value in roleOptions" :key="value" :value="value" />
          </datalist>
        </div>
      </div>
    </div>

    <div class="field is-horizontal">
      <div class="field-label">
        <label class="label checkbox" for="chk-human">{{
          translate("humanMsg")
        }}</label>
      </div>
      <div class="field-body">
        <label>
          <input id="chk-human" type="checkbox" v-model="alterHuman" />
        </label>
      </div>
    </div>

    <div v-if="alterHuman" class="field is-horizontal">
      <div class="field-label is-normal">
        <label class="label" title="{{ translate('genderMsg1')}}">{{
          translate("genderMsg2")
        }}</label>
      </div>
      <div class="field-body">
        <div class="control">
          <div class="select is-fullwidth">
            <select
              :class="{ autovalue: alter.genderDefault }"
              v-model="alterGender"
            >
              <option v-for="value in genderOptions" :key="value">
                {{ value }}
              </option>
            </select>
          </div>
        </div>
      </div>
    </div>

    <div v-else class="field is-horizontal">
      <div class="field-label is-normal">
        <label class="label">{{ translate("categoryMsg") }}</label>
      </div>
      <div class="field-body">
        <div class="field">
          <div class="control">
            <input
              class="input"
              :value="alterGender"
              @blur="commitEdit($event, 'currentGender')"
              @keyup.esc="cancelEdit($event, 'currentGender')"
              type="text"
            />
          </div>
        </div>
      </div>
    </div>

    <div class="field is-horizontal">
      <div class="field-label is-normal">
        <label class="label" title="{{ translate('ageMsg1')}}">{{
          translate("ageMsg2")
        }}</label>
      </div>
      <div class="field-body">
        <div class="field">
          <div class="control">
            <input
              class="input"
              :value="alter.age"
              @blur="commitEdit($event, 'age')"
              @keyup.esc="cancelEdit($event, 'age')"
              type="text"
            />
          </div>
        </div>
      </div>
    </div>

    <div class="field is-horizontal">
      <div class="field-label is-normal"></div>
      <div class="field-body">
        <label class="checkbox" title="{{ translate('deadMsg2')}}">
          <input type="checkbox" v-model="alterDeceased" />
          {{ SYMBOL_DECEASED }}{{ translate("deadMsg2") }}
        </label>
      </div>
    </div>

    <div class="field is-horizontal">
      <div class="field-label">
        <label class="label" title="{{ translate('connectionMsg')}}">{{
          translate("connectionMsg2")
        }}</label>
      </div>
      <div class="field-body">
        <div class="field">
          <fieldset :disabled="!isConnectable" class="control radio-group">
            <label class="radio" title="{{ translate('connectionMsg3')}}">
              <input type="radio" v-model="alterEdgeType" value="1" />
              {{ translate("connectionMsg4") }}
            </label>
            <label class="radio" title="{{ translate('connectionMsg5')}}">
              <input type="radio" v-model="alterEdgeType" value="2" />
              {{ translate("connectionMsg6") }}
            </label>
            <label class="radio" title="{{ translate('connectionMsg7')}}">
              <input type="radio" v-model="alterEdgeType" value="0" />
              {{ translate("connectionMsg8") }}
            </label>
          </fieldset>
        </div>
      </div>
    </div>

    <div class="field">
      <div class="control">
        <textarea
          class="textarea is-small"
          :value="alter.note"
          @blur="commitEdit($event, 'note')"
          @keyup.esc="cancelEdit($event, 'note')"
          :placeholder="translate('notesMsg')"
        ></textarea>
      </div>
    </div>

    <div class="field is-grouped is-grouped-centered">
      <!-- <p class="control">
          <a class="button is-primary">
            Speichern
          </a>
        </p> -->
      <p class="control">
        <button
          class="button is-primary"
          ref="domButton"
          :disabled="invalidName || invalidPosition"
        >
          {{ addingNewAlter ? translate("contactsMsg5") : "Schließen" }}
        </button>
      </p>
      <p class="control">
        <button
          v-if="addingNewAlter"
          class="button is-light"
          :disabled="invalidName || invalidPosition"
          type="button"
          @mouseup.prevent="editAlterFinished(false)"
        >
          {{ translate("closeMsg") }}
        </button>
      </p>
      <p class="control">
        <button
          v-if="addingNewAlter"
          class="button is-light"
          type="button"
          @mouseup.prevent="cancelAddAlter"
        >
          {{ translate("cancelMsg") }}
        </button>
      </p>
    </div>
  </form>
</template>

<script lang="ts">
import { defineComponent, ref, computed, onMounted, watch } from "vue";
import { useStore } from "@/store";

import { Alter, isConnectable } from "@/data/Alter";
import { Gender } from "@/data/Gender";
import { Roles } from "@/data/Roles";
import { SYMBOL_DECEASED } from "@/assets/utils";
import de from "@/de";
import en from "@/en";
type InputType = HTMLInputElement | HTMLTextAreaElement;

// gender & role options
// focus name input
// prohibit invalid name
// prohibit invalid position
// emit edit-finished

export default defineComponent({
  mixins: [de, en],
  methods: {
    translate(prop: string) {
      console.log(document.documentElement.lang);
      return this[document.documentElement.lang][prop];
    },
  },
  data() {
    return {
      lang: "de",
    };
  },
  props: {
    // gets Alter as prop cp. ToDo demo
    alter: {
      type: Object,
      required: true,
    },
  },
  setup(props) {
    const store = useStore();

    const addingNewAlter = ref(!(props.alter?.name.length > 0));

    // name field is special because it must not be empty
    // the data item is only used for validity check & never stored
    const alterNameInUI = ref(props.alter?.name);

    const alterNameInStore = computed(() => {
      return props.alter?.name;
    });

    // it must be kept in sync (e.g. when loading a NWK)
    watch(alterNameInStore, (newValue) => {
      alterNameInUI.value = newValue;
    });

    const invalidName = computed(() => {
      return alterNameInUI.value.trim().length === 0;
    });

    const invalidPosition = computed(() => {
      return props.alter?.distance <= 0;
    });

    // getter & setter for select dropdown
    function accessor(field: keyof Alter) {
      return computed({
        get() {
          return props.alter[field];
        },
        set(value: string) {
          const payload = {
            index: store.state.view.editIndex,
            changes: { [field]: value },
          };
          store.commit("editAlter", payload);
        },
      });
    }

    // generic event handlers from form to vuex
    const commitEdit = (evt: InputEvent, field: keyof Alter) => {
      const value = (evt.target as InputType).value.trim();
      if (props.alter && value !== props.alter[field]) {
        const changes = { [field]: value };
        const payload = { index: store.state.view.editIndex, changes };
        store.commit("editAlter", payload);
      }
    };

    const cancelEdit = (evt: InputEvent, field: keyof Alter) => {
      (evt.target as InputType).value = (props.alter as Alter)[
        field
      ].toString();
    };

    // special event handlers for role <-- temporily clear default role
    const focusRole = (evt: InputEvent) => {
      if (props.alter.roleDefault) {
        (evt.target as InputType).value = "";
      }
    };

    const blurRole = (evt: InputEvent) => {
      const value = (evt.target as InputType).value.trim();
      if (props.alter.roleDefault && value == "") {
        (evt.target as InputType).value = props.alter.role;
      } else {
        commitEdit(evt, "role");
      }
    };

    // apparently v-for needs this to be a data item
    const genderOptions = ref(Gender);
    const roleOptions = ref(Roles);

    // we need a DOM ref in order to focus
    const altername = ref<InstanceType<typeof HTMLInputElement> | null>(null);
    const domButton = ref<InstanceType<typeof HTMLButtonElement> | null>(null);

    watch(
      () => props.alter?.distance,
      () => {
        if (altername.value != null) {
          (altername.value as HTMLInputElement).focus();
        }
      }
    );

    const editAlterFinished = (allowAddNext = true) => {
      // TODO     if (!this.invalidPosition && !this.invalidName) {
      if (invalidName.value) {
        // moving mouse cursor does not work
        // apparently editEgoFinished is not even called in the invalid state
        if (altername.value != null) {
          (altername.value as HTMLInputElement).focus();
        }
      } else {
        (domButton.value as HTMLButtonElement).focus();
        store.commit("view/closeAlterForm");

        if (addingNewAlter.value && allowAddNext) {
          store.commit("addAlter");
        }
      }
    };

    const cancelAddAlter = () => {
      if (addingNewAlter.value) {
        store.commit("cancelAddAlter", store.state.view.editIndex);
      }
    };

    onMounted(() => {
      // the DOM element will be assigned to the ref after initial render
      if (altername.value != null) {
        (altername.value as HTMLInputElement).focus();
      }
    });

    return {
      addingNewAlter,
      alterNameInUI,
      invalidName,
      invalidPosition,
      alterHuman: accessor("human"),
      alterGender: accessor("currentGender"),
      alterDeceased: accessor("deceased"),
      alterEdgeType: accessor("edgeType"),
      isConnectable: computed(() => isConnectable(props.alter as Alter)),
      commitEdit,
      cancelEdit,
      focusRole,
      blurRole,
      genderOptions,
      roleOptions,
      editAlterFinished,
      cancelAddAlter,
      altername,
      domButton,
      SYMBOL_DECEASED,
    };
  },
});
</script>

<style scoped lang="scss">
div.form {
  margin-top: 0.5em;
}

/* to hide datalist arrow in webkit (https://codepen.io/airen/pen/arGXvz) */
input::-webkit-calendar-picker-indicator {
  display: none;
}

.radio-group {
  display: flex;
  flex-wrap: wrap;
  justify-content: space-between;
}

.radio + .radio {
  margin-left: 0;
}

@import "~bulma/sass/base/_all.sass";
.autovalue {
  color: $grey-light;
}

.autovalue:focus {
  color: $text-strong;
}

select > option {
  color: $text-strong;
}
</style>
