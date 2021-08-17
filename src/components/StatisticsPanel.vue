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
    <p class="panel-tabs">
      <a :class="{ 'is-active': tab === '' }" @click="go('')">Überblick</a>
      <a :class="{ 'is-active': tab === 'sector' }" @click="go('sector')"
        >Sektoren</a
      >
      <a :class="{ 'is-active': tab === 'horizon' }" @click="go('horizon')"
        >Horizonte</a
      >
      <a :class="{ 'is-active': tab === 'gender' }" @click="go('gender')"
        >Geschlecht</a
      >
    </p>
    <StatisticsTable v-if="tab === ''"></StatisticsTable>
    <StatisticsTableCategories
      v-else
      :categories="tab"
    ></StatisticsTableCategories>
  </nav>
</template>

<script lang="ts">
import { defineComponent, ref } from "vue";
import { useStore } from "@/store";
import StatisticsTable from "@/components/StatisticsTable.vue";
import StatisticsTableCategories from "@/components/StatisticsTableCategories.vue";

export default defineComponent({
  components: { StatisticsTable, StatisticsTableCategories },
  setup() {
    const store = useStore();

    const tab = ref("");

    const go = (newTab: string) => {
      tab.value = newTab;
    };

    // onMounted(() => {
    //   console.log("hello");
    // });

    return {
      tab,
      go,
      hideStatistics: () => {
        store.commit("view/disable", "statistics");
      },
    };
  },
});
</script>

<style scoped lang="scss"></style>
