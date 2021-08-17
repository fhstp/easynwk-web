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
          <td>{{ stars }}</td>
        </tr>
        <tr>
          <th>Brücken</th>
          <td>{{ bridgesCount }}</td>
        </tr>
        <tr>
          <th>Brückenperson(en)</th>
          <td>{{ bridgePersons }}</td>
        </tr>
        <tr>
          <th>Personen ohne Beziehungen</th>
          <td>{{ isolated }}</td>
        </tr>
      </tbody>
    </table>
  </div>
</template>

<script lang="ts">
import { computed, defineComponent } from "vue";
import { useStore } from "@/store";
import { calculateDensity, NetworkAnalysis } from "@/data/NetworkAnalysis";

export default defineComponent({
  setup() {
    const store = useStore();

    const networkAnalysis = computed((): NetworkAnalysis => {
      return store.getters.networkAnalysis;
    });

    const density = computed((): number => {
      const { alterCount, intConnCount } = networkAnalysis.value;
      return calculateDensity(alterCount, intConnCount);
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

    return {
      networkSize: computed(() => networkAnalysis.value.alterCount),
      naehenSum: computed(() => networkAnalysis.value.naehenSum),
      density,
      stars,
      isolated,
      bridgePersons,
      bridgesCount: computed(() => networkAnalysis.value.bridges.length),
    };
  },
});
</script>

<style scoped lang="scss">
td:not([align]) {
  text-align: right;
}
</style>
