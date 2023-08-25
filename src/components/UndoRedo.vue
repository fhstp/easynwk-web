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
      @click="toggleFullScreen"
      v-if="canFullscreen()"
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

    const toggleFullScreen = () => {
      if (isFullScreen.value) {
        // switch FROM FULLSCREEN TO NORMAL
        if (document.exitFullscreen) {
          document.exitFullscreen().then(() => {
            isFullScreen.value = false;
          });
        }
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        else if ((document as any).webkitCancelFullScreen) {
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          (document as any).webkitCancelFullScreen();
          isFullScreen.value = false;
        }
      } else {
        // switch TO FULLSCREEN
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const elem = document.documentElement as any;
        if (elem.requestFullscreen) {
          elem.requestFullscreen().then(() => {
            isFullScreen.value = true;
          });
        } else if (elem.webkitRequestFullscreen) {
          elem.webkitRequestFullscreen();
          isFullScreen.value = true;
        } else if (elem.webkitEnterFullScreen) {
          elem.webkitEnterFullScreen();
        }
      }
    };

    return {
      canUndo,
      canRedo,
      undo: () => store.commit("unredo/undo"),
      redo: () => store.commit("unredo/redo"),
      isFullScreen,
      canFullscreen: () =>
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        document.fullscreenEnabled || (document as any).webkitFullscreenEnabled,
      toggleFullScreen,
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
