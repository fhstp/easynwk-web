<template>
  <div class="panel">
    <p class="panel-heading" @click.stop="isOpen = !isOpen">
      <span>{{ t("socialsupport") }}</span>
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
              <div style="margin: 1.5em">
                <p>{{ t("introductionsentence") }}</p>
              </div>

              <div>
                <div
                  class="support clickAble"
                  :class="{ active: filterEmotional }"
                  @click.stop="toggleEmotional"
                >
                  <font-awesome-icon class="ico" icon="heart" />
                  {{ t("emotional") }}: {{ alteriEmotional }}
                </div>
              </div>

              <div>
                <div
                  class="support clickAble"
                  :class="{ active: filterInstrumental }"
                  @click.stop="toggleInstrumental"
                >
                  <font-awesome-icon class="ico" icon="toolbox" />
                  {{ t("instrumental") }}: {{ alteriMaterial }}
                </div>
              </div>

              <div>
                <div
                  class="support clickAble"
                  :class="{ active: filterInformational }"
                  @click.stop="toggleInformational"
                >
                  <font-awesome-icon class="ico" icon="lightbulb" />
                  {{ t("informational") }}: {{ alteriCognitive }}
                </div>
              </div>

              <div>
                <div
                  class="support clickAble"
                  :class="{ active: filterSocial }"
                  @click.stop="toggleSocial"
                >
                  <font-awesome-icon class="ico" icon="users" />
                  {{ t("social") }}: {{ alteriSocial }}
                </div>
              </div>

              <div>
                <div
                  class="support clickAble"
                  :class="{ active: filterLinking }"
                  @click.stop="toggleLinking"
                >
                  <font-awesome-icon class="ico" icon="link" />
                  {{ t("linking") }}: {{ alteriLinking }}
                </div>
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
import { SupportFields } from "@/data/Alter";

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

    function listAlteriBySupport(field: keyof SupportFields) {
      return computed(() =>
        store.state.nwk.alteri
          .filter((alter) => alter[field] >= 1 && alter[field] <= 3)
          .map((alter) => alter.name)
          .join(", ")
      );
    }

    return {
      isOpen: isOpen,

      filterEmotional: computed(() => store.state.session.filterEmotional),
      filterInstrumental: computed(
        () => store.state.session.filterInstrumental
      ),
      filterInformational: computed(
        () => store.state.session.filterInformational
      ),
      filterSocial: computed(() => store.state.session.filterSocial),
      filterLinking: computed(() => store.state.session.filterLinking),

      alteriEmotional: listAlteriBySupport("supportEmotional"),
      alteriMaterial: listAlteriBySupport("supportInstrumental"),
      alteriCognitive: listAlteriBySupport("supportInformational"),
      alteriSocial: listAlteriBySupport("supportSocial"),
      alteriLinking: listAlteriBySupport("supportLinking"),

      toggleEmotional: () => store.commit("session/toggle", "filterEmotional"),
      toggleInformational: () =>
        store.commit("session/toggle", "filterInformational"),
      toggleSocial: () => store.commit("session/toggle", "filterSocial"),
      toggleInstrumental: () =>
        store.commit("session/toggle", "filterInstrumental"),
      toggleLinking: () => store.commit("session/toggle", "filterLinking"),
    };
  },
});
</script>

<style lang="scss">
.right {
  float: right;
}

.support {
  margin: 1em;
  display: inline-flex;
  align-items: center;
}

.ico {
  color: #afafaf;
  margin-right: 0.5em;
}

.support.active {
  font-weight: bold;
}

.active .ico {
  color: $nwkorange;
}
</style>
