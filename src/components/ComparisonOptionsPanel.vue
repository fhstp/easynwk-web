<template>
  <div class="panel">
    <p
      class="panel-heading"
      @click.stop="isOpen = !isOpen"
      @click="newVersion = false"
    >
      <span>Karten und Verlauf</span>
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
                Aktuelle Karte:&nbsp;
                <span v-if="versions.length && currentVersion > 0">
                  {{ versions[visibleVersion]?.title || "" }}
                  vom
                  {{
                    versions[visibleVersion]?.date?.substring(8, 10) +
                    "." +
                    versions[visibleVersion]?.date?.substring(5, 7) +
                    "." +
                    versions[visibleVersion]?.date?.substring(0, 4)
                  }}&nbsp;
                </span>
                <button
                  class="button is-small"
                  title="Ankerperson bearbeiten"
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
                  @click.stop="newVersion = true"
                >
                  <span class="icon">
                    <font-awesome-icon icon="plus-circle" />
                  </span>
                  <span>Neue leere Karte</span>
                  <span></span>
                </button>

                <!-- @click="newVersion = !newVersion" -->
                <button
                  class="button"
                  @click="duplicateNWK"
                  @click.stop="newVersion = true"
                >
                  <span class="icon">
                    <font-awesome-icon icon="copy" />
                  </span>
                  <span>Karte duplizieren</span>
                </button>

                <button class="button" @click.stop="toggleChange">
                  <span class="icon">
                    <font-awesome-icon icon="exchange-alt" />
                  </span>
                  <span>Karte wechseln</span>
                </button>

                <button class="button" @click.stop="toggleComparison">
                  <span class="icon">
                    <font-awesome-icon icon="compress-arrows-alt" />
                  </span>
                  <span v-if="!nwkcomparison">Vergleich ein</span>
                  <span v-else>Vergleich aus</span>
                </button>
              </div>

              <div v-if="newVersion">
                <div class="field is-horizontal">
                  <div class="field-label is-normal">
                    <label class="label">Titel</label>
                  </div>
                  <div class="field-body">
                    <div class="field">
                      <div class="control">
                        <input
                          class="input"
                          type="text"
                          placeholder="Titel der aktuellen Version"
                          v-model="newVersionTitle"
                        />
                      </div>
                    </div>
                  </div>
                </div>

                <br />

                <div class="field is-horizontal">
                  <div class="field-label is-normal">
                    <label class="label">Datum</label>
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
                    @click.stop="newVersion = false"
                  >
                    <span>Speichern</span>
                  </button>

                  <button
                    class="button is-light"
                    @click.stop="newVersion = false"
                  >
                    <span>Abbrechen</span>
                  </button>

                  <button
                    class="button is-danger"
                    @click="deleteVersion"
                    @click.stop="newVersion = false"
                    :disabled="versions.length <= 1"
                  >
                    <span>Karte Löschen</span>
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
import { NWKVersion } from "@/data/NWKVersion";

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
  setup() {
    const store = useStore();

    const currentVersion = computed(() => store.state.record.currentVersion);

    const visibleVersion = computed(() =>
      store.state.record.versions.findIndex(
        (version) => version.id === currentVersion.value
      )
    );

    const isOpen = ref(false);

    const newVersion = ref(false);

    const editText = ref(false);

    const isDisabled = ref(true);

    const newNWK = ref(false);

    const versions = computed(() => store.state.record.versions);

    const newVersionTitle = ref(
      store.state.record.versions[
        versions.value.findIndex(
          (version) => version.id === currentVersion.value
        )
      ].title
    );
    const today = new Date().toISOString().substr(0, 10);
    let newVersionDate = ref(today);

    watch(currentVersion, () => {
      const versionIndex = versions.value.findIndex(
        (version) => version.id === currentVersion.value
      );
      if (versionIndex >= 0 && versionIndex < versions.value.length) {
        newVersionTitle.value = versions.value[versionIndex].title;
        if (versions.value[versionIndex].date) {
          newVersionDate.value = versions.value[versionIndex].date;
        } else {
          newVersionDate.value = today;
        }
      }
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
      newVersionDate.value = "";
    };

    const deleteVersion = () => {
      const index: number = currentVersion.value - 1;
      store.commit("removeCurrentVersion", index);
    };

    return {
      nwkcomparison: computed(() => store.state.view.nwkcomparison),
      nwkchange: computed(() => store.state.view.nwkchange),
      toggleComparison: () => store.commit("view/toggle", "nwkcomparison"),
      toggleChange: () => store.commit("view/toggle", "nwkchange"),
      editText: editText,
      isOpen: isOpen,
      newVersion: newVersion,
      newNWK: newNWK,
      //commitEdit,
      deleteVersion,
      addNewVersion: editVersion,
      addBlankNWK: () => store.commit("addNWKVersion"),
      duplicateNWK: () => store.commit("addNWKVersion", true),
      newVersionTitle,
      newVersionDate,
      isDisabled: isDisabled,
      currentVersion: currentVersion,
      visibleVersion: visibleVersion,
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
