import {
  allAlterCategorizationKeys,
  getAlterCategorization,
} from "@/data/AlterCategories";
import {
  analyseNWKbyCategory,
  calculateDensity,
  getOrInit,
  NetworkAnalysis,
} from "@/data/NetworkAnalysis";
import { NWK } from "@/data/NWK";
import { Alter } from "./Alter";
import { computed } from "vue";
import { store } from "@/store";

const networkAnalysis = computed((): NetworkAnalysis => {
  const categorization = getAlterCategorization();
  const analysis = analyseNWKbyCategory(store.state.nwk, categorization);
  return getOrInit(analysis, categorization.categories[0]);
});

const SEP = ";";

export function statisticsCSV(
  nwk: NWK,
  displayName: (a: Alter) => string
): string {
  let output = "Auswertung" + SEP + nwk.ego.name;

  for (const cat of allAlterCategorizationKeys) {
    // loop each tab of the statistics panel (below each other on single sheet)
    const categorization = getAlterCategorization(cat);
    const networkAnalysis = analyseNWKbyCategory(nwk, categorization);

    output += "\n\n" + categorization.label + "\n\n";

    output += "Kennzahl";
    for (const label of categorization.categories) {
      output += SEP + label;
    }

    output += "\nNetzwerkgröße";
    for (const label of categorization.categories) {
      output +=
        SEP + getOrInit(networkAnalysis, label).alterConnected.toFixed(0);
    }

    output += "\nBeziehungsgewicht";
    for (const label of categorization.categories) {
      // TODO change to naehenAvg and naehenDev
//      output += SEP + getOrInit(networkAnalysis, label).naehenSum.toFixed(0);
    }

    output += "\nDichte der Kategorie";
    for (const label of categorization.categories) {
      const { alterConnectable, intConnCount } = getOrInit(
        networkAnalysis,
        label
      );
      output +=
        SEP +
        calculateDensity(alterConnectable, intConnCount).toLocaleString(
          undefined,
          {
            minimumFractionDigits: 3,
            maximumFractionDigits: 3,
          }
        );
    }

    output += "\nStar(s)";
    output += categorization.categories
      .map((label) => {
        const { stars, maxDegree } = getOrInit(networkAnalysis, label);
        if (stars.length > 0 && maxDegree > 0) {
          return stars.map((a) => displayName(a)).join(", ");
          //  + " (" + maxDegree + " Beziehungen)"
        } else {
          return "-";
        }
      })
      .reduce((prev, curr) => prev + SEP + curr, "");

    /* bridges were removed from simple statistics
    output += "\nBrücken";
    for (const label of categorization.categories) {
      output +=
        SEP + getOrInit(networkAnalysis, label).bridges.length.toFixed(0);
    }

    output += "\nBrückenperson(en)";
    output += makeComputedAlterGroup(
      networkAnalysis,
      categorization.categories,
      displayName,
      "bridgePersons"
    ).reduce((prev, curr) => prev + SEP + curr, "");
    */

    output += "\nIsolierte";
    output += makeComputedAlterGroup(
      networkAnalysis,
      categorization.categories,
      displayName,
      "isolated"
    ).reduce((prev, curr) => prev + SEP + curr, "");

    output += "\nPersonen ohne Kante zur Ankerperson";
    output += makeComputedAlterGroup(
      networkAnalysis,
      categorization.categories,
      displayName,
      "alterZeroEdge"
    ).reduce((prev, curr) => prev + SEP + curr, "");
  }

  output += "\n\n" + "test" + SEP + "test2" + "\n\n";
  
  for (const cat of allAlterCategorizationKeys) {
    // loop each tab of the statistics panel (below each other on single sheet)
    const categorization = getAlterCategorization(cat);
    const networkAnalysis = analyseNWKbyCategory(nwk, categorization);

    output += categorization.label + SEP;
    output += "Netzwerkgröße (+aktivierbare)" + SEP;
    output += "nach Geschlecht weiblich" + SEP;
    output += "nach Geschlecht männlich" + SEP;
    output += "nach Geschlecht divers" + SEP;
    output += "nach Geschlecht nicht festgelegt" + SEP;
    output += "nach Horizont nah" + SEP;
    output += "nach Horizont mittel" + SEP;
    output += "nach Horizont entfernt" + SEP;
    output += "Durschschn. Nähe (SD)" + SEP;
    output += "Dichte" + SEP;
    output += "Durchschn. Degree (SD)" + SEP;
    output += "Star(s)" + SEP;
    output += "Isolierte" + SEP;
    output += "Personen ohne Kante zum Ego" + SEP;
  }
  output += "\n";

  for (const _ of allAlterCategorizationKeys) {
    // loop each tab of the statistics panel (below each other on single sheet)
  

    output += SEP;
    output += networkAnalysis.value.alterConnected + " (" + networkAnalysis.value.alterConnectable + ")" + SEP;
    
    for (const [i, g] of networkAnalysis.value.genderConnected.entries()) {
      output += g + " (" + networkAnalysis.value.genderConnectable[i] + ")" + SEP
    }
    for (const [i, g] of networkAnalysis.value.horizonConnected.entries()) {
      output += g + " (" + networkAnalysis.value.horizonConnectable[i] + ")" + SEP
    }
    output += networkAnalysis.value.naehenAvg.toFixed(1) + " (" + networkAnalysis.value.naehenDev.toFixed(1) + ")" + SEP;
    output += "Dichte" + SEP;
    output += "Durchschn. Degree (SD)" + SEP;
    output += "Star(s)" + SEP;
    output += "Isolierte" + SEP;
    output += "Personen ohne Kante zum Ego" + SEP;
  }

  return output;
}

function makeComputedAlterGroup(
  networkAnalysis: Map<string, NetworkAnalysis>,
  categoryLabels: string[],
  displayName: (a: Alter) => string,
  group: "stars" | "isolated" | "alterZeroEdge"
) {
  return categoryLabels.map((cat) => {
    const analysis = getOrInit(networkAnalysis, cat);
    if (analysis[group].length > 0) {
      return (
        analysis[group].length +
        " (" +
        analysis[group].map((a) => displayName(a)).join(", ") +
        ")"
      );
    } else {
      return "0";
    }
  });
}
