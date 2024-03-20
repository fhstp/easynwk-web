<template>
  <section v-if="error" class="modal is-active">
    <div class="modal-background"></div>
    <div class="modal-content">
      <!-- Any other Bulma elements you want -->
      <div class="notification is-warning">
        <h3 class="title">{{ t("sthwentwrong") }}</h3>

        <p class="block" v-if="canUndo">
          {{ t("withmsg") }} <b>"{{ t("canundo") }}"</b> {{ t("canundo2") }}
        </p>

        <p class="block">
          {{ t("withmsg2") }} <b>"{{ t("deletedata") }}"</b>
          {{ t("deletedata2") }} <i>{{ t("attention") }}</i>
          {{ t("attention2") }}
        </p>

        <p>
          <b>{{ t("tempdata") }}</b> {{ t("tempdata2") }}
        </p>
        <pre class="block">{{ vuexDump }}</pre>

        <div class="buttons">
          <button
            class="button"
            :title="t('canundo')"
            @click="undo"
            :disabled="!canUndo"
          >
            <span class="icon">
              <font-awesome-icon icon="undo" />
            </span>
            <span>{{ t("canundo") }}</span>
          </button>

          <button class="button is-danger" @click="resetLocalData">
            <span class="icon">
              <font-awesome-icon icon="trash-alt" />
            </span>
            <span>{{ t("deletetempdata") }}</span>
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
import de from "@/de";
import en from "@/en";

export default defineComponent({
  mixins: [de, en],
  methods: {
    t(prop: string) {
      return this[document.documentElement.lang][prop];
    },
  },
  setup() {
    const store = useStore();

    const error = ref(false);
    // const msg = ref("");
    const vuexDump = ref("");

    onErrorCaptured((err) => {
      console.warn("Error boundary invoked:");
      error.value = true;
      console.log(err);
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
