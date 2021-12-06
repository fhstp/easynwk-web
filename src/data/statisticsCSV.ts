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

const SEP = ";";

export function statisticsCSV(nwk: NWK): string {
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
      output += SEP + getOrInit(networkAnalysis, label).naehenSum.toFixed(0);
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
          return stars.map((a) => a.name).join(", ");
          //  + " (" + maxDegree + " Beziehungen)"
        } else {
          return "-";
        }
      })
      .reduce((prev, curr) => prev + SEP + curr, "");

    output += "\nBrücken";
    for (const label of categorization.categories) {
      output +=
        SEP + getOrInit(networkAnalysis, label).bridges.length.toFixed(0);
    }

    output += "\nBrückenperson(en)";
    output += makeComputedAlterGroup(
      networkAnalysis,
      categorization.categories,
      "bridgePersons"
    ).reduce((prev, curr) => prev + SEP + curr, "");

    output += "\nIsolierte";
    output += makeComputedAlterGroup(
      networkAnalysis,
      categorization.categories,
      "isolated"
    ).reduce((prev, curr) => prev + SEP + curr, "");

    output += "\nPersonen ohne Kante zur Ankerperson";
    output += makeComputedAlterGroup(
      networkAnalysis,
      categorization.categories,
      "alterZeroEdge"
    ).reduce((prev, curr) => prev + SEP + curr, "");
  }

  return output;
}

function makeComputedAlterGroup(
  networkAnalysis: Map<string, NetworkAnalysis>,
  categoryLabels: string[],
  group: "stars" | "isolated" | "bridgePersons" | "alterZeroEdge"
) {
  return categoryLabels.map((cat) => {
    const analysis = getOrInit(networkAnalysis, cat);
    if (analysis[group].length > 0) {
      return (
        analysis[group].length +
        " (" +
        analysis[group].map((a) => a.name).join(", ") +
        ")"
      );
    } else {
      return "0";
    }
  });
}
