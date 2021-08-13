<template>
  <nav class="panel">
    <p class="panel-heading" style="display: flex">
      <span class="icon is-medium">
        <font-awesome-icon icon="chart-bar" size="lg" />
      </span>
      <span>Kennzahlen</span>
      <span style="flex: 1">&nbsp;</span>
      <span class="icon is-medium" @click="hideStatistics">
        <font-awesome-icon icon="times" size="1x" />
      </span>
    </p>
    <!-- <p class="panel-tabs">
      <a class="is-active">Überblick</a>
      <a>Sektoren</a>
      <a>Horizonte</a>
      <a>Geschlecht</a>
    </p> -->
    <p class="panel-block" style="display: block">
      Netzwerkgröße: 7<br />
      Beziehungsgewicht: 8 <br />
      Dichte gesamt: 0,2<br />
      <br />

      Bruecken: 1<br />

      Brueckenpersonen: 2<br />
      - Emil<br />
      - Eva<br />

      Star: Maria Isolierte: 1<br />
      - Lara<br />
    </p>
    <!-- <p class="panel-block" style="display: block">
      <br />
    </p> -->
  </nav>
</template>

<script lang="ts">
import { defineComponent, onMounted } from "vue";
import { useStore } from "@/store";

export default defineComponent({
  setup() {
    const store = useStore();

    onMounted(() => {
      console.log("hello");
    });

    return {
      hideStatistics: () => {
        store.commit("view/disable", "statistics");
      },
    };
  },
});
</script>

<style scoped lang="scss"></style>
