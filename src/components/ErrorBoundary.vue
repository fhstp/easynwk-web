<template>
  <section v-if="error" class="modal is-active">
    <div class="modal-background"></div>
    <div class="modal-content">
      <!-- Any other Bulma elements you want -->
      <div class="notification is-warning">
        <h3 class="title">{{ translate("errorMsg") }}</h3>

        <p class="block" v-if="canUndo">
          {{ translate("errorMsg2") }}
        </p>

        <p class="block">
          {{ translate("errorMsg3") }} <i>{{ translate("errorMsg4") }}</i>
          {{ translate("errorMsg5") }}
        </p>

        <p>
          <b>{{ translate("errorMsg6") }}</b> {{ translate("errorMsg7") }}
        </p>
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
            <span>{{ translate("backMsg") }}</span>
          </button>

          <button class="button is-danger" @click="resetLocalData">
            <span class="icon">
              <font-awesome-icon icon="trash-alt" />
            </span>
            <span>{{ translate("tempMsg") }}</span>
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
    translate(prop: string) {
      console.log(document.documentElement.lang);
      return this[document.documentElement.lang][prop];
    },
  },
  data() {
    return {
      lang: "de",
    };
  },
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
