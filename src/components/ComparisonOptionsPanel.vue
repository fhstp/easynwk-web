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
              <div class="buttons">
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
                <button class="button" @click="duplicateNWK">
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

                <div v-if="newVersion">
                  <ComparisonEditForm
                    v-for="(version, i) in currentVersion"
                    :key="version.id"
                    :version="version"
                    :versionIndex="i"
                  ></ComparisonEditForm>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <!-- temporary debug code -->
      <div class="field is-horizontal">
        NWKs:&nbsp;
        <span v-for="ver in versions" :key="ver.id"
          >{{ ver.id }} ({{ ver.nwk.alteri.length }} alteri),
        </span>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent, ref, computed } from "vue";
import { useStore } from "@/store";

import ComparisonEditForm from "@/components/ComparisonEditForm.vue";

type InputType = HTMLInputElement | HTMLTextAreaElement;

export default defineComponent({
  components: { ComparisonEditForm },
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

    const isOpen = ref(false);

    const newVersion = ref(false);

    const isDisabled = ref(true);

    const newNWK = ref(false);

    /*const newVersionTitle = ref(""); // To capture the "Titel" input value
    const newVersionDate = ref(""); // To capture the "Datum" input value

    const addNewVersion = () => {
      const versionIndex: number = currentVersion.value;

      if (
        versionIndex !== undefined &&
        versionIndex >= 0 &&
        versionIndex < store.state.record.versions.length
      ) {
        const changes: Partial<NWKVersion> = {
          title: newVersionTitle.value,
          date: newVersionDate.value,
        };
        store.commit("record/editVersion", {
          versionIndex,
          changes,
        });

        // Reset the input values
        newVersionTitle.value = "";
        newVersionDate.value = "";
      } else {
        console.error(
          "Invalid version index:",
          versionIndex,
          typeof versionIndex
        );
        console.log(
          typeof store.state.record.currentVersion,
          typeof store.state.record.versions.length
        );
      }
    };

    if (store.state.record.versions.length < 2) {
      console.log(isDisabled.value);
      isDisabled.value = true;
    } else {
      isDisabled.value = false;
    }

    const addingNewVersion = ref(!(props.version?.date.length > 0));

    const cancelAddVersion = () => {
      if (addingNewVersion.value) {
        store.commit("cancelAddVersion", store.state.view.editIndex);
      }
    };





    const commitEdit = (evt: FocusEvent, field: keyof NWKVersion) => {
      const value = (evt.target as InputType).value.trim();
      if (props.version && value !== props.version[field]) {
        const changes = { [field]: value };
        const payload = { index: store.state.view.editIndex, changes };
        store.commit("editVersion", payload);
      }
    };
     */

    return {
      nwkcomparison: computed(() => store.state.view.nwkcomparison),
      nwkchange: computed(() => store.state.view.nwkchange),
      toggleComparison: () => store.commit("view/toggle", "nwkcomparison"),
      toggleChange: () => store.commit("view/toggle", "nwkchange"),
      isOpen: isOpen,
      newVersion: newVersion,
      newNWK: newNWK,
      //commitEdit,
      //addNewVersion: addNewVersion,
      addBlankNWK: () => store.commit("addNWKVersion"),
      duplicateNWK: () => store.commit("addNWKVersion", true),
      //newVersionTitle,
      //newVersionDate,
      isDisabled: isDisabled,
      currentVersion: currentVersion,
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
