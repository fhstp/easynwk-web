<template>
  <p class="label" v-if="addingNewAlter">{{ t("addcontact") }}</p>
  <p class="label" v-else>{{ t("editcontact") }}</p>
  <form class="form" @submit.prevent="editAlterFinished">
    <div class="field has-text-danger" v-if="invalidPosition">
      <span class="icon is-small">
        <font-awesome-icon icon="exclamation-triangle" />
      </span>
      {{ t("positiononmap") }}
    </div>

    <div class="field is-horizontal">
      <div class="field-label is-normal">
        <label class="label">{{ t("name") }}</label>
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
              :placeholder="t('nickname')"
            />
          </div>
          <p class="help">{{ t("mandatoryfield") }}</p>
        </div>
      </div>
    </div>

    <div class="field is-horizontal">
      <div class="field-label is-normal">
        <label class="label" :title="t('socialrole')">{{ t("role") }}</label>
      </div>
      <div class="field-body">
        <div class="control">
          <input
            class="input"
            :class="{ autovalue: alter.roleDefault }"
            type="text"
            :value="localizedRole"
            list="predefined-roles"
            @blur="blurRole"
            @focus="focusRole"
          />

          <!-- <span class="icon is-small is-right has-text-link">
            <font-awesome-icon icon="chevron-down" />
          </span> -->
          <datalist id="predefined-roles" :key="langIsGerman() ? 'de' : 'en'">
            <option
              v-for="value in langIsGerman() ? roleOptions : engRoleOptions"
              :key="value.german"
            >
              {{ value.label }}
            </option>
          </datalist>
        </div>
      </div>
    </div>

    <div class="field is-horizontal" v-if="emoji">
      <div class="field-label is-normal">
        <label class="label">Emoji</label>
      </div>
      <br />
      <div class="field-body">
        <div>
          <div style="display: flex; align-items: center; margin-top: 10px">
            <div>
              {{
                selectedEmoji == null || selectedEmoji.length < 1
                  ? t("noemoji")
                  : selectedEmoji
              }}
            </div>
          </div>
        </div>
      </div>
    </div>

    <div class="field is-horizontal" v-if="emoji">
      <div class="field-label is-normal">
        <label class="label">{{ t("selectEmoji") }}</label>
      </div>
      <div class="field-body">
        <div class="dropdown" :class="{ 'is-active': showEmojiPicker }">
          <div>
            <button
              type="button"
              class="button is-small"
              @click="toggleEmojiPicker"
            >
              <span>{{ t("selectemoji") }}</span>
            </button>
            <button
              v-if="selectedEmoji != null && selectedEmoji.length > 0"
              @click="removeEmoji"
              type="button"
              class="button is-small"
              style="margin-left: 10px"
            >
              <span>{{ t("removeemoji") }}</span>
            </button>
          </div>
          <div class="dropdown-menu">
            <div>
              <div>
                <EmojiPicker
                  v-model="selectedEmoji"
                  :native="true"
                  :disableSkinTones="true"
                  @select="onSelectEmoji"
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <div class="field is-horizontal">
      <div class="field-label">
        <label class="label checkbox" for="chk-human">{{ t("human") }}</label>
      </div>
      <div class="field-body">
        <label>
          <input id="chk-human" type="checkbox" v-model="alterHuman" />
        </label>
      </div>
    </div>

    <div v-if="alterHuman" class="field is-horizontal">
      <div class="field-label is-normal">
        <label class="label" :title="t('altergender')">{{ t("gender") }}</label>
      </div>
      <div class="field-body">
        <div class="control">
          <div class="select is-fullwidth">
            <select
              :class="{ autovalue: alter.genderDefault }"
              v-model="alterGender"
            >
              <option value="weiblich">{{ t("female") }}</option>
              <option value="männlich">{{ t("male") }}</option>
              <option value="divers">{{ t("diverse") }}</option>
              <option value="nicht festgelegt">{{ t("notspecified") }}</option>
            </select>
          </div>
        </div>
      </div>
    </div>

    <div v-else class="field is-horizontal">
      <div class="field-label is-normal">
        <label class="label">{{ t("category") }}</label>
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
        <label class="label" :title="t('agetitle')">{{ t("age") }}</label>
      </div>
      <div class="field-body">
        <div class="field">
          <div class="control">
            <input
              class="input"
              min="0"
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
        <label class="checkbox" :title="t('deceasedcheck')">
          <input type="checkbox" v-model="alterDeceased" />
          {{ SYMBOL_DECEASED }}{{ t("deceased") }}
        </label>
      </div>
    </div>

    <div class="field is-horizontal">
      <div class="field-label">
        <label class="label" :title="t('relationtitle')">{{
          t("relationship")
        }}</label>
      </div>
      <div class="field-body">
        <div class="field">
          <fieldset :disabled="!isConnectable" class="control radio-group">
            <label class="radio" :title="t('existingtitle')">
              <input type="radio" v-model="alterEdgeType" value="1" />
              {{ t("existing") }}
            </label>
            <label class="radio" :title="t('multititle')">
              <input type="radio" v-model="alterEdgeType" value="2" />
              {{ t("multiplex") }}
            </label>
            <label class="radio" :title="t('norelationtitle')">
              <input type="radio" v-model="alterEdgeType" value="0" />
              {{ t("nocurrentrelationship") }}
            </label>
          </fieldset>
        </div>
      </div>
    </div>

    <div v-if="showQuality && alterEdgeType >= 1" class="field is-horizontal">
      <div class="field-label">
        <label class="label" for="chk-new-checkbox">{{
          t("conflictual")
        }}</label>
      </div>
      <div class="field-body">
        <label>
          <input
            id="chk-new-checkbox"
            type="checkbox"
            v-model="alterConflict"
          />
        </label>
      </div>
    </div>

    <div v-if="showQuality && alterEdgeType >= 1" style="margin-bottom: 1.5em">
      <div
        class="field is-horizontal"
        v-for="(label, key) in supportOptions"
        :key="key"
      >
        <div class="field-label is-normal">
          <label class="label" style="width: 100px">{{ t(label) }}</label>
        </div>
        <div class="field-body">
          <div class="control">
            <div class="select is-fullwidth">
              <select v-model="supportValues[key]">
                <option value="0">{{ t("nosupport") }}</option>
                <option value="1">{{ t("isupport") }} {{ alter.name }}</option>
                <option value="2">
                  {{ alter.name }} {{ t("supportsme") }}
                </option>
                <option value="3">{{ t("supporteachother") }}</option>
              </select>
            </div>
          </div>
        </div>
      </div>
    </div>

    <div class="field">
      <div class="control">
        <textarea
          class="textarea is-small"
          :value="alter.note"
          @blur="commitEdit($event, 'note')"
          :placeholder="t('notesaboutcontact')"
        ></textarea>
      </div>
    </div>

    <div class="field is-grouped is-grouped-centered is-grouped-multiline">
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
          {{ addingNewAlter ? t("nextcontact") : t("close") }}
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
          {{ t("close") }}
        </button>
      </p>
      <p class="control">
        <button
          v-if="addingNewAlter"
          class="button is-light"
          type="button"
          @mouseup.prevent="cancelAddAlter"
        >
          {{ t("cancel") }}
        </button>
      </p>
    </div>
  </form>
