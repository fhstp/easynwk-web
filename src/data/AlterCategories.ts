import { Alter } from "./Alter";
import { Gender } from "./Gender";
import { Sectors } from "./Sectors";

type inCategoryType = (catIndex: number, a: Alter) => boolean;

export interface AlterCategorization {
  label: string;
  inCategory: inCategoryType;
  categories: string[];
}

export function sectorIndex(alter: Alter): number | null {
  if (alter.distance <= 0) return null;

  if (alter.angle < -90) {
    return 2;
  } else if (alter.angle < 0) {
    return 3;
  } else if (alter.angle < 90) {
    return 0;
  } else {
    return 1;
  }
}

function horizonIndex(alter: Alter): number {
  if (alter.distance <= 0) return 100;
  else if (alter.distance < 33.33) return 0;
  else if (alter.distance < 66.67) return 1;
  else if (alter.distance < 100) return 2;
  else return 100;
}

const SECTOR: AlterCategorization = {
  label: "Sektor",
  inCategory: (catIndex: number, a: Alter): boolean =>
    sectorIndex(a) === catIndex,
  categories: Sectors,
};

const HORIZON_CUM: AlterCategorization = {
  label: "Horizont (kumulativ)",
  inCategory: (catIndex: number, a: Alter): boolean =>
    horizonIndex(a) <= catIndex,
  categories: ["Kreis 3", "Kreis 3 + 2", "Kreis 3 + 2 + 1"],
};

const HORIZON: AlterCategorization = {
  label: "Horizont",
  inCategory: (catIndex: number, a: Alter): boolean =>
    horizonIndex(a) == catIndex,
  categories: ["Kreis 3", "Kreis 2", "Kreis 1"],
};

const GENDER: AlterCategorization = {
  label: "Geschlecht",
  inCategory: (catIndex: number, a: Alter): boolean =>
    a.currentGender === Gender[catIndex],
  categories: Gender,
};

const AGE: AlterCategorization = {
  label: "Alter",
  inCategory: (catIndex: number, a: Alter): boolean => {
    const age = Number.parseFloat(a.age);
    return (
      (catIndex == 0 && age >= 0 && age < 19) ||
      (catIndex == 1 && age >= 19 && age < 65) ||
      (catIndex == 2 && age >= 65)
    );
  },
  categories: ["0-18", "19-64", ">65+"],
};

const ALL: AlterCategorization = {
  label: "Überblick",
  inCategory: () => true,
  categories: [""],
};

export function getAlterCategorization(key = ""): AlterCategorization {
  return key === "sector"
    ? SECTOR
    : key === "horizon"
    ? HORIZON
    : key === "horizon_cum"
    ? HORIZON_CUM
    : key === "gender"
    ? GENDER
    : key === "age"
    ? AGE
    : ALL;
}

export const allAlterCategorizationKeys = [
  "",
  "sector",
  "horizon",
  "horizon_cum",
  "gender",
  "age",
];
