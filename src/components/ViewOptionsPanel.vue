<template>
  <div class="panel">
    <p class="panel-heading" @click.stop="isOpen = !isOpen">
      <span>{{ t("viewsettings") }}</span>
      <span class="icon is-medium clickAble right">
        <font-awesome-icon v-if="isOpen" icon="chevron-up" />
        <font-awesome-icon v-else icon="chevron-down" size="1x" />
      </span>
    </p>
    <div class="panel-block">
      <div class="flex-cont" v-if="isOpen">
        <div>
          <div class="control">
            <label class="checkbox">
              <input type="checkbox" v-model="alteriNames" />
              <span>{{ t("namesofcontactson") }}</span>
            </label>
          </div>
          <div class="control">
            <label class="checkbox">
              <input
                type="checkbox"
                v-model="showAge"
                :disabled="!alteriNames"
              />
              <span>{{ t("ageofcontactson") }}</span>
            </label>
          </div>
          <div class="control">
            <label class="checkbox">
              <input
                type="checkbox"
                v-model="showRole"
                :disabled="!alteriNames"
              />
              <span>{{ t("roleofcontactson") }}</span>
            </label>
          </div>
          <div class="control">
            <label for="text-size">{{ t("changesize") }}</label>
            &nbsp;
            <input
              type="range"
              id="text-size"
              min="3"
              max="13"
              v-model="textSize"
              :disabled="!alteriNames"
            />
          </div>
        </div>
        <div>
          <div class="control">
            <label class="checkbox">
              <input type="checkbox" v-model="horizons" />
              <span>{{ t("horizonson") }}</span>
            </label>
          </div>
          <div class="control">
            <label class="checkbox">
              <input type="checkbox" v-model="connectionsEgo" />
              <span>{{ t("connectionsego") }}</span>
            </label>
          </div>
          <div class="control">
            <label class="checkbox">
              <input type="checkbox" v-model="connections" />
              <span>{{ t("connectionson") }}</span>
            </label>
          </div>
          <div class="control">
            <label for="text-size">{{ t("changesizeEmoji") }}</label>
            &nbsp;
            <input
              type="range"
              id="icon-size"
              min="3"
              max="8"
              v-model="iconSize"
            />
          </div>
        </div>
        <div>
          <div class="buttons">
            <button class="button" @click.stop="togglePseudonyms">
              <span class="icon">
                <font-awesome-icon icon="user-secret" />
              </span>
              <span v-if="pseudonyms">{{ t("anonymiseoff") }}</span>
              <span v-else>{{ t("anonymiseon") }}</span>
            </button>
            <button class="button" @click.stop="toggleQuality">
              <span class="icon">
                <font-awesome-icon icon="hand-holding-heart" />
              </span>
              <span v-if="showQuality">{{ t("qualitiesoff") }}</span>
              <span v-else>{{ t("qualitieson") }}</span>
            </button>
            <button class="button" @click.stop="toggleEmoji">
              <span class="icon">
                <font-awesome-icon icon="icons" />
              </span>
              <span v-if="emoji">{{ t("emojioff") }}</span>
              <span v-else>{{ t("emojion") }}</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent, ref, computed } from "vue";
import { useStore } from "@/store";
import de from "@/de";
import en from "@/en";
import { ViewOptionsFlags } from "@/data/ViewOptions";

export default defineComponent({
  mixins: [de, en],
  methods: {
    t(prop: string) {
      return this[document.documentElement.lang][prop];
    },
  },
  setup() {
    const store = useStore();

    // whether panel is collapsed is managed locally
    const isOpen = ref(false);

    const textSize = computed({
      get(): number {
        return store.state.view.labelSizeInNwk;
      },
      set(value: number) {
        store.commit("view/setLabelSizeInNwk", value);
      },
    });

    const iconSize = computed({
      get(): number {
        return store.state.view.iconSizeInNwk;
      },
      set(value: number) {
        store.commit("view/setIconSizeInNwk", value);
      },
    });

    // getter & setter for checkboxes
    function accessFlag(flag: keyof ViewOptionsFlags) {
      return computed({
        get(): boolean {
          return store.state.view[flag];
        },
        set(value: boolean) {
          const payload = { flag, value };
          store.commit("view/updateFlag", payload);
        },
      });
    }

    return {
      pseudonyms: computed(() => store.state.pseudonym.active),
      togglePseudonyms: () => store.commit("pseudonym/toggle"),
      showQuality: computed(() => store.state.view.qualityRelationship),
      toggleQuality: () => store.commit("view/toggle", "qualityRelationship"),
      toggleEmoji: () =>
        store.commit("view/updateFlag", {
          flag: "emoji",
          value: !store.state.view.emoji,
        }),
      horizons: accessFlag("horizons"),
      connections: accessFlag("connections"),
      connectionsEgo: accessFlag("connectionsEgo"),
      emoji: accessFlag("emoji"),
      alteriNames: accessFlag("alteriNames"),
      isOpen,
      showAge: accessFlag("ageInNwk"),
      showRole: accessFlag("roleInNwk"),
      textSize,
      iconSize,
      //markSize,
      //changeMarkSize,
    };
  },
});
</script>

<style scoped>
.right {
  float: right;
}

.flex-cont {
  display: flex;
  flex-wrap: wrap;
  width: 100%;
}

.flex-cont > * {
  flex-grow: 1;
  min-width: 16em;
  margin: 5px 0;
}
</style>
