<template>
  <div class="panel-block" style="display: block">
    <table class="table is-fullwidth">
      <thead>
        <tr>
          <th></th>
          <th v-for="(cat, i) in categoryLabels" :key="i">
            {{ translateCategoryKey(cat) }}
          </th>
        </tr>
      </thead>
      <tbody>
        <tr>
          <th :title="t('networkmsg')">
            {{ t("networksize") }}
            <!-- <span class="icon">
            <font-awesome-icon icon="info-circle" />
          </span> -->
          </th>
          <td v-for="(cat, i) in categoryLabels" :key="i">
            {{ networkSize[i] }}
          </td>
        </tr>
        <tr>
          <th :title="t('relationshipmsg')">
            {{ t("relationshipweight") }}
          </th>
          <td v-for="(cat, i) in categoryLabels" :key="i">
            {{ naehenSum[i] }}
          </td>
        </tr>
        <tr>
          <th :title="t('densitymsg')">
            {{ t("categorydensity") }}
          </th>
          <td v-for="(cat, i) in categoryLabels" :key="i">{{ density[i] }}</td>
        </tr>
        <!-- <tr>
        <th>Dichte zu anderen Kategorien</th>
        <td v-for="(cat, i) in categoryLabels" :key="i">
          {{ extDensity[i] }}
        </td>
      </tr> -->
        <tr>
          <th :title="t('starsmsg')">
            {{ t("categorystar") }}
          </th>
          <td
            v-for="(cat, i) in categoryLabels"
            :key="i"
            @click="clickCell('stars', cat)"
            :class="{ clickAble: stars[i] != '-' }"
          >
            {{ stars[i] }}
          </td>
        </tr>
        <tr>
          <th :title="t('bridgemsg')">
            {{ t("bridges") }}
          </th>
          <td v-for="(cat, i) in categoryLabels" :key="i">
            {{ bridgesCount[i] }}
          </td>
        </tr>
        <tr>
          <th :title="t('bridgesmsg2')">
            {{ t("bridgepersons") }}
          </th>
          <td
            v-for="(cat, i) in categoryLabels"
            :key="i"
            @click="clickCell('bridgePersons', cat)"
            :class="{ clickAble: bridgePersons[i] != '0' }"
          >
            {{ bridgePersons[i] }}
          </td>
        </tr>
        <tr>
          <th :title="t('isolatedmsg')">
            {{ t("isolatedpersons") }}
          </th>
          <td
            v-for="(cat, i) in categoryLabels"
            :key="i"
            @click="clickCell('isolated', cat)"
            :class="{ clickAble: isolated[i] != '0' }"
          >
            {{ isolated[i] }}
          </td>
        </tr>
        <tr>
          <th :title="t('noedgemsg')">
            {{ t("personswithoutedgetotheego") }}
          </th>
          <td
            v-for="(cat, i) in categoryLabels"
            :key="i"
            @click="clickCell('alterZeroEdge', cat)"
            :class="{ clickAble: alterZeroEdge[i] != '0' }"
          >
            {{ alterZeroEdge[i] }}
          </td>
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
  calculateDensity,
  // calculateExternalDensity,
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

    const density = computed((): string[] => {
      const result: string[] = [];
      const analysis = networkAnalysis.value;
      for (const cat of categoryLabels.value) {
        const { alterConnectable, intConnCount } = getOrInit(analysis, cat);
        result.push(
          calculateDensity(alterConnectable, intConnCount).toLocaleString(
            undefined,
            {
              minimumFractionDigits: 3,
              maximumFractionDigits: 3,
            }
          )
        );
      }
      return result;
    });

    // const extDensity = computed((): string[] => {
    //   const result: string[] = [];
    //   const totalAlteri = store.state.nwk.alteri.length;
    //   const analysis = networkAnalysis.value;

    //   for (const cat of categoryLabels.value) {
    //     const { alterCount, extConnCount } = getOrInit(analysis, cat);
    //     result.push(
    //       calculateExternalDensity(
    //         alterCount,
    //         totalAlteri - alterCount,
    //         extConnCount
    //       ).toFixed(3)
    //     );
    //   }
    //   return result;
    // });

    const stars = computed(() => {
      return categoryLabels.value.map((cat) => {
        const analysis = getOrInit(networkAnalysis.value, cat);
        if (analysis.stars.length > 0 && analysis.maxDegree > 0) {
          return analysis.stars
            .map((a) => store.getters["displayName"](a))
            .join(", ");
          //  + " (" + analysis.maxDegree + " Beziehungen)"
        } else {
          return "-";
        }
      });
    });

    function makeComputedAlterGroup(
      group: "stars" | "isolated" | "bridgePersons" | "alterZeroEdge"
    ) {
      return computed(() => {
        return categoryLabels.value.map((cat) => {
          const analysis = getOrInit(networkAnalysis.value, cat);
          if (analysis[group].length > 0) {
            return (
              analysis[group].length +
              " (" +
              analysis[group]
                .map((a) => store.getters["displayName"](a))
                .join(", ") +
              ")"
            );
          } else {
            return "0";
          }
        });
      });
    }

    const clickCell = (
      group: "stars" | "isolated" | "bridgePersons" | "alterZeroEdge",
      cat: string
    ) => {
      const alteri = getOrInit(networkAnalysis.value, cat)[group];
      if (alteri.length > 0) {
        store.commit(
          "session/selectAlters",
          alteri.map((a) => a.id)
        );
      }
    };

    return {
      categoryLabels,
      networkSize: computed((): string[] => {
        return categoryLabels.value.map((cat) =>
          getOrInit(networkAnalysis.value, cat).alterConnected.toFixed(0)
        );
      }),
      naehenSum: computed((): string[] => {
        return categoryLabels.value.map((cat) =>
          getOrInit(networkAnalysis.value, cat).naehenSum.toFixed(0)
        );
      }),
      density,
      // extDensity,

      stars,
      isolated: makeComputedAlterGroup("isolated"),
      alterZeroEdge: makeComputedAlterGroup("alterZeroEdge"),
      bridgePersons: makeComputedAlterGroup("bridgePersons"),
      bridgesCount: computed((): string[] => {
        return categoryLabels.value.map((cat) =>
          getOrInit(networkAnalysis.value, cat).bridges.length.toFixed(0)
        );
      }),
      clickCell,
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
</style>