</template>

<script lang="ts">
import { defineComponent, ref, computed, onMounted, watch } from "vue";
import { useStore } from "@/store";

import { Alter, hasOptionalChanges, isConnectable } from "@/data/Alter";
import { Gender } from "@/data/Gender";
import { Roles, RolesEng } from "@/data/Roles";
import { SYMBOL_DECEASED } from "@/assets/utils";
import { TAB_BASE } from "@/store/sessionModule";
import de from "@/de";
import en from "@/en";
import EmojiPicker from "vue3-emoji-picker";
import "vue3-emoji-picker/css";

type InputType = HTMLInputElement | HTMLTextAreaElement;

// gender & role options
// focus name input
// prohibit invalid name
// prohibit invalid position
// emit edit-finished

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
  props: {
    // gets Alter as prop cp. ToDo demo
    alter: {
      type: Object,
      required: true,
    },
    // toogled after each click on the map (resets keyboard cursor)
    mapclicked: Boolean,
  },
  components: {
    EmojiPicker,
  },

  setup(props) {
    const store = useStore();

    const addingNewAlter = ref(!(props.alter?.name.length > 0));


    const showEmojiPicker = ref(false);

    // TODO ref() or constants?
    const supportOptions = ref({
      emotional: "emotional",
      instrumental: "instrumental",
      informational: "informational",
      social: "social",
      linking: "linking",
    });

    // TODO does the object need to be a ref() or can it be an array of accessor's?
    const supportValues = ref({
      emotional: accessor<number>("supportEmotional"),
      instrumental: accessor<number>("supportInstrumental"),
      informational: accessor<number>("supportInformational"),
      social: accessor<number>("supportSocial"),
      linking: accessor<number>("supportLinking"),
    });

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

    const selectedEmoji = ref(props.alter?.emoji || "");


    function onSelectEmoji(emoji: any) {
      selectedEmoji.value = emoji.i;
      showEmojiPicker.value = false;
      commitEditEmoji(emoji.i);
    }

    const commitEditEmoji = (emoji: string) => {
      const payload = {
        index: store.state.session.editIndex,
        changes: { emoji: emoji },
      };
      store.commit("editAlter", payload);
    };

    function removeEmoji() {
      selectedEmoji.value = "";
      commitEditEmoji("");
    }

    function toggleEmojiPicker() {
      showEmojiPicker.value = !showEmojiPicker.value;
    }

    // getter & setter for select dropdown
    function accessor<type>(field: keyof Alter) {
      return computed({
        get(): type {
          return props.alter[field];
        },
        set(value: type) {
          const payload = {
            index: store.state.session.editIndex,
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
        const payload = { index: store.state.session.editIndex, changes };
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

      const roles =
        document.documentElement.lang == "de"
          ? roleOptions.value
          : engRoleOptions.value;
      const role = roles.find((r) => r.label === value);

      if (role) {
        const germanValue = role.german;
        const payload = {
          index: store.state.session.editIndex,
          changes: { role: germanValue },
        };
        store.commit("editAlter", payload);
      } else {
        commitEdit(evt, "role");
      }
    };

    const localizedRole = computed(() => {
      const lang = document.documentElement.lang;
      const roles = lang === "de" ? roleOptions.value : engRoleOptions.value;
      const role = roles.find((r) => r.german === alterRole.value);
      return role ? role.label : alterRole.value;
    });

    const alterRole = accessor<string>("role");

    const invalidName = computed(() => {
      return alterNameInUI.value.trim().length === 0;
    });

    // apparently v-for needs this to be a data item
    const genderOptions = ref(Gender);
    const roleOptions = ref(Roles);
    const engRoleOptions = ref(RolesEng);

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
        store.commit("session/closeAlterForm");

        if (addingNewAlter.value && allowAddNext) {
          store.commit("addAlter");
        }
      }
    };

    const cancelAddAlter = () => {
      if (addingNewAlter.value) {
        store.commit("cancelAddAlter", store.state.session.editIndex);
      }
    };

    onMounted(() => {
      // the DOM element will be assigned to the ref after initial render
      if (altername.value != null) {
        (altername.value as HTMLInputElement).focus();
      }

      document.onkeydown = (event: KeyboardEvent) => {
        if (event.key === "Escape" || event.key === "Esc") {
          if (document && document.activeElement instanceof HTMLElement) {
            document.activeElement.blur();
          }

          // check if form is open isEditMode (see #97)
          if (store.state.session.editTab !== TAB_BASE) {
            return;
          }

          if (invalidName.value || invalidPosition.value) {
            // TODO asking maybe not necessary because of undo?
            let remove = true;
            if (hasOptionalChanges(props.alter as Alter)) {
              remove = confirm("Soll dieser Kontakt gelöscht werden?");
            }
            if (remove) {
              store.commit("cancelAddAlter", store.state.session.editIndex);
            }
          } else {
            // alter is valid --> just close the form
            store.commit("session/closeAlterForm");
          }
        }
      };
    });

    return {
      addingNewAlter,
      alterNameInUI,
      alterRole,
      localizedRole,
      invalidName,
      invalidPosition,
      alterHuman: accessor<boolean>("human"),
      alterGender: accessor<string>("currentGender"),
      alterDeceased: accessor<boolean>("deceased"),
      alterConflict: accessor<boolean>("conflict"),
      alterEdgeType: accessor<number>("edgeType"),
      isConnectable: computed(() => isConnectable(props.alter as Alter)),
      showQuality: computed(() => store.state.view.qualityRelationship),
      emoji: computed(() => store.state.view.emoji),
      commitEdit,
      focusRole,
      onSelectEmoji,
      removeEmoji,
      toggleEmojiPicker,
      blurRole,
      genderOptions,
      roleOptions,
      engRoleOptions,
      editAlterFinished,
      cancelAddAlter,
      selectedEmoji,
      showEmojiPicker,
      altername,
      domButton,
      SYMBOL_DECEASED,
      supportOptions,
      supportValues,
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
  color: #656565;
}

.autovalue:focus {
  color: $text-strong;
}

select > option {
  color: $text-strong;
}

.dropdown-menu {
  display: none;
  position: sticky;
  z-index: 10;
  width: 20em;
}

.dropdown.is-active .dropdown-menu {
  display: block;
}
</style>
