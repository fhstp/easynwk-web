<template>
  <section v-if="error" class="modal is-active">
    <div class="modal-background"></div>
    <div class="modal-content">
      <!-- Any other Bulma elements you want -->
      <div class="notification is-warning">
        <h3 class="title">Irgendetwas ist schief gelaufen :-(</h3>

        <p class="block" v-if="canUndo">
          Mit <b>"Rückgängig"</b> kann der Fehler möglicherweiser behoben
          werden.
        </p>

        <p class="block">
          Mit <b>"Zwischenspeicher löschen"</b> können Sie easyNWK in den
          Auslieferungszustand zurücksetzen. <i>Achtung:</i> Dabei gehen die
          momentan bearbeiteten Daten verloren.
        </p>

        <p><b>Zwischengespeicherte Daten:</b> (können kopiert werden)</p>
        <pre class="block">{{ vuexDump }}</pre>

        <div class="buttons">
          <button
            class="button"
            title="Rückgängig"
            @click="undo"
            :disabled="!canUndo"
          >
            <span class="icon">
              <font-awesome-icon icon="undo" />
            </span>
            <span>Rückgängig</span>
          </button>

          <button class="button is-danger" @click="resetLocalData">
            <span class="icon">
              <font-awesome-icon icon="trash-alt" />
            </span>
            <span>Zwischenspeicher löschen</span>
          </button>
        </div>
      </div>
    </div>
  </section>
  <slot v-else></slot>
</template>

<script lang="ts">
import { defineComponent, onErrorCaptured, ref, computed } from "vue";
import { useStore } from "@/store";

export default defineComponent({
  setup() {
    const store = useStore();

    const error = ref(false);
    // const msg = ref("");
    const vuexDump = ref("");

    onErrorCaptured(() => {
      console.log("error boundary invoked.");
      error.value = true;
      //   msg.value = err.toString();
      vuexDump.value = JSON.stringify(store.state, undefined, 2);

      return false;
    });

    const undo = () => {
      error.value = false;
      store.commit("unredo/undo");
    };

    const resetLocalData = () => {
      localStorage.clear();
      window.location.reload();
    };

    return {
      error,
      //   msg,
      vuexDump,
      canUndo: computed(() => {
        return store.state.unredo && store.state.unredo.undoCount > 0;
      }),
      undo,
      resetLocalData,
    };
  },
});
</script>

<style scoped lang="scss">
pre,
p {
  text-align: left;
}

pre {
  font-size: 80%;
  max-height: 10vh;
  overflow: auto;
}
</style>
