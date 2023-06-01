<template>
  <div class="panel">
    <p class="panel-heading" @click.stop="isOpen = !isOpen">
      <span>Karten und Verläufe</span>
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
                <button class="button">
                  <span class="icon">
                    <font-awesome-icon icon="plus-circle" />
                  </span>
                  <span>Neue leere Karte</span>
                  <span></span>
                </button>

                <button
                  class="button"
                  @click="newVersion = true"
                  @click.stop="addNewVersion"
                >
                  <span class="icon">
                    <font-awesome-icon icon="copy" />
                  </span>
                  <span>Karte duplizieren</span>
                </button>

                <button class="button">
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

              <div class="field is-horizontal" v-if="newVersion">
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
                      />
                    </div>
                  </div>
                </div>
              </div>

              <br />

              <div class="field is-horizontal" v-if="newVersion">
                <div class="field-label is-normal">
                  <label class="label">Datum</label>
                </div>
                <div class="field-body">
                  <div class="field">
                    <div class="control">
                      <input class="input" type="date" />
                    </div>
                  </div>
                </div>
              </div>

              <br />

              <div class="buttons" v-if="newVersion">
                <button class="button is-primary" @click="addNewVersion">
                  <span>Speichern</span>
                </button>

                <button class="button is-light" @click="newVersion = false">
                  <span>Abbrechen</span>
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
import { Version } from "@/data/Version";

type InputType = HTMLInputElement | HTMLTextAreaElement;

export default defineComponent({
  props: {
    version: {
      type: Object,
      required: true,
    },
  },
  setup(props) {
    const store = useStore();

    const isOpen = ref(false);

    const newVersion = ref(false);

    const commitVersion = (evt: FocusEvent, field: keyof Version) => {
      const value = (evt.target as InputType).value.trim();
      if (props.version && value !== props.version[field]) {
        const changes = { [field]: value };
        const payload = { index: store.state.view.editIndex, changes };
        store.commit("editVersion", payload);
      }
    };

    const addNewVersion = () => {
      console.log("Adding new version");
      store.commit("addVersion", {
        title: "Neue Version",
        date: "2023-06-01",
      });
    };

    return {
      nwkcomparison: computed(() => store.state.view.nwkcomparison),
      toggleComparison: () => store.commit("view/toggle", "nwkcomparison"),
      isOpen: isOpen,
      newVersion: newVersion,
      addNewVersion: addNewVersion,
    };
  },
});
</script>

<style lang="scss">
.right {
  float: right;
}
</style>
