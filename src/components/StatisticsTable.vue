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
          <th :title="t('relationshipmsg')">
            {{ t("relationshipweight") }}
          </th>
          <td>{{ naehenSum }}</td>
        </tr>
        <tr>
          <th :title="t('densitymsg')">
            {{ t("totaldensity") }}
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
          <th :title="t('starsmsg')">
            {{ t("stars") }}
          </th>
          <td @click="clickCell('stars')" :class="{ clickAble: stars != '-' }">
            {{ stars }}
          </td>
        </tr>
        <tr>
          <th :title="t('bridgemsg')">
            {{ t("bridges") }}
          </th>
          <td>{{ bridgesCount }}</td>
        </tr>
        <tr>
          <th :title="t('bridgesmsg2')">
            {{ t("bridgepersons") }}
          </th>
          <td
            @click="clickCell('bridgePersons')"
            :class="{ clickAble: bridgePersons != '0' }"
          >
            {{ bridgePersons }}
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
