import { defaultGender } from "@/data/Gender";

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
  /** the edge type previously set by user (0, 1, or 2); initially -1 until changed by user */
  edgeTypeByUser: number;

  /** angle from x-axis between -180° and +180° */
  angle: number;

  /** distance from center normalized to 100 for the outer horizont.  */
  distance: number;
  emoji: string;
  conflict: boolean;
  supportEmotional: number;
  supportCognitive: number;
  supportSocial: number;
  supportMaterial: number;
  supportPractical: number;
}

export function initAlter(): Alter {
  return {
    id: -1,
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
    emoji: "",
    conflict: false,
    supportEmotional: 0,
    supportCognitive: 0,
    supportSocial: 0,
    supportMaterial: 0,
    supportPractical: 0,
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
