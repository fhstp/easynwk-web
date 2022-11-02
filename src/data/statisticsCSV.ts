import {
  allAlterCategorizationKeys,
  getAlterCategorization,
} from "@/data/AlterCategories";
import {
  analyseNWKbyCategory,
  calculateAverageDegree,
  calculateDensity,
  getOrInit,
  NetworkAnalysis,
} from "@/data/NetworkAnalysis";
import { NWK } from "@/data/NWK";
import { Alter } from "./Alter";

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
      output += SEP + getOrInit(networkAnalysis, label).naehenSum.toFixed(0);
    }

    output += "\nkorrigiertes Beziehungsgewicht";
    for (const label of categorization.categories) {
      output +=
        SEP +
        (
          getOrInit(networkAnalysis, label).naehenSum /
          getOrInit(networkAnalysis, label).alterConnected
        ).toLocaleString(undefined, {
          minimumFractionDigits: 3,
          maximumFractionDigits: 3,
        });
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

    output += "\nDurchschnittlicher Degree";
    for (const label of categorization.categories) {
      const { alterConnectable, intConnCount } = getOrInit(
        networkAnalysis,
        label
      );
      output +=
        SEP +
        calculateAverageDegree(alterConnectable, intConnCount).toLocaleString(
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

  return output;
}

function makeComputedAlterGroup(
  networkAnalysis: Map<string, NetworkAnalysis>,
  categoryLabels: string[],
  displayName: (a: Alter) => string,
  group: "stars" | "isolated" | "bridgePersons" | "alterZeroEdge"
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
