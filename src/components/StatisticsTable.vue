<template>
  <div class="panel-block" style="display: block">
    <table class="table is-fullwidth">
      <!-- <thead>
    <tr>
      <th><abbr title="Position">Pos</abbr></th>
      <th>Team</th>
    </tr>
  </thead> -->
      <tbody>
        <tr>
          <th
            title="Anzahl der Kontakte im Netzwerk exklusive Ankerperson und exklusive Personen ohne Kante zur Ankerperson"
          >
            Netzwerkgröße
            <!-- <span class="icon">
              <font-awesome-icon icon="info-circle" />
            </span> -->
          </th>
          <td>{{ networkSize }}</td>
        </tr>
        <tr>
          <th
            title="Summierte Nähe bzw. Distanz der Kontakte zur Ankerperson. Je höher die Kennzahl, umso näher stehen die Personen der Ankerperson."
          >
            Beziehungsgewicht
          </th>
          <td>{{ naehenSum }}</td>
        </tr>
        <tr>
          <th
            title="Verhältnis der tatsächlich vorhandenen zu den theoretisch möglichen Verbindungen (exklusive der Verbindungen zwischen Anker- und Kontaktpersonen, inklusive Personen ohne Kante zur Ankerperson). Optional: Maßzahl liegt zwischen 0 (nur isolierte Kontakte) und 1 (jede Person im Netzwerk ist mit jeder anderen verbunden)."
          >
            Dichte gesamt
          </th>
          <td>
            {{
              density.toLocaleString(undefined, {
                minimumFractionDigits: 3,
                maximumFractionDigits: 3,
              })
            }}
          </td>
        </tr>
        <tr>
          <th
            title="Kontakt(e) mit den meisten Verbindungen im Netzwerk (neben der Ankerperson)"
          >
            Star(s)
          </th>
          <td @click="clickCell('stars')" :class="{ clickAble: stars != '-' }">
            {{ stars }}
          </td>
        </tr>
        <tr>
          <th title="Anzahl der Verbindungen zwischen den Sektoren im Netzwerk">
            Brücken
          </th>
          <td>{{ bridgesCount }}</td>
        </tr>
        <tr>
          <th
            title="Kontakt(e), die einzelne Sektoren im Netzwerk miteinander verbinden"
          >
            Brückenperson(en)
          </th>
          <td
            @click="clickCell('bridgePersons')"
            :class="{ clickAble: bridgePersons != '0' }"
          >
            {{ bridgePersons }}
          </td>
        </tr>
        <tr>
          <th
            title="Kontakt(e), die ausschließlich mit der Ankerperson verbunden sind"
          >
            Isolierte
          </th>
          <td
            @click="clickCell('isolated')"
            :class="{ clickAble: isolated != '0' }"
          >
            {{ isolated }}
          </td>
        </tr>
        <tr>
          <th
            title="Lebende Personen ohne aktualisierte Verbindung zur Ankerperson. Verbindungen mit anderen Personen im Netzwerk und damit indirekte Verbindung zur Ankerperson sind möglich."
          >
            Personen ohne Kante zur Ankerperson
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
          alteri.map((a) => store.getters["displayName"](a)).join(", ") +
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
            alteri.length +
            " (" +
            alteri.map((a) => store.getters["displayName"](a)).join(", ") +
            ")"
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
