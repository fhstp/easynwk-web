import {
  allAlterCategorizationKeys,
  getAlterCategorization,
} from "@/data/AlterCategories";
import {
  analyseNWKbyCategory,
  calculateDensity,
  NetworkAnalysis,
} from "@/data/NetworkAnalysis";
import { NWK } from "@/data/NWK";
import { Alter } from "./Alter";
import { store } from "@/store";

const SEP = ";";
let output = "";
let isFirstTime = true;
export function statisticsCSV(
  nwk: NWK,
  title: string,
  date: string,
  id: number,
): string {

  if (isFirstTime) {
    output += "Name" + SEP;
    output += "Datum" + SEP;
    output += "ID" + SEP;
    output += "Netzwerksektor" + SEP;
    output += "Netzwerkgröße" + SEP;
    output += "Netzwerkgröße (+aktivierbare)" + SEP;
    output += "nach Geschlecht weiblich" + SEP;
    output += "nach Geschlecht weiblich (+aktivierbare)" + SEP;
    output += "nach Geschlecht männlich" + SEP;
    output += "nach Geschlecht männlich (+aktivierbare)" + SEP;
    output += "nach Geschlecht divers" + SEP;
    output += "nach Geschlecht divers (+aktivierbare)" + SEP;
    output += "nach Geschlecht nicht festgelegt" + SEP;
    output += "nach Geschlecht nicht festgelegt (+aktivierbare)" + SEP;
    output += "nach Horizont nah" + SEP;
    output += "nach Horizont nah (+aktivierbare)" + SEP;
    output += "nach Horizont mittel" + SEP;
    output += "nach Horizont mittel (+aktivierbare)" + SEP;
    output += "nach Horizont entfernt" + SEP;
    output += "nach Horizont entfernt (+aktivierbare)" + SEP;
    output += "Durschschn. Nähe" + SEP;
    output += "Durschschn. Nähe (SD)" + SEP;
    output += "Dichte" + SEP;
    output += "Durchschn. Degree" + SEP;
    output += "Durchschn. Degree (SD)" + SEP;
    output += "Star(s)" + SEP;
    output += "Isolierte" + SEP;
    output += "Personen ohne Kante zum Ego" + SEP;
    output += "\n";
    isFirstTime = false;
  }


  for (const cat of allAlterCategorizationKeys) {
    const categorization = getAlterCategorization(cat);
    const networkAnalysisMap = analyseNWKbyCategory(nwk, categorization);
    console.table(Array.from(networkAnalysisMap.entries()));
    console.log(nwk)

    
    
    for (const label of categorization.categories) {
      const networkAnalysis = networkAnalysisMap.get(label);
      if (networkAnalysis) {
        getDataForKeyFigures(networkAnalysis, title, date, id, categorization.label, label);
      }
      output += "\n";
    }
  }
  output += "\n";
  return output;
}

function getDataForKeyFigures(networkAnalysis: NetworkAnalysis, title: string, date: string, id: number, categoryLabel: string, label: string) {
  output += title + SEP; 
  output += date + SEP;
  output += id + SEP;
  output += categoryLabel + (label ? " " + label : "") + SEP;
  output += networkAnalysis.alterConnectable + SEP;
    
  for (const [i, g] of networkAnalysis.genderConnected.entries()) {
    output += g + SEP;
    output += networkAnalysis.genderConnectable[i] + SEP;
  }
  for (const [i, g] of networkAnalysis.horizonConnected.entries()) {
    output += g + SEP;
    output += networkAnalysis.horizonConnectable[i] + SEP;
  }
  output += networkAnalysis.naehenAvg.toString().replace('.', ',') + SEP;
  output += networkAnalysis.naehenDev.toString().replace('.', ',') + SEP;
  const density = calculateDensity(networkAnalysis.alterConnectable, networkAnalysis.intConnCount);
  output += density.toString().replace('.', ',') + SEP;
  output += networkAnalysis.degreeAvg.toString().replace(".", ",") + SEP;
  output += networkAnalysis.degreeDev.toString().replace('.', ',') + SEP;
  output += formatStars(networkAnalysis) + SEP;
  output += formatIsolated(networkAnalysis.isolated) + SEP;
  output += formatZeroEdge(networkAnalysis.alterZeroEdge) + SEP;
}

function formatStars(networkAnalysis: NetworkAnalysis): string {
  const alteri = networkAnalysis.stars;
  if (alteri.length > 0 && networkAnalysis.maxDegree > 0) {
    return document.documentElement.lang == "de"
      ? alteri.map((a) => store.getters["displayName"](a)).join(", ") +
          " (" +
          networkAnalysis.maxDegree +
          " Beziehungen)"
      : alteri.map((a) => store.getters["displayName"](a)).join(", ") +
          " (" +
          networkAnalysis.maxDegree +
          " relations)";
  } else {
    return document.documentElement.lang == "de" ? "keine" : "none";
  }
}

function formatIsolated(alteri: Alter[]): string {
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
}

function formatZeroEdge(alteri: Alter[]): string {
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
}