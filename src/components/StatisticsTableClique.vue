<template>
  <div class="panel-block" style="display: block">
    <table class="table is-fullwidth">
      <thead>
        <tr>
          <th></th>
        </tr>
      </thead>
      <tbody>
        <tr>
          <th title="Clique">{{ t("amountClique") }}</th>
        </tr>
        <tr v-for="(catCliques, index) in cliques" :key="'category-' + index">
          <th>
            <div class="clique-container">
              <div
                v-for="(clique, cliqueIndex) in catCliques"
                :key="'clique-number-' + cliqueIndex"
                class="clique-entry"
              >
                <span
                  class="clique-members"
                  @click="clickCell('clique', categoryLabels[index])"
                  :class="{ clickAble: clique.membersArray.length > 0 }"
                  >{{ clique.members }}</span
                >
                <span class="clique-divider"></span>
                <span
                  class="clique-number"
                  @click="clickCell('clique', categoryLabels[index])"
                  :class="{ clickAble: clique.membersArray.length > 0 }"
                >
                  {{ clique.membersArray.length }} ({{ categoryLabels[index] }})
                </span>
              </div>
            </div>
          </th>
        </tr>
      </tbody>
    </table>
  </div>
</template>

<script lang="ts">
import { computed, defineComponent } from "vue";
import { useStore } from "@/store";
import {
  analyseNWKbyCategory,
  getOrInit,
  NetworkAnalysis,
} from "@/data/NetworkAnalysis";
import {
  CATEGORY_TRANSLATIONS,
  getAlterCategorization,
} from "@/data/AlterCategories";
import de from "@/de";
import en from "@/en";

export default defineComponent({
  mixins: [de, en],
  methods: {
    t(prop: string) {
      return this[document.documentElement.lang][prop];
    },
    translateCategoryKey(categoryKey: string) {
      const lang = document.documentElement.lang;
      const translation = CATEGORY_TRANSLATIONS[categoryKey];

      if (translation && translation[lang]) {
        return translation[lang];
      } else {
        return categoryKey;
      }
    },
  },

  props: {
    categories: {
      type: String,
      required: true,
    },
  },
  setup(props) {
    const store = useStore();

    const categoryLabels = computed((): string[] => {
      return getAlterCategorization(props.categories).categories;
    });

    const networkAnalysis = computed((): Map<string, NetworkAnalysis> => {
      return analyseNWKbyCategory(
        store.state.nwk,
        getAlterCategorization(props.categories)
      );
    });

    const cliques = computed(() => {
      return categoryLabels.value.map((cat) => {
        const analysis = getOrInit(networkAnalysis.value, cat);
        return analysis.clique.map((clique, idx) => {
          return {
            cliqueNumber: `Clique ${idx + 1}`,
            members: clique
              .map((a) => store.getters["displayName"](a))
              .join(", "),
            membersArray: clique.map((a) => store.getters["displayName"](a)),
            sector: cat,
          };
        });
      });
    });

    return {
      categoryLabels,
      cliques,
    };
  },
});
</script>

<style scoped lang="scss">
thead th:not([align]) {
  text-align: right;
}

td:not([align]) {
  text-align: right;
}

th {
  font-weight: normal;
}

th.sizeby > em {
  display: block;
  font-style: normal;
  margin-left: 2em;
}

td div {
  margin-bottom: 5px;
}

td {
  padding: 8px;
  border-bottom: 1px solid #d3d3d3;
  text-align: left;
}
tr:last-child td {
  border-bottom: 1px solid #d3d3d3;
}

.clique-container {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.clique-entry {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 8px 0;
  border-bottom: 1px solid #d3d3d3;
}

.clique-number {
  margin-left: 5vw;
  width: 12vw;
}

.clique-members {
  width: 16vw;
}

.clique-divider {
  width: 1px;
  height: 100%;
}
</style>
