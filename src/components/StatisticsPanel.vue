<template>
  <nav class="panel">
    <p class="panel-heading" style="display: flex">
      <span class="icon is-medium">
        <font-awesome-icon icon="chart-bar" size="lg" />
      </span>
      <span>Kennzahlen</span>
      <span style="flex: 1">&nbsp;</span>
      <span class="icon is-medium clickAble" @click="hideStatistics">
        <font-awesome-icon icon="times" size="1x" />
      </span>
    </p>
    <p class="panel-tabs">
      <a
        v-for="cat in categories"
        :key="cat"
        :class="{ 'is-active': tab === cat }"
        @click="go(cat)"
      >
        {{ categoryLabel(cat) }}</a
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
import { computed, defineComponent, ref } from "vue";
import { useStore } from "@/store";
import StatisticsTable from "@/components/StatisticsTable.vue";
import StatisticsTableCategories from "@/components/StatisticsTableCategories.vue";
import {
  allAlterCategorizationKeys,
  getAlterCategorization,
} from "@/data/AlterCategories";

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
      categories: allAlterCategorizationKeys,
      categoryLabel: computed(
        () => (cat: string) => getAlterCategorization(cat).label
      ),
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
