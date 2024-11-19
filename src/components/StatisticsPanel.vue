<template>
  <nav class="panel">
    <p
      class="panel-heading"
      style="display: flex"
      @click.stop="isOpen = !isOpen"
    >
      <span class="icon is-medium">
        <font-awesome-icon icon="chart-bar" size="lg" />
      </span>
      <span>{{ t("keyfigures") }}</span>
      <span style="flex: 1">&nbsp;</span>
      <span class="icon is-medium clickAble">
        <font-awesome-icon v-if="isOpen" icon="chevron-up" />
        <font-awesome-icon v-else icon="chevron-down" size="1x" />
      </span>
    </p>
    <p class="panel-tabs" v-if="isOpen">
      <a
        v-for="cat in categories"
        :key="cat"
        :class="{ 'is-active': tab === cat }"
        @click="go(cat)"
      >
        {{ translateCategoryKey(categoryLabel(cat)) }}
      </a>
    </p>
    <StatisticsTable v-if="isOpen && tab === ''"></StatisticsTable>
    <StatisticsTableCategories
      v-else-if="isOpen && tab !== 'clique'"
      :categories="tab"
    ></StatisticsTableCategories>
    <StatisticsTableClique
      v-else-if="isOpen && tab === 'clique'"
    ></StatisticsTableClique>
    <div class="panel-block" v-else />
  </nav>
</template>

<script lang="ts">
import { computed, defineComponent, ref } from "vue";
import { useStore } from "@/store";
import StatisticsTable from "@/components/StatisticsTable.vue";
import StatisticsTableCategories from "@/components/StatisticsTableCategories.vue";
import StatisticsTableClique from "@/components/StatisticsTableClique.vue";
import {
  allAlterCategorizationKeys,
  getAlterCategorization,
} from "@/data/AlterCategories";
import de from "@/de";
import en from "@/en";
import { CATEGORY_TRANSLATIONS } from "@/data/AlterCategories";

export default defineComponent({
  mixins: [de, en],
  methods: {
    t(prop: string) {
      return this[document.documentElement.lang][prop];
    },
    translateCategoryKey(categoryKey: any) {
      const lang = document.documentElement.lang;
      const translation = CATEGORY_TRANSLATIONS[categoryKey];

      if (translation && translation[lang]) {
        return translation[lang];
      } else {
        return categoryKey;
      }
    },
  },
  components: {
    StatisticsTableClique,
    StatisticsTable,
    StatisticsTableCategories,
  },
  setup() {
    const store = useStore();

    // whether panel is collapsed is managed locally
    const isOpen = ref(false);

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
      isOpen,
      tab,
      go,
    };
  },
});
</script>

<style scoped lang="scss"></style>
