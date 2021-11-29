<template>
  <div class="panel-block" style="display: block">
    <table class="table">
      <!-- <thead>
    <tr>
      <th><abbr title="Position">Pos</abbr></th>
      <th>Team</th>
    </tr>
  </thead> -->
      <tbody>
        <tr>
          <th>Netzwerkgröße</th>
          <td>{{ networkSize }}</td>
        </tr>
        <tr>
          <th>Beziehungsgewicht</th>
          <td>{{ naehenSum }}</td>
        </tr>
        <tr>
          <th>Dichte gesamt</th>
          <td>{{ density.toFixed(3) }}</td>
        </tr>
        <tr>
          <th>Star(s)</th>
          <td @click="clickCell('stars')" :class="{ clickAble: stars != '-' }">
            {{ stars }}
          </td>
        </tr>
        <tr>
          <th>Brücken</th>
          <td>{{ bridgesCount }}</td>
        </tr>
        <tr>
          <th>Brückenperson(en)</th>
          <td
            @click="clickCell('bridgePersons')"
            :class="{ clickAble: bridgePersons != '0' }"
          >
            {{ bridgePersons }}
          </td>
        </tr>
        <tr>
          <th>Isolierte</th>
          <td
            @click="clickCell('isolated')"
            :class="{ clickAble: isolated != '0' }"
          >
            {{ isolated }}
          </td>
        </tr>
        <tr>
          <th
            title="Lorem ipsum dolor sit amet, consectetur adipisici elit, sed eiusmod tempor incidunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquid ex ea commodi consequat. Quis aute iure reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint obcaecat cupiditat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum."
          >
            Personen ohne Kante zur Ankerperson
            <span class="icon">
              <font-awesome-icon icon="info-circle" />
            </span>
          </th>
          <td
            @click="clickCell('alterZeroEdge')"
            :class="{ clickAble: alterZeroEdge != '0' }"
          >
            {{ alterZeroEdge }}
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
  getOrInit,
  NetworkAnalysis,
} from "@/data/NetworkAnalysis";
import { getAlterCategorization } from "@/data/AlterCategories";

export default defineComponent({
  setup() {
    const store = useStore();

    const networkAnalysis = computed((): NetworkAnalysis => {
      const categorization = getAlterCategorization();
      const analysis = analyseNWKbyCategory(store.state.nwk, categorization);
      return getOrInit(analysis, categorization.categories[0]);
    });

    const density = computed((): number => {
      const { alterConnectable, intConnCount } = networkAnalysis.value;
      return calculateDensity(alterConnectable, intConnCount);
    });

    const stars = computed(() => {
      const alteri = networkAnalysis.value.stars;
      if (alteri.length > 0 && networkAnalysis.value.maxDegree > 0) {
        return (
          alteri.map((a) => a.name).join(", ") +
          " (" +
          networkAnalysis.value.maxDegree +
          " Beziehungen)"
        );
      } else {
        return "keine";
      }
    });

    function makeComputedAlterGroup(
      group: "stars" | "isolated" | "bridgePersons" | "alterZeroEdge"
    ) {
      return computed(() => {
        const alteri = networkAnalysis.value[group];
        if (alteri.length > 0) {
          return (
            alteri.length + " (" + alteri.map((a) => a.name).join(", ") + ")"
          );
        } else {
          return "0";
        }
      });
    }

    const clickCell = (
      group: "stars" | "isolated" | "bridgePersons" | "alterZeroEdge"
    ) => {
      const alteri = networkAnalysis.value[group];
      if (alteri.length > 0) {
        store.commit(
          "view/selectAlters",
          alteri.map((a) => a.id)
        );
      }
    };

    return {
      networkSize: computed(() => networkAnalysis.value.alterConnected),
      naehenSum: computed(() => networkAnalysis.value.naehenSum),
      density,
      stars,
      isolated: makeComputedAlterGroup("isolated"),
      alterZeroEdge: makeComputedAlterGroup("alterZeroEdge"),
      bridgePersons: makeComputedAlterGroup("bridgePersons"),
      bridgesCount: computed(() => networkAnalysis.value.bridges.length),
      clickCell,
    };
  },
});
</script>

<style scoped lang="scss">
td:not([align]) {
  text-align: right;
}
</style>
