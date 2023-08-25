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
    <button
      class="button is-small"
      title="Vollbildmodus"
      @click="fullScreen"
      :v-if="canFullscreen"
    >
      <span class="icon">
        <font-awesome-icon
          :icon="isFullScreen ? 'compress-arrows-alt' : 'expand-arrows-alt'"
        />
      </span>
    </button>
  </div>
</template>

<script lang="ts">
import { defineComponent, computed, ref } from "vue";
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

    const isFullScreen = ref(false);

    return {
      canUndo,
      canRedo,
      undo: () => store.commit("unredo/undo"),
      redo: () => store.commit("unredo/redo"),
      isFullScreen,
      canFullscreen: () => document.fullscreenEnabled,
      fullScreen: () => {
        if (
          window.innerWidth == screen.width &&
          window.innerHeight == screen.height
        ) {
          console.log("from full");
          document.exitFullscreen().then(() => {
            isFullScreen.value = false;
          });
        } else {
          console.log("to full");
          const elem = document.documentElement;
          if (elem.requestFullscreen) {
            elem.requestFullscreen().then(() => {
              isFullScreen.value = true;
            });
          }
        }
      },
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
