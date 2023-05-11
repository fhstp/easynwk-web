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
                    <font-awesome-icon icon="user-secret" />
                  </span>
                  <span>Neue leere Karte</span>
                  <span></span>
                </button>

                <button class="button">
                  <span class="icon">
                    <font-awesome-icon icon="rss" />
                  </span>
                  <span>Karte duplizieren</span>
                </button>

                <br />

                <button class="button">
                  <span class="icon">
                    <font-awesome-icon icon="project-diagram" />
                  </span>
                  <span>Karte ändern</span>
                </button>

                <button class="button" @click.stop="toggleComparison">
                  <span class="icon">
                    <font-awesome-icon icon="font" />
                  </span>
                  <span v-if="!nwkcomparison">Vergleich ein</span>
                  <span v-else>Vergleich aus</span>
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

export default defineComponent({
  setup() {
    const store = useStore();

    const isOpen = ref(false);

    return {
      nwkcomparison: computed(() => store.state.view.nwkcomparison),
      toggleComparison: () => store.commit("view/toggle", "nwkcomparison"),
      isOpen: isOpen,
    };
  },
});
</script>

<style lang="scss">
.right {
  float: right;
}
</style>
