<template>
  <div class="panel">
    <p
      class="panel-heading"
      @click.stop="isOpen = !isOpen"
      @click="newVersion = false"
    >
      <span>{{ t("versiontitle") }}</span>
      <span class="icon is-medium clickAble right">
        <font-awesome-icon v-if="isOpen" icon="chevron-up" />
        <font-awesome-icon v-else icon="chevron-down" size="1x" />
      </span>
    </p>
    <div class="panel-block form">
      <div class="field is-horizontal">
        <div class="field-body">
          <div id="record-settings" class="field" v-if="isOpen">
            <div class="control">
              <div class="field is-horizontal">
                {{ t("currentversion") }}
                <span v-if="versions.length && currentVersion >= 0">
                  {{ visibleNWKVersion?.title || "" }}
                  {{ t("versionfrom") }}
                  <!-- TODO use internationalizable date formater -->
                  {{
                    visibleNWKVersion?.date?.substring(8, 10) +
                    "." +
                    visibleNWKVersion?.date?.substring(5, 7) +
                    "." +
                    visibleNWKVersion?.date?.substring(0, 4)
                  }}&nbsp;
                </span>
                <button
                  class="button is-small"
                  title="Metadaten der Karte bearbeiten"
                  v-if="isOpen"
                  @click="
                    newVersion = true;
                    editText = true;
                  "
                >
                  <span class="icon">
                    <font-awesome-icon icon="pencil-alt" />
                  </span>
                </button>
              </div>
              <br />
              <div class="buttons" v-if="!newVersion">
                <button
                  class="button"
                  @click="addBlankNWK"
                  @click.stop="(newVersion = true), (firstCreation = true)"
                >
                  <span class="icon">
                    <font-awesome-icon icon="plus-circle" />
                  </span>
                  <span>{{ t("newemptyversion") }}</span>
                  <span></span>
                </button>

                <!-- @click="newVersion = !newVersion" -->
                <button
                  class="button"
                  @click="duplicateNWK"
                  @click.stop="(newVersion = true), (firstCreation = true)"
                >
                  <span class="icon">
                    <font-awesome-icon icon="copy" />
                  </span>
                  <span>{{ t("duplicateversion") }}</span>
                </button>

                <button class="button" @click.stop="toggleChange">
                  <span class="icon">
                    <font-awesome-icon icon="exchange-alt" />
                  </span>
                  <span>{{ t("changeversion") }}</span>
                </button>

                <!-- TODO hide comparison button in the production code in main branch
                <button class="button" @click.stop="toggleComparison" disabled>
                  <span class="icon">
                    <font-awesome-icon icon="compress-arrows-alt" />
                  </span>
                  <span v-if="!nwkcomparison">Vergleich ein</span>
                  <span v-else>Vergleich aus</span>
                </button> -->
              </div>

              <div v-if="newVersion">
                <div class="field is-horizontal">
                  <div class="field-label is-normal">
                    <label class="label">{{ t("title") }}</label>
                  </div>
                  <div class="field-body">
                    <div class="field">
                      <div class="control">
                        <input
                          class="input"
                          type="text"
                          :placeholder="t('titleplaceholder')"
                          v-model="newVersionTitle"
                        />
                      </div>
                    </div>
                  </div>
                </div>

                <br />

                <div class="field is-horizontal">
                  <div class="field-label is-normal">
                    <label class="label">{{ t("date") }}</label>
                  </div>
                  <div class="field-body">
                    <div class="field">
                      <div class="control">
                        <input
                          class="input"
                          type="date"
                          v-model="newVersionDate"
                        />
                      </div>
                    </div>
                  </div>
                </div>

                <br />

                <div class="buttons">
                  <button
                    class="button is-primary"
                    @click="addNewVersion()"
                    @click.stop="(newVersion = false), (firstCreation = false)"
                  >
                    <span>{{ t("save") }}</span>
                  </button>

                  <button
                    v-if="firstCreation"
                    class="button is-light"
                    @click="deleteVersion"
                    @click.stop="(newVersion = false), (firstCreation = false)"
                  >
                    <!-- TODO Abbrechen does not clear the refs used in the text fields -->
                    <span>{{ t("cancel") }}</span>
                  </button>

                  <!-- TODO move state updates into handler functions? -->
                  <button
                    v-if="!firstCreation"
                    class="button is-danger"
                    @click="deleteVersion"
                    @click.stop="newVersion = false"
                    :disabled="versions.length <= 1"
                  >
                    <span>{{ t("deleteversion") }}</span>
                  </button>
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
import { defineComponent, ref, computed, watch } from "vue";
import { useStore } from "@/store";
import type { NWKVersion } from "@/data/NWKVersion";
import de from "@/de";
import en from "@/en";

//type InputType = HTMLInputElement | HTMLTextAreaElement;

export default defineComponent({
  // AR, 14 Aug 2023: prop version not needed? current version is in state.record
  /*props: {
    version: {
      type: Object,
      required: true,
    },
  },
   */
  mixins: [de, en],
  methods: {
    t(prop: string) {
      return this[document.documentElement.lang][prop];
    },
  },
  setup() {
    const store = useStore();

    const currentVersion = computed(() => store.state.record.currentVersion);

    /** the NWKVersion object of the currently visible version */
    const visibleNWKVersion = computed(() =>
      store.state.record.versions.find(
        (version) => version.id === currentVersion.value
      )
    );

    const isOpen = ref(false);

    const newVersion = ref(false);

    const firstCreation = ref(false);

    const editText = ref(false);

    const isDisabled = ref(true);

    const newNWK = ref(false); // TODO needed?

    const versions = computed(() => store.state.record.versions);

    const newVersionTitle = ref(visibleNWKVersion.value?.title);
    const newVersionDate = ref(visibleNWKVersion.value?.date);

    // local copy of NWKVersion metadata needs to be updated
    watch(visibleNWKVersion, () => {
      newVersionTitle.value = visibleNWKVersion.value?.title;
      newVersionDate.value = visibleNWKVersion.value?.date;
    });

    const editVersion = () => {
      const index: number = versions.value.findIndex(
        (version) => version.id === currentVersion.value
      );
      const changes: Partial<NWKVersion> = {
        title: newVersionTitle.value,
        date: newVersionDate.value,
      };
      store.commit("record/editVersion", {
        index,
        changes,
      });
      // newVersionDate.value = ""; // TODO AR 29 Aug 2023 why???
    };

    const deleteVersion = () => {
      store.commit("removeCurrentVersion");
    };

    return {
      nwkcomparison: computed(() => store.state.session.nwkcomparison),
      nwkchange: computed(() => store.state.session.nwkchange),
      toggleComparison: () => store.commit("session/toggle", "nwkcomparison"),
      toggleChange: () => store.commit("session/toggle", "nwkchange"),
      editText: editText,
      isOpen: isOpen,
      newVersion: newVersion,
      newNWK: newNWK,
      firstCreation: firstCreation,
      //commitEdit,
      deleteVersion,
      addNewVersion: editVersion,
      addBlankNWK: () => store.commit("addNWKVersion"),
      duplicateNWK: () => store.commit("addNWKVersion", true),
      newVersionTitle,
      newVersionDate,
      isDisabled: isDisabled,
      currentVersion: currentVersion,
      visibleNWKVersion,
      versions: computed(() => store.state.record.versions),
      //commitEdit,
      //cancelAddVersion,
    };
  },
});
</script>

<style lang="scss">
.right {
  float: right;
}
</style>
