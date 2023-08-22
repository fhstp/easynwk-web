<template v-if="versionIndex === store.state.record.currentVersion">
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
            :value="version.title"
            @blur="commitEdit($event, 'title')"
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
            :value="version.date"
            @blur="commitEdit($event, 'date')"
          />
        </div>
      </div>
    </div>
  </div>

  <br />

  <div class="buttons">
    <button class="button is-primary" @click="editVersionFinished($event)">
      <span>Speichern</span>
    </button>

    <button class="button is-light">
      <span>Abbrechen</span>
    </button>
  </div>
</template>

<script lang="ts">
import { defineComponent, ref, computed, onMounted, watch } from "vue";
import { store, useStore } from "@/store";
import { NWKVersion } from "@/data/NWKVersion";

type InputType = HTMLInputElement | HTMLTextAreaElement;

export default defineComponent({
  props: {
    // gets Alter as prop cp. ToDo demo
    version: {
      type: Object,
      required: true,
    },
    versionIndex: {
      type: Number,
      required: true,
    },
  },
  setup(props) {
    const store = useStore();
    const commitEdit = (evt: FocusEvent, field: keyof NWKVersion) => {
      const value = (evt.target as InputType).value.trim();
      if (props.version && value !== props.version[field]) {
        const changes = { [field]: value };
        const payload = { index: store.state.view.editIndex, changes };
        store.commit("record/editVersion", payload);
      }
    };

    const editVersionFinished = (_event: Event) => {
      store.commit("record/editVersion");
    };

    return {
      commitEdit,
      editVersionFinished,
    };
  },
});
</script>

<style scoped></style>
