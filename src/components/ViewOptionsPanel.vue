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
              <input type="checkbox" @click.stop="toggleAlteriNames" checked />
              <span>{{ t("namesofcontactson") }}</span>
            </label>
          </div>
          <div class="control">
            <label class="checkbox">
              <input type="checkbox" @click.stop="toggleAge" />
              <span>{{ t("ageofcontactson") }}</span>
            </label>
          </div>
          <div class="control">
            <label class="checkbox">
              <input type="checkbox" @click.stop="toggleRoleShort" />
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
              @input="changeTextSize"
            />
          </div>
        </div>
        <div>
          <div class="control">
            <label class="checkbox">
              <input type="checkbox" @click.stop="toggleHorizons" />
              <span>{{ t("horizonson") }}</span>
            </label>
          </div>
          <div class="control">
            <label class="checkbox">
              <input type="checkbox" @click.stop="toggleConnections" />
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

export default defineComponent({
  mixins: [de, en],
  methods: {
    t(prop: string) {
      return this[document.documentElement.lang][prop];
    },
  },
  setup() {
    const store = useStore();
    const isOpen = ref(false);
    const textSize = ref(5);
    //const markSize = ref(5);

    const changeTextSize = () => {
      // const payload = {
      //   size: textSize.value,
      // };
      store.commit("view/setLabelSizeInNwk", textSize.value);
      /*document.documentElement.style.setProperty(
            "--text-size",
            `${textSize.value}px`
          );*/
    };
    /*const changeMarkSize = () => {
      const payload = {
        sizeMark: markSize.value,
      };
      store.commit("editEgo", payload);
    };*/

    return {
      pseudonyms: computed(() => store.state.pseudonym.active),
      togglePseudonyms: () => store.commit("pseudonym/toggle"),
      horizons: computed(() => store.state.view.horizons),
      toggleHorizons: () => store.commit("view/toggle", "horizons"),
      connections: computed(() => store.state.view.connections),
      toggleConnections: () => store.commit("view/toggle", "connections"),
      alteriNames: computed(() => store.state.view.alteriNames),
      toggleAlteriNames: () => store.commit("view/toggle", "alteriNames"),
      isOpen,
      showAge: computed(() => store.state.view.ageInNwk),
      toggleAge: () => store.commit("view/toggle", "ageInNwk"),
      showRole: computed(() => store.state.view.roleInNwk),
      toggleRoleShort: () => store.commit("view/toggle", "roleInNwk"),
      textSize,
      changeTextSize,
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
