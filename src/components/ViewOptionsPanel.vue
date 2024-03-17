<template>
  <div class="panel">
    <p class="panel-heading" @click.stop="isOpen = !isOpen">
      <span>{{ t("viewsettings") }}</span>
      <span class="icon is-medium clickAble right">
        <font-awesome-icon v-if="isOpen" icon="chevron-up" />
        <font-awesome-icon v-else icon="chevron-down" size="1x" />
      </span>
    </p>
    <div class="panel-block form">
      <div class="field is-horizontal">
        <div class="field-body">
          <div id="view-settings" class="field" v-if="isOpen">
            <div class="control">
              <div class="buttons">
                <button class="button" @click.stop="togglePseudonyms">
                  <span class="icon">
                    <font-awesome-icon icon="user-secret" />
                  </span>
                  <span v-if="pseudonyms">{{ t("anonymiseoff") }}</span>
                  <span v-else>{{ t("anonymiseon") }}</span>
                  <span></span>
                </button>

                <button class="button" @click.stop="toggleHorizons">
                  <span class="icon">
                    <font-awesome-icon icon="rss" />
                  </span>
                  <span v-if="horizons">{{ t("horizonsoff") }}</span>
                  <span v-else>{{ t("horizonson") }}</span>
                </button>

                <br />

                <button class="button" @click.stop="toggleConnections">
                  <span class="icon">
                    <font-awesome-icon icon="project-diagram" />
                  </span>
                  <span v-if="connections">{{ t("connectionsoff") }}</span>
                  <span v-else>{{ t("connectionson") }}</span>
                </button>

                <button class="button" @click.stop="toggleAlteriNames">
                  <span class="icon">
                    <font-awesome-icon icon="font" />
                  </span>
                  <span v-if="alteriNames">{{ t("namesofcontactsoff") }}</span>
                  <span v-else>{{ t("namesofcontactson") }}</span>
                </button>

                <button class="button" @click.stop="toggleAge">
                  <span class="icon">
                    <font-awesome-icon icon="info" />
                  </span>
                  <span v-if="showAge">{{ t("ageofcontactsoff") }}</span>
                  <span v-else>{{ t("ageofcontactson") }}</span>
                </button>

                <button class="button" @click.stop="toggleRoleShort">
                  <span class="icon">
                    <font-awesome-icon icon="info" />
                  </span>
                  <span v-if="showRole">{{ t("roleofcontactsoff") }}</span>
                  <span v-else>{{ t("roleofcontactson") }}</span>
                </button>

                <button class="button" @click.stop="toggleQuality">
                  <span class="icon">
                    <font-awesome-icon icon="info" />
                  </span>
                  <span v-if="showQuality">Qualitäten aus</span>
                  <span v-else>Qualitäten an</span>
                </button>
              </div>
            </div>
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

    return {
      pseudonyms: computed(() => store.state.pseudonym.active),
      togglePseudonyms: () => store.commit("pseudonym/toggle"),
      horizons: computed(() => store.state.view.horizons),
      toggleHorizons: () => store.commit("view/toggle", "horizons"),
      connections: computed(() => store.state.view.connections),
      toggleConnections: () => store.commit("view/toggle", "connections"),
      alteriNames: computed(() => store.state.view.alteriNames),
      toggleAlteriNames: () => store.commit("view/toggle", "alteriNames"),
      isOpen: isOpen,
      showAge: computed(() => store.state.view.ageInNwk),
      toggleAge: () => store.commit("view/toggle", "ageInNwk"),
      showRole: computed(() => store.state.view.roleInNwk),
      toggleRoleShort: () => store.commit("view/toggle", "roleInNwk"),
      showQuality: computed(() => store.state.view.qualityRelationship),
      toggleQuality: () => store.commit("view/toggle", "qualityRelationship"),
    };
  },
});
</script>

<style lang="scss">
.right {
  float: right;
}
</style>
