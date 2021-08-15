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
            <td>{{ stars }}</td>
          </tr>
          <tr>
            <th>Brücken</th>
            <td>{{ bridgesCount }}</td>
          </tr>
          <tr>
            <th>Brueckenperson(en)</th>
            <td>{{ bridgePersons }}</td>
          </tr>
          <tr>
            <th>Personen ohne Beziehungen</th>
            <td>{{ isolated }}</td>
          </tr>
        </tbody>
      </table>
    </div>
    <!-- <p class="panel-block" style="display: block">
      <br />
    </p> -->
  </nav>
</template>

<script lang="ts">
import { computed, defineComponent } from "vue";
import { useStore } from "@/store";
import { NetworkAnalysis } from "@/data/NetworkAnalysis";

export default defineComponent({
  setup() {
    const store = useStore();

    const networkSize = computed(() => {
      return store.state.nwk.alteri.length;
    });

    /**
     * calculates the Nähesumme. For each alter sum the Nähesumme, which is an integer between 0 and 9 (9 very close ... 0 on or beyond outer horizon).
     * Based on Java class Position by Nikolaus Kelis (v. 1.4.2)
     */
    const naehenSum = computed(() => {
      let sum = 0;
      for (const alter of store.state.nwk.alteri) {
        sum += Math.max(9 - Math.floor((alter.distance * 9) / 100), 0);
      }
      return sum;
    });

    /*
     * Based on Java class NetworkAnalysis by Nikolaus Kelis (v. 1.4.2)
     */
    const density = computed((): number => {
      if (networkSize.value < 2) {
        return 0.0;
      } else {
        const i = (networkSize.value * (networkSize.value - 1.0)) / 2.0;
        return store.state.nwk.connections.length / i;
      }
    });

    const networkAnalysis = computed((): NetworkAnalysis => {
      return store.getters.networkAnalysis;
    });

    const bridgePersons = computed(() => {
      const alteri = networkAnalysis.value.bridgePersons;
      if (alteri.length > 0) {
        return (
          alteri.length + " (" + alteri.map((a) => a.name).join(", ") + ")"
        );
      } else {
        return "0";
      }
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

    const isolated = computed(() => {
      const alteri = networkAnalysis.value.isolated;
      if (alteri.length > 0) {
        return (
          alteri.length + " (" + alteri.map((a) => a.name).join(", ") + ")"
        );
      } else {
        return "0";
      }
    });

    // onMounted(() => {
    //   console.log("hello");
    // });

    return {
      networkSize,
      naehenSum,
      density,
      stars,
      isolated,
      bridgePersons,
      bridgesCount: computed(() => networkAnalysis.value.bridges.length),
      hideStatistics: () => {
        store.commit("view/disable", "statistics");
      },
    };
  },
});
</script>

<style scoped lang="scss">
td:not([align]) {
  text-align: right;
}
</style>
