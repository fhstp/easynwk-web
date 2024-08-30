<template>
  <nav class="panel">
    <p class="panel-heading">
      <span>{{ t("ego") }}</span>
    </p>
    <form class="panel-block form" @submit.prevent="editEgoFinished">
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
                ref="egofield"
                v-model="egoName"
                @blur="commitEdit($event, 'name')"
                type="text"
                :placeholder="t('whoisinthecenter')"
              />
            </div>
            <p class="help">{{ t("mandatoryfield") }}</p>
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
          <div style="display: flex; align-items: center; margin-top: 10px;">
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
          <div >
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
              class="button is-small"
              style="margin-left: 10px;"
            >
            <span>{{t("removeemoji")}}</span>
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
        <div class="field-label is-normal">
          <label class="label">{{ t("genders") }}</label>
        </div>
        <div class="field-body">
          <div class="control">
            <div class="select is-fullwidth">
              <select v-model="egoGender">
                <option value="weiblich">{{ t("female") }}</option>
                <option value="männlich">{{ t("male") }}</option>
                <option value="divers">{{ t("diverse") }}</option>
                <option value="nicht festgelegt">
                  {{ t("notspecified") }}
                </option>
              </select>
            </div>
          </div>
        </div>
      </div>

      <div class="field is-horizontal">
        <div class="field-label is-normal">
          <label class="label">{{ t("age") }}</label>
        </div>
        <div class="field-body">
          <div class="field">
            <div class="control">
              <input
                class="input"
                min="0"
                :value="$store.state.nwk.ego.age"
                @blur="commitEdit($event, 'age')"
                type="number"
              />
            </div>
          </div>
        </div>
      </div>

      <div class="field">
        <div class="control">
          <textarea
            class="textarea is-small"
            :value="$store.state.nwk.ego.note"
            @blur="commitEdit($event, 'note')"
            :placeholder="t('notesaboutego')"
          ></textarea>
        </div>
      </div>

      <div class="field is-grouped is-grouped-centered">
        <p class="control">
          <button class="button is-primary" :disabled="invalidName">
            {{ t("done") }}
          </button>
        </p>
      </div>
    </form>
  </nav>
</template>

<script lang="ts">
import { defineComponent, ref, computed, onMounted, watch } from "vue";
import { useStore } from "@/store";

import { Ego } from "@/data/Ego";
import { Gender } from "@/data/Gender";
import de from "@/de";
import en from "@/en";
import EmojiPicker from "vue3-emoji-picker";
import "vue3-emoji-picker/css";

type InputType = HTMLInputElement | HTMLTextAreaElement;

export default defineComponent({
  mixins: [de, en],
  methods: {
    t(prop: string) {
      return this[document.documentElement.lang][prop];
    },
  },
  components: {
    EmojiPicker,
  },
  setup(props, { emit }) {
    const store = useStore();

    // name field is special because it must not be empty
    // the data item is only used for validity check & never stored
    const egoName = ref(store.state.nwk.ego.name);

    const selectedEmoji = ref(store.state.nwk.ego.emoji || "");
    const showEmojiPicker = ref(false);

    const egoNameInStore = computed(() => {
      return store.state.nwk.ego.name;
    });

    // it must be kept in sync (e.g. when loading a NWK)
    watch(egoNameInStore, (newValue) => {
      egoName.value = newValue; // store.state.ego.name;
    });

    const invalidName = computed(() => {
      return egoName.value.trim().length === 0;
    });

    // getter & setter for select dropdown
    const egoGender = computed({
      get() {
        return store.state.nwk.ego.currentGender;
      },
      set(value: string) {
        store.commit("editEgo", { currentGender: value });
      },
    });

    // generic event handlers from form to vuex
    const commitEdit = (evt: InputEvent, field: keyof Ego) => {
      const value = (evt.target as InputType).value.trim();
      if (value !== store.state.nwk.ego[field]) {
        const payload = { [field]: value };
        store.commit("editEgo", payload);
      }
    };

    const commitEditEmoji = (emoji: string) => {
      const payload = { emoji: emoji };
      store.commit("editEgo", payload);
    };

    function onSelectEmoji(emoji: any) {
      selectedEmoji.value = emoji.i;
      showEmojiPicker.value = false;
      commitEditEmoji(emoji.i);
    }

    function removeEmoji() {
      selectedEmoji.value = "";
      commitEditEmoji("");
    }

    function toggleEmojiPicker() {
      showEmojiPicker.value = !showEmojiPicker.value;
    }

    // apparently v-for needs this to be a data item
    const genderOptions = ref(Gender);

    // we need a DOM ref in order to focus
    const egofield = ref<InstanceType<typeof HTMLInputElement> | null>(null);

    const editEgoFinished = () => {
      if (invalidName.value) {
        // moving mouse cursor does not work
        // apparently editEgoFinished is not even called in the invalid state
        if (egofield.value != null) {
          (egofield.value as HTMLInputElement).focus();
        }
      } else {
        emit("edit-finished");
      }
    };

    onMounted(() => {
      // the DOM element will be assigned to the ref after initial render
      if (egofield.value != null) {
        (egofield.value as HTMLInputElement).focus();
      }
    });

    return {
      egoName,
      invalidName,
      egoGender,
      commitEdit,
      genderOptions,
      editEgoFinished,
      egofield,
      selectedEmoji,
      onSelectEmoji,
      removeEmoji,
      showEmojiPicker,
      toggleEmojiPicker,
      emoji: computed(() => store.state.view.emoji),
    };
  },
});
</script>

<style scoped>
.panel-block {
  display: block;
}

.dropdown-menu {
  display: none;
  position: absolute;
  z-index: 10;
  width: 20em;
}

.dropdown.is-active .dropdown-menu {
  display: block;
}
</style>
