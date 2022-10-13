<template>
  <p class="label" v-if="addingNewAlter">Kontakt hinzufügen</p>
  <p class="label" v-else>Kontakt bearbeiten</p>
  <form class="form" @submit.prevent="editAlterFinished">
    <div class="field has-text-danger" v-if="invalidPosition">
      <span class="icon is-small">
        <font-awesome-icon icon="exclamation-triangle" />
      </span>
      Die Position in der Karte muss noch festgelegt werden.
    </div>

    <div class="field is-horizontal">
      <div class="field-label is-normal">
        <label class="label">Name</label>
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
              type="text"
              placeholder="Vorname oder Spitzname"
            />
          </div>
          <p class="help">Pflichtfeld</p>
        </div>
      </div>
    </div>

    <div class="field is-horizontal">
      <div class="field-label is-normal">
        <label
          class="label"
          title="Soziale Rolle des Kontakts, Auswahlmöglichkeiten"
          >Rolle</label
        >
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
        <label class="label checkbox" for="chk-human">Mensch</label>
      </div>
      <div class="field-body">
        <label>
          <input id="chk-human" type="checkbox" v-model="alterHuman" />
        </label>
      </div>
    </div>

    <div v-if="alterHuman" class="field is-horizontal">
      <div class="field-label is-normal">
        <label
          class="label"
          title="biologisches und/oder soziales Geschlecht; Kategorisierung obliegt der Ankerperson"
          >Geschlecht</label
        >
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
        <label class="label">Kategorie</label>
      </div>
      <div class="field-body">
        <div class="field">
          <div class="control">
            <input
              class="input"
              :value="alterGender"
              @blur="commitEdit($event, 'currentGender')"
              type="text"
            />
          </div>
        </div>
      </div>
    </div>

    <div class="field is-horizontal">
      <div class="field-label is-normal">
        <label class="label" title="Optional,soziales Alter der Kontaktperson"
          >Alter</label
        >
      </div>
      <div class="field-body">
        <div class="field">
          <div class="control">
            <input
              class="input"
              :value="alter.age"
              @blur="commitEdit($event, 'age')"
              type="number"
            />
          </div>
        </div>
      </div>
    </div>

    <div class="field is-horizontal">
      <div class="field-label is-normal"></div>
      <div class="field-body">
        <label class="checkbox" title="Häkchen, falls Kontaktperson verstorben">
          <input type="checkbox" v-model="alterDeceased" />
          {{ SYMBOL_DECEASED }}verstorben
        </label>
      </div>
    </div>

    <div class="field is-horizontal">
      <div class="field-label">
        <label class="label" title="Aktualisierung der Verbindung"
          >Beziehung</label
        >
      </div>
      <div class="field-body">
        <div class="field">
          <fieldset :disabled="!isConnectable" class="control radio-group">
            <label
              class="radio"
              title="Beziehung wird aktuell gepflegt, aktualisierte Verbindung."
            >
              <input type="radio" v-model="alterEdgeType" value="1" />
              besteht
            </label>
            <label
              class="radio"
              title="Anker- und Kontaktperson begegnen sich in mehreren sozialen Rollen. Beziehung erfüllt mehrere Funktionen."
            >
              <input type="radio" v-model="alterEdgeType" value="2" />
              multiplex
            </label>
            <label
              class="radio"
              title="Ankerperson und diese Person pflegen zurzeit keinen Kontakt, Beziehung ist nicht aktualisiert (sondern beendet/unterbrochen)."
            >
              <input type="radio" v-model="alterEdgeType" value="0" />
              keine aktuelle Beziehung
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
          placeholder="Notizen zum Kontakt"
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
          {{ addingNewAlter ? "Nächster Kontakt" : "Schließen" }}
        </button>
      </p>
      <p class="control">
        <button
          v-if="addingNewAlter"
          class="button is-light"
          :disabled="invalidName || invalidPosition"
          type="button"
          @mouseup.prevent="editAlterFinished($event, false)"
        >
          Schließen
        </button>
      </p>
      <p class="control">
        <button
          v-if="addingNewAlter"
          class="button is-light"
          type="button"
          @mouseup.prevent="cancelAddAlter"
        >
          Abbrechen
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

type InputType = HTMLInputElement | HTMLTextAreaElement;

// gender & role options
// focus name input
// prohibit invalid name
// prohibit invalid position
// emit edit-finished

export default defineComponent({
  props: {
    // gets Alter as prop cp. ToDo demo
    alter: {
      type: Object,
      required: true,
    },
    // toogled after each click on the map (resets keyboard cursor)
    mapclicked: Boolean,
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

    const invalidPosition = computed(() => {
      return props.alter?.distance <= 0;
    });

    // getter & setter for select dropdown
    function accessor<type>(field: keyof Alter) {
      return computed({
        get(): type {
          return props.alter[field];
        },
        set(value: type) {
          const payload = {
            index: store.state.view.editIndex,
            changes: { [field]: value },
          };
          store.commit("editAlter", payload);
        },
      });
    }

    // generic event handlers from form to vuex
    const commitEdit = (evt: FocusEvent, field: keyof Alter) => {
      const value = (evt.target as InputType).value.trim();
      if (props.alter && value !== props.alter[field]) {
        const changes = { [field]: value };
        const payload = { index: store.state.view.editIndex, changes };
        store.commit("editAlter", payload);
      }
    };

    // special event handlers for role <-- temporily clear default role
    const focusRole = (evt: FocusEvent) => {
      if (props.alter.roleDefault) {
        (evt.target as InputType).value = "";
      }
    };

    const blurRole = (evt: FocusEvent) => {
      const value = (evt.target as InputType).value.trim();
      if (props.alter.roleDefault && value == "") {
        (evt.target as InputType).value = props.alter.role;
      } else {
        commitEdit(evt, "role");
      }
    };
    const invalidName = computed(() => {
      return alterNameInUI.value.trim().length === 0;
    });

    // apparently v-for needs this to be a data item
    const genderOptions = ref(Gender);
    const roleOptions = ref(Roles);

    // we need a DOM ref in order to focus
    const altername = ref<InstanceType<typeof HTMLInputElement> | null>(null);
    const domButton = ref<InstanceType<typeof HTMLButtonElement> | null>(null);

    watch(
      () => props.mapclicked,
      () => {
        if (altername.value != null) {
          (altername.value as HTMLInputElement).focus();
        }
      }
    );

    const editAlterFinished = (_event: Event, allowAddNext = true) => {
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
      alterHuman: accessor<boolean>("human"),
      alterGender: accessor<string>("currentGender"),
      alterDeceased: accessor<boolean>("deceased"),
      alterEdgeType: accessor<number>("edgeType"),
      isConnectable: computed(() => isConnectable(props.alter as Alter)),
      commitEdit,
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
