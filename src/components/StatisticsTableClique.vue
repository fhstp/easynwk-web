<template>
  <div class="panel-block" style="display: block">
    <table class="table is-fullwidth">
      <tbody>
        <tr>
          <th title="Clique">{{ t("amountClique") }}</th>
          <td>{{ cliquesList.length }}</td>
        </tr>
        <tr
          v-for="(clique, cliqueIndex) in cliquesList"
          :key="'clique-number-' + cliqueIndex"
        >
          <th @click="clickClique(clique.alters)" class="clickAble">
            <template
              v-for="(a, idx) in clique.alters"
              :key="`a_${cliqueIndex}_${idx}`"
            >
              <template v-if="idx > 0">, </template>
              <span :class="{ selalter: isSelected(a.id) }">{{ a.name }}</span>
            </template>
          </th>
          <td>
            {{ clique.description }}
          </td>
        </tr>
      </tbody>
    </table>
  </div>
</template>

<script lang="ts">
import { computed, defineComponent } from "vue";
import { useStore } from "@/store";
import { findCliques } from "@/data/NetworkClustering";
import { sectorIndex } from "@/data/AlterCategories";
import de from "@/de";
import en from "@/en";
import { Alter } from "@/data/Alter";
import { Sectors, SectorsEng } from "@/data/Sectors";

interface AnonymizedAlter {
  id: number;
  name: string;
}
interface CliqueItem {
  alters: AnonymizedAlter[];
  description: string;
}

export default defineComponent({
  mixins: [de, en],
  methods: {
    t(prop: string) {
      return this[document.documentElement.lang][prop];
    },
  },
  setup() {
    const store = useStore();

    const sectorLabels =
      document.documentElement.lang === "de" ? Sectors : SectorsEng;

    const cliques = computed((): Alter[][] => {
      return findCliques(store.state.nwk);
    });

    const cliquesList = computed((): CliqueItem[] => {
      return cliques.value.map((clique) => {
        const sectorIndices = clique
          .map((a) => sectorIndex(a))
          .filter((d) => d !== null);
        const uniqSectorIndices = [...new Set(sectorIndices)];
        console.log(uniqSectorIndices);
        const sectLabels = uniqSectorIndices
          // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
          .map((d) => sectorLabels[d!])
          .join(", ");

        // pseudonymize alteri
        const alters = clique.map((d) => ({
          id: d.id,
          name: store.getters["displayName"](d) as string,
        }));

        return {
          // cliqueNumber: `Clique ${idx + 1}`,
          alters,
          description: clique.length + " (" + sectLabels + ")",
        };
      });
    });

    const clickClique = (alteri: AnonymizedAlter[]) => {
      if (alteri.length > 0) {
        store.commit(
          "session/selectAlters",
          alteri.map((a) => a.id)
        );
      }
    };

    return {
      cliquesList,
      clickClique,
      isSelected: store.getters["session/isSelected"],
    };
  },
});
</script>

<style scoped lang="scss">
span.selalter {
  color: rgb(30, 92, 146);
  font-weight: bold;
}

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
