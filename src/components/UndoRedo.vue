<template>
  <div class="buttons">
    <button
      class="button is-small"
      title="Rückgängig"
      @click="undo"
      :disabled="!canUndo"
    >
      <span class="icon">
        <font-awesome-icon icon="undo" />
      </span>
    </button>
    <button
      class="button is-small"
      title="Wiederherstellen"
      @click="redo"
      :disabled="!canRedo"
    >
      <span class="icon">
        <font-awesome-icon icon="redo" />
      </span>
    </button>
  </div>
</template>

<script lang="ts">
import { defineComponent, computed } from "vue";
import { useStore } from "@/store";

export default defineComponent({
  setup() {
    const store = useStore();

    const canUndo = computed(() => {
      return store.state.unredo && store.state.unredo.undoCount > 0;
    });

    const canRedo = computed(() => {
      return store.state.unredo && store.state.unredo.redoCount > 0;
    });

    return {
      canUndo,
      canRedo,
      undo: () => store.commit("unredo/undo"),
      redo: () => store.commit("unredo/redo"),
    };
  },
});
</script>

<style scoped>
div {
  padding-left: 0.5rem;
  margin-left: auto;
}
</style>
