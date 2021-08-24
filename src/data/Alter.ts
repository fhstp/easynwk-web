import { Gender } from "@/data/Gender";

export interface Alter {
  id: number;
  name: string;
  role: string;
  contactOfPartner: boolean;
  human: boolean;
  currentGender: string;
  age: string;
  note: string;
  edgeWeight: number;

  /** angle from x-axis between -180° and +180° */
  angle: number;

  /** distance from center normalized to 100 for the outer horizont.  */
  distance: number;
}

export function initAlter(): Alter {
  return {
    id: -1,
    name: "",
    role: "",
    contactOfPartner: false,
    human: true,
    currentGender: Gender[0],
    age: "",
    note: "",
    edgeWeight: 0,
    angle: 0,
    distance: 0,
  };
}

/**
 * get the "closeness" of an alter in 9 concentric rings around the ego.
 * 9 = very close, ..., 0 = on or beyond the outer horizon.
 * Based on Java class Position by Nikolaus Kelis (v. 1.4.2)
 * @param alter
 * @returns integer between 9 (close) and 0 (distant)
 */
export function naehenScore(alter: Alter): number {
  return Math.max(9 - Math.floor((alter.distance * 9) / 100), 0);
}
