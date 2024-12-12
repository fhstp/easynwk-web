import { Alter } from "./Alter";

type inCategoryType = (catIndex: number, a: Alter) => boolean;

export interface AlterCategorization {
  label: string;
  inCategory: inCategoryType;
  categories: string[];
}

export const CATEGORY_TRANSLATIONS: Record<string, Record<string, string>> = {
  Sektor: {
    de: "Sektor",
    en: "Sector",
  },
  // "Kreis 3": {
  //   de: "Kreis 3",
  //   en: "Circle 3",
  // },
  // "Kreis 3 + 2": {
  //   de: "Kreis 3 + 2",
  //   en: "Circle 3 + 2",
  // },
  // "Kreis 3 + 2 + 1": {
  //   de: "Kreis 3 + 2 + 1",
  //   en: "Circle 3 + 2 + 1",
  // },
  "Prof. Hilfe": {
    de: "Prof. Hilfe",
    en: "Professional Help",
  },
  "Netzwerk ohne prof. Hilfe": {
    de: "Netzwerk ohne prof. Hilfe",
    en: "Network without Professional Help",
  },
  "gesamtes Netzwerk": {
    de: "gesamtes Netzwerk",
    en: "Entire Network",
  },
  // Geschlecht: {
  //   de: "Geschlecht",
  //   en: "Gender",
  // },
  Überblick: {
    de: "Überblick",
    en: "Overview",
  },
  // "Horizont (kumulativ)": {
  //   de: "Horizont (kumulativ)",
  //   en: "Cumulative Horizon",
  // },
  // Horizont: {
  //   de: "Horizont",
  //   en: "Horizon",
  // },
  Familie: {
    de: "Familie",
    en: "Family",
  },
  "Freund*innen / Bekannte": {
    de: "Freund*innen / Bekannte",
    en: "Friends / Acquaintances",
  },
  "Kolleg*innen": {
    de: "Kolleg*innen",
    en: "Colleagues",
  },
  "prof. Helfer*innen": {
    de: "prof. Helfer*innen",
    en: "Professional Helpers",
  },
  // weiblich: {
  //   de: "weiblich",
  //   en: "Female",
  // },
  // männlich: {
  //   de: "männlich",
  //   en: "Male",
  // },
  // divers: {
  //   de: "divers",
  //   en: "Diverse",
  // },
  // "nicht festgelegt": {
  //   de: "nicht festgelegt",
  //   en: "Not Specified",
  // },
};

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

// function horizonIndex(alter: Alter): number {
//   if (alter.distance <= 0) return 100;
//   else if (alter.distance < 33.33) return 0;
//   else if (alter.distance < 66.67) return 1;
//   else if (alter.distance < 100) return 2;
//   else return 100;
// }

const SECTOR: AlterCategorization = {
  label: "Sektor",
  inCategory: (catIndex: number, a: Alter): boolean =>
    sectorIndex(a) === catIndex,
  categories: [
    "Familie",
    "Freund*innen / Bekannte",
    "Kolleg*innen",
    "prof. Helfer*innen",
  ],
};

const PROFI: AlterCategorization = {
  label: "Prof. Hilfe",
  inCategory: (catIndex: number, a: Alter): boolean =>
    (catIndex === 0 && sectorIndex(a) === 3) ||
    (catIndex === 1 && sectorIndex(a) != 3) ||
    catIndex === 2,
  categories: ["prof. Hilfe", "Netzwerk ohne prof. Hilfe", "gesamtes Netzwerk"],
};

/* obsolete categorizations (since Jun 2024)
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
  categories: ["weiblich", "männlich", "divers", "nicht festgelegt,"],
};
*/

// const AGE: AlterCategorization = {
//   label: "Alter",
//   inCategory: (catIndex: number, a: Alter): boolean => {
//     const age = Number.parseFloat(a.age);
//     return (
//       (catIndex == 0 && age >= 0 && age < 19) ||
//       (catIndex == 1 && age >= 19 && age < 65) ||
//       (catIndex == 2 && age >= 65)
//     );
//   },
//   categories: ["0-18", "19-64", ">65+"],
// };

const ALL: AlterCategorization = {
  label: "Überblick",
  inCategory: () => true,
  categories: [""],
};

export function getAlterCategorization(key = ""): AlterCategorization {
  return key === "sector" ? SECTOR : key === "profi" ? PROFI : ALL;
  // : key === "horizon"
  // ? HORIZON
  // : key === "horizon_cum"
  // ? HORIZON_CUM
  // : key === "gender"
  // ? GENDER
  // : key === "age"
  // ? AGE
}

export const allAlterCategorizationKeys = [
  "",
  "sector",
  "profi",
  // "horizon",
  // "horizon_cum",
  // "gender",
  // "age",
];
