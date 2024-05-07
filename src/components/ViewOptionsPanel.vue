<template>
  <div class="panel">
    <p class="panel-heading" @click.stop="isOpen = !isOpen">
      <span>Ansichtseinstellungen</span>
      <span class="icon is-medium clickAble right">
        <font-awesome-icon v-if="isOpen" icon="chevron-up" />
        <font-awesome-icon v-else icon="chevron-down" size="1x" />
      </span>
    </p>
    <div class="panel-block form">
      <div class="field is-horizontal">
        <div class="field-body">
          <div id="view-settings" class="field" v-if="isOpen">
            <div class="columns is-multiline">
              <div class="column is-half-desktop">
                <div class="control">
                  <label class="checkbox">
                    <input type="checkbox" @click.stop="toggleHorizons" />
                    <span class="icon">
                      <font-awesome-icon icon="rss" />
                    </span>
                    <span>Horizonte</span>
                  </label>
                </div>
                <div class="control">
                  <label class="checkbox">
                    <input type="checkbox" @click.stop="toggleAge" />
                    <span>Alter der Kontakte</span>
                  </label>
                </div>
                <div class="control">
                  <label class="checkbox">
                    <input type="checkbox" @click.stop="toggleRoleShort" />
                    <span>Rolle der Kontakte</span>
                  </label>
                </div>
                <br />
                <div class="control">
                  <button class="button" @click.stop="togglePseudonyms">
                    <span class="icon">
                      <font-awesome-icon icon="user-secret" />
                    </span>
                    <span v-if="pseudonyms">De-Anonymisieren</span>
                    <span v-else>Anonymisieren</span>
                    <span></span>
                  </button>
                </div>
              </div>
              <div class="column is-half-desktop">
                <div class="control">
                  <label class="checkbox">
                    <input
                      type="checkbox"
                      @click.stop="toggleAlteriNames"
                      checked
                    />
                    <span class="icon">
                      <font-awesome-icon icon="font" />
                    </span>
                    <span>Kontaktnamen</span>
                  </label>
                </div>
                <div class="control">
                  <label class="checkbox">
                    <input type="checkbox" @click.stop="toggleConnections" />
                    <span class="icon">
                      <font-awesome-icon icon="project-diagram" />
                    </span>
                    <span>Verbindungen</span>
                  </label>
                </div>
              </div>
            </div>
            <div class="control">
              <label for="text-size">Textgröße ändern:</label>
              <input
                type="range"
                id="text-size"
                placeholder="1"
                min="1"
                max="10"
                v-model="textSize"
                @input="changeTextSize"
              />
            </div>
            <div class="control">
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
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { defineComponent, ref, computed } from "vue";
import { useStore } from "@/store";

export default defineComponent({
  setup() {
    const store = useStore();
    const isOpen = ref(false);
    const textSize = ref(5);
    const markSize = ref(5);

    const changeTextSize = () => {
      const payload = {
        size: textSize.value,
      };
      store.commit("editEgo", payload);
      /*document.documentElement.style.setProperty(
            "--text-size",
            `${textSize.value}px`
          );*/
    };
    const changeMarkSize = () => {
      const payload = {
        sizeMark: markSize.value,
      };
      store.commit("editEgo", payload);
    };

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
      markSize,
      changeMarkSize,
    };
  },
});
</script>

<style scoped>
.right {
  float: right;
}

:root {
  --text-size: 16px;
}
* {
  font-size: var(--text-size);
}
</style>
