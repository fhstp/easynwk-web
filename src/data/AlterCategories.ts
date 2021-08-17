import { Alter } from "./Alter";
import { Gender } from "./Gender";
import { Sectors } from "./Sectors";

export type categorizerType = (a: Alter) => string | null;

// export const gender: categorizer = (alter: Alter) => {
//     return alter.currentGender;
// }

function gender(alter: Alter): string {
  return alter.currentGender;
}

export function sector(alter: Alter): string | null {
  if (alter.distance <= 0) return null;

  if (alter.angle < -90) {
    return Sectors[2];
  } else if (alter.angle < 0) {
    return Sectors[3];
  } else if (alter.angle < 90) {
    return Sectors[0];
  } else {
    return Sectors[1];
  }
}

// const Horizons = ["Kreis 3", "Kreis 3 + 2", "Kreis 3 + 2 + 1"];
const Horizons = ["Kreis 3", "Kreis 2", "Kreis 1"];

function horizon(alter: Alter): string | null {
  if (alter.distance <= 0) return null;

  if (alter.distance < 33.33) {
    return Horizons[0];
  } else if (alter.distance < 66.67) {
    return Horizons[1];
  } else if (alter.distance < 100) {
    return Horizons[2];
  } else {
    return Sectors[1];
  }
}

export function getCategoryLabels(key: string): string[] {
  return key === "sector" ? Sectors : key === "horizon" ? Horizons : Gender;
}

export function getCategorizer(key: string): categorizerType {
  return key === "sector" ? sector : key === "horizon" ? horizon : gender;
}
