<template>
  <div class="panel-block" style="display: block">
    <table class="table">
      <thead>
        <tr>
          <th></th>
          <th v-for="(cat, i) in categoryLabels" :key="i">{{ cat }}</th>
        </tr>
      </thead>
      <tbody>
        <tr>
          <th>Netzwerkgröße</th>
          <td v-for="(cat, i) in categoryLabels" :key="i">
            {{ networkSize[i] }}
          </td>
        </tr>
        <tr>
          <th>Beziehungsgewicht</th>
          <td v-for="(cat, i) in categoryLabels" :key="i">
            {{ naehenSum[i] }}
          </td>
        </tr>
        <tr>
          <th>Dichte der Kategorie</th>
          <td v-for="(cat, i) in categoryLabels" :key="i">{{ density[i] }}</td>
        </tr>
        <tr>
          <th>Dichte zu anderen Kategorien</th>
          <td v-for="(cat, i) in categoryLabels" :key="i">
            {{ extDensity[i] }}
          </td>
        </tr>
        <tr>
          <th>Star(s) (pro Kategorie)</th>
          <td v-for="(cat, i) in categoryLabels" :key="i">{{ stars[i] }}</td>
        </tr>
        <tr>
          <th>Brücken</th>
          <td v-for="(cat, i) in categoryLabels" :key="i">
            {{ bridgesCount[i] }}
          </td>
        </tr>
        <tr>
          <th>Brückenperson(en)</th>
          <td v-for="(cat, i) in categoryLabels" :key="i">
            {{ bridgePersons[i] }}
          </td>
        </tr>
        <tr>
          <th>Personen ohne Beziehungen</th>
          <td v-for="(cat, i) in categoryLabels" :key="i">{{ isolated[i] }}</td>
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
  calculateExternalDensity,
  getOrInit,
  NetworkAnalysis,
} from "@/data/NetworkAnalysis";
import { getCategorizer, getCategoryLabels } from "@/data/AlterCategories";

export default defineComponent({
  props: {
    categories: {
      type: String,
      required: true,
    },
  },
  setup(props) {
    const store = useStore();

    const categoryLabels = computed((): string[] => {
      return getCategoryLabels(props.categories);
    });

    const networkAnalysis = computed((): Map<string, NetworkAnalysis> => {
      return analyseNWKbyCategory(
        store.state.nwk,
        getCategorizer(props.categories)
      );
    });

    const density = computed((): string[] => {
      const result: string[] = [];
      const analysis = networkAnalysis.value;
      for (const cat of categoryLabels.value) {
        const { alterCount, intConnCount } = getOrInit(analysis, cat);
        result.push(calculateDensity(alterCount, intConnCount).toFixed(3));
      }
      return result;
    });

    const extDensity = computed((): string[] => {
      const result: string[] = [];
      const totalAlteri = store.state.nwk.alteri.length;
      const analysis = networkAnalysis.value;
      for (const cat of categoryLabels.value) {
        const { alterCount, extConnCount } = getOrInit(analysis, cat);
        result.push(
          calculateExternalDensity(
            alterCount,
            totalAlteri - alterCount,
            extConnCount
          ).toFixed(3)
        );
      }
      return result;
    });

    const bridgePersons = computed(() => {
      return categoryLabels.value.map((cat) => {
        const analysis = getOrInit(networkAnalysis.value, cat);
        if (analysis.bridgePersons.length > 0) {
          return (
            analysis.bridgePersons.length +
            " (" +
            analysis.bridgePersons.map((a) => a.name).join(", ") +
            ")"
          );
        } else {
          return "0";
        }
      });
    });

    const stars = computed(() => {
      return categoryLabels.value.map((cat) => {
        const analysis = getOrInit(networkAnalysis.value, cat);
        if (analysis.stars.length > 0 && analysis.maxDegree > 0) {
          return analysis.stars.map((a) => a.name).join(", ");
          //  + " (" + analysis.maxDegree + " Beziehungen)"
        } else {
          return "-";
        }
      });
    });

    const isolated = computed(() => {
      return categoryLabels.value.map((cat) => {
        const analysis = getOrInit(networkAnalysis.value, cat);
        if (analysis.isolated.length > 0) {
          return (
            analysis.isolated.length +
            " (" +
            analysis.isolated.map((a) => a.name).join(", ") +
            ")"
          );
        } else {
          return "0";
        }
      });
    });

    return {
      categoryLabels,
      networkSize: computed((): string[] => {
        return categoryLabels.value.map((cat) =>
          getOrInit(networkAnalysis.value, cat).alterCount.toFixed(0)
        );
      }),
      naehenSum: computed((): string[] => {
        return categoryLabels.value.map((cat) =>
          getOrInit(networkAnalysis.value, cat).naehenSum.toFixed(0)
        );
      }),
      density,
      extDensity,

      stars,
      isolated,
      bridgePersons,
      bridgesCount: computed((): string[] => {
        return categoryLabels.value.map((cat) =>
          getOrInit(networkAnalysis.value, cat).bridges.length.toFixed(0)
        );
      }),
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
