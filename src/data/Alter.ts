import { defaultGender } from "@/data/Gender";
import { defaultVersion } from "@/data/Version";

export interface Alter {
  id: number;
  version: number;
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
  /** the edge type previously set by user (0, 1, or 2); initially -1 until changed by user */
  edgeTypeByUser: number;

  /** angle from x-axis between -180° and +180° */
  angle: number;

  /** distance from center normalized to 100 for the outer horizont.  */
  distance: number;
}

export function initAlter(): Alter {
  return {
    id: -1,
    version: defaultVersion,
    name: "",
    role: "",
    roleDefault: true,
    human: true,
    currentGender: defaultGender,
    genderDefault: true,
    age: "",
    note: "",
    deceased: false,
    edgeType: 1,
    edgeTypeByUser: -1,
    angle: 0,
    distance: 0,
  };
}

/** check if the alter has been changed by the user. Mandatory fields name and location are ignored.
 */
export function hasOptionalChanges(alter: Alter) {
  return (
    !alter.roleDefault ||
    !alter.genderDefault ||
    !alter.human ||
    alter.age != "" ||
    alter.note != "" ||
    alter.deceased ||
    alter.edgeTypeByUser != -1
  );
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

/**
 * check if the alter can be connected to the ego or another alter.
 * By definition it is not possible to have a connection to a deceased or non-human alter.
 * Neither is it possible to have a connection to an alter placed outside the outer horizon.
 *
 * @param alter
 * @returns true, if a connection from ego or another alter is possible
 */
export function isConnectable(alter: Alter): boolean {
  return alter.human && !alter.deceased && alter.distance <= 100;
}
