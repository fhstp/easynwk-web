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
          <th :title="t('networkmsg')">
            {{ t("networksize") }}
            <!-- <span class="icon">
            <font-awesome-icon icon="info-circle" />
          </span> -->
          </th>
          <td>{{ networkSize }}</td>
        </tr>
        <tr>
          <th class="sizeby">
            {{ t("sizebygender") }}
            <em>{{ t("female") }}</em>
            <em>{{ t("male") }}</em>
            <em>{{ t("diverse") }}</em>
            <em>{{ t("notspecified") }}</em>
          </th>
          <td>
            <p>&nbsp;</p>
            <p v-for="(gSize, i) in sizeByGender" :key="'g' + i">{{ gSize }}</p>
          </td>
        </tr>
        <tr>
          <th class="sizeby">
            {{ t("sizebyhorizon") }}
            <em v-for="(ho, i) in HORIZON_KEYS" :key="'hl' + i">{{ t(ho) }}</em>
          </th>
          <td>
            <p>&nbsp;</p>
            <p v-for="(hSz, i) in sizeByHorizon" :key="'h' + i">{{ hSz }}</p>
          </td>
        </tr>
        <tr>
          <th :title="t('closenessmsg')">
            {{ t("closeness") }}
          </th>
          <td>{{ naehen }}</td>
        </tr>
        <tr>
          <th :title="t('densitymsg')">
            {{ t("totaldensity") }}
          </th>
          <td>
            {{ density.toFixed(3) }}
          </td>
        </tr>
        <tr>
          <th :title="t('degreemsg')">
            {{ t("degree") }}
          </th>
          <td>
            {{ degree }}
          </td>
        </tr>
        <tr>
          <th :title="t('starsmsg')">
            {{ t("stars") }}
          </th>
          <td @click="clickCell('stars')" :class="{ clickAble: stars != '-' }">
            {{ stars }}
          </td>
        </tr>
        <tr>
          <th :title="t('isolatedmsg')">
            {{ t("isolatedpersons") }}
          </th>
          <td
            @click="clickCell('isolated')"
            :class="{ clickAble: isolated != '0' }"
          >
            {{ isolated }}
          </td>
        </tr>
        <tr>
          <th :title="t('noedgemsg')">
            {{ t("personswithoutedgetotheego") }}
          </th>
          <td
            @click="clickCell('alterZeroEdge')"
            :class="{ clickAble: alterZeroEdge != '0' }"
          >
            {{ alterZeroEdge }}
          </td>
        </tr>
        <!--
        <tr>
          <th title="Clique">Cliquen</th>
          <td
            @click="clickCell('clique')"
            :class="{ clickAble: clique != '0' }"
          >
            {{ clique }}
          </td>
        </tr>
        -->
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
import de from "@/de";
import en from "@/en";
import { HORIZON_KEYS } from "@/data/Horizon";

export default defineComponent({
  mixins: [de, en],
  methods: {
    t(prop: string) {
      return this[document.documentElement.lang][prop];
    },
  },
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
        return document.documentElement.lang == "de"
          ? alteri.map((a) => store.getters["displayName"](a)).join(", ") +
              " (" +
              networkAnalysis.value.maxDegree +
              " Beziehungen)"
          : alteri.map((a) => store.getters["displayName"](a)).join(", ") +
              " (" +
              networkAnalysis.value.maxDegree +
              " relations)";
      } else {
        return document.documentElement.lang == "de" ? "keine" : "none";
      }
    });

    function makeComputedAlterGroup(
      group: "stars" | "isolated" | "alterZeroEdge" | "clique"
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

    const clickCell = (group: "stars" | "isolated" | "alterZeroEdge") => {
      const alteri = networkAnalysis.value[group];
      if (alteri.length > 0) {
        store.commit(
          "session/selectAlters",
          alteri.map((a) => a.id)
        );
      }
    };

    return {
      networkSize: computed(
        () =>
          networkAnalysis.value.alterConnected +
          " (" +
          networkAnalysis.value.alterConnectable +
          ")"
      ),
      sizeByGender: computed(() =>
        networkAnalysis.value.genderConnected.map(
          (g, i) => g + " (" + networkAnalysis.value.genderConnectable[i] + ")"
        )
      ),
      HORIZON_KEYS,
      sizeByHorizon: computed(() =>
        networkAnalysis.value.horizonConnected.map(
          (g, i) => g + " (" + networkAnalysis.value.horizonConnectable[i] + ")"
        )
      ),
      naehen: computed(
        () =>
          networkAnalysis.value.naehenAvg.toFixed(1) +
          " (" +
          networkAnalysis.value.naehenDev.toFixed(1) +
          ")"
      ),
      density,
      degree: computed(
        () =>
          networkAnalysis.value.degreeAvg.toFixed(1) +
          " (" +
          networkAnalysis.value.degreeDev.toFixed(1) +
          ")"
      ),
      stars,
      isolated: makeComputedAlterGroup("isolated"),
      alterZeroEdge: makeComputedAlterGroup("alterZeroEdge"),
      //clique: makeComputedAlterGroup("clique"),
      clickCell,
    };
  },
});
</script>

<style scoped lang="scss">
td:not([align]) {
  text-align: right;
}

th.sizeby > em {
  display: block;
  font-style: normal;
  margin-left: 3em;
}
</style>
