import { Alter } from "./Alter";
import { Sectors } from "./Sectors";

export type categorizerType = (a: Alter) => string | null;

// export const gender: categorizer = (alter: Alter) => {
//     return alter.currentGender;
// }

export function gender(alter: Alter): string {
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
