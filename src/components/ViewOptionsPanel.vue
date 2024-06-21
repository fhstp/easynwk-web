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
              <input type="checkbox" v-model="showAge" />
              <span>{{ t("ageofcontactson") }}</span>
            </label>
          </div>
          <div class="control">
            <label class="checkbox">
              <input type="checkbox" v-model="showRole" />
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
              max="15"
              v-model="textSize"
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
              <input type="checkbox" v-model="connections" />
              <span>{{ t("connectionson") }}</span>
            </label>
          </div>
        </div>
        <div>
          <div class="control">
            <button class="button" @click.stop="togglePseudonyms">
              <span class="icon">
                <font-awesome-icon icon="user-secret" />
              </span>
              <span v-if="pseudonyms">{{ t("anonymiseoff") }}</span>
              <span v-else>{{ t("anonymiseon") }}</span>
            </button>
          </div>
        </div>
      </div>
      <!--<div class="control">
              <label for="text-size">Knotengröße ändern:</label>
              <input
                type="range"
                id="text-size"
                placeholder="1"
                min="1"
                max="10"
                v-model="MarkSize"
                @input="changeMarkSize"
              />
            </div> -->
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
      horizons: accessFlag("horizons"),
      connections: accessFlag("connections"),
      alteriNames: accessFlag("alteriNames"),
      isOpen,
      showAge: accessFlag("ageInNwk"),
      showRole: accessFlag("roleInNwk"),
      textSize,
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
