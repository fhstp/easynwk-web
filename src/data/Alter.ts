import { Gender } from "@/data/Gender";

export interface Alter {
  id: number;
  name: string;
  role: string;
  /** if the role has its initial default value and has NOT been changed by user */
  roleDefault: boolean;
  human: boolean;
  currentGender: string;
  /** if the gender has its initial default value and has NOT been changed by user */
  genderDefault: boolean;
  age: string;
  note: string;
  deceased: boolean;
  /** connection to ego: 1 ... normal, 0 ... currently no edge, 2 ... multiplex edge */
  edgeType: number;
  /** if the edge type has its initial default value and has NOT been changed by user */
  edgeTypeDefault: boolean;

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
    roleDefault: true,
    human: true,
    currentGender: Gender[0],
    genderDefault: true,
    age: "",
    note: "",
    deceased: false,
    edgeType: 1,
    edgeTypeDefault: true,
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
