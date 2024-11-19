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
          <th title="Clique">{{ t("amountClique") }}</th>
          <td
            v-for="(cat, i) in categoryLabels"
            :key="i"
            @click="clickCell('clique', cat)"
            :class="{ clickAble: clique[i] != '0' }"
          >
            {{ clique[i] }}
          </td>
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
                  v-for="(cat, i) in categoryLabels"
                  :key="i"
                  @click="clickCell('clique', cat)"
                  :class="{ clickAble: clique[i] != '0' }"
                  >{{ clique.members }}</span
                >
                <span class="clique-divider"></span>
                <span
                  class="clique-number"
                  v-for="(cat, i) in categoryLabels"
                  :key="i"
                  @click="clickCell('clique', cat)"
                  :class="{ clickAble: clique[i] != '0' }"
                >
                  {{ clique.membersArray.length }} ({{ clique.sector }})
                </span>
              </div>
            </div>
          </th>
        </tr>

        <!--
      <tr>
        <th title="Clique">Star Cliquen</th>
        <td
          v-for="(cat, i) in categoryLabels"
          :key="i"
          @click="clickCell('clique', cat)"
          :class="{ clickAble: clique[i] != '0' }"
        >
          Platzhalter
        </td>
      </tr>
      <tr>
        <th title="Clique">Brückenperson Cliquen</th>
        <td
          v-for="(cat, i) in categoryLabels"
          :key="i"
          @click="clickCell('clique', cat)"
          :class="{ clickAble: clique[i] != '0' }"
        >
          Platzhalter
        </td>
      </tr>
      --></tbody>
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
import { HORIZON_KEYS } from "@/data/Horizon";

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

    const clique = computed(() => {
      return categoryLabels.value.map((cat) => {
        const analysis = getOrInit(networkAnalysis.value, cat);
        if (analysis.clique.length > 0) {
          return analysis.clique.length;
        } else {
          return "0";
        }
      });
    });

    const cliques = computed(() => {
      return categoryLabels.value.map((cat) => {
        const analysis = getOrInit(networkAnalysis.value, cat);
        return analysis.clique.map((clique, idx) => {
          const sectors = clique.map((a) =>
            getAlterCategorization(props.categories).categories.find(
              (c) => c === cat
            )
          );
          console.log(sectors);
          return {
            cliqueNumber: `Clique ${idx + 1}`,
            members: clique
              .map((a) => store.getters["displayName"](a))
              .join(", "),
            membersArray: clique.map((a) => store.getters["displayName"](a)),
            sector: sectors.join(", "),
          };
        });
      });
    });

    /* function makeComputedAlterGroup(
      group: "stars" | "isolated" | "alterZeroEdge"
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
      group: "stars" | "isolated" | "alterZeroEdge",
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

     */

    return {
      categoryLabels,
      networkSize: computed((): string[] =>
        categoryLabels.value.map((cat) => {
          const analy = getOrInit(networkAnalysis.value, cat);
          return analy.alterConnected + " (" + analy.alterConnectable + ")";
        })
      ),
      sizeByGender: computed(() => {
        return categoryLabels.value.map((cat) => {
          const analy = getOrInit(networkAnalysis.value, cat);
          return analy.genderConnected.map(
            (g, i) => g + " (" + analy.genderConnectable[i] + ")"
          );
        });
      }),
      HORIZON_KEYS,
      sizeByHorizon: computed(() => {
        return categoryLabels.value.map((cat) => {
          const analy = getOrInit(networkAnalysis.value, cat);
          return analy.horizonConnected.map(
            (g, i) => g + " (" + analy.horizonConnectable[i] + ")"
          );
        });
      }),
      naehen: computed((): string[] =>
        categoryLabels.value.map((cat) => {
          const an = getOrInit(networkAnalysis.value, cat);
          return an.naehenAvg.toFixed(1) + " (" + an.naehenDev.toFixed(1) + ")";
        })
      ),
      degree: computed((): string[] =>
        categoryLabels.value.map((cat) => {
          const an = getOrInit(networkAnalysis.value, cat);
          return an.degreeAvg.toFixed(1) + " (" + an.degreeDev.toFixed(1) + ")";
        })
      ),
      clique,
      cliques,
      //isolated: makeComputedAlterGroup("isolated"),
      //alterZeroEdge: makeComputedAlterGroup("alterZeroEdge"),
      //clickCell,
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
