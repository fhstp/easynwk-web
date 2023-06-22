import { defaultGender } from "@/data/Gender";

export interface Alter {
  id: number;
  name: string;
  role: string;
  roleDefault: boolean;
  human: boolean;
  currentGender: string;
  genderDefault: boolean;
  age: string;
  note: string;
  deceased: boolean;
  edgeType: number;
  edgeTypeByUser: number;
  angle: number;
  distance: number;
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
  };
}

export function hasOptionalChanges(alter: Alter) {
  return (
    !alter.roleDefault ||
    !alter.genderDefault ||
    !alter.human ||
    alter.age !== "" ||
    alter.note !== "" ||
    alter.deceased ||
    alter.edgeTypeByUser !== -1
  );
}

export function naehenScore(alter: Alter): number {
  return Math.max(9 - Math.floor((alter.distance * 9) / 100), 0);
}

export function isConnectable(alter: Alter): boolean {
  return alter.human && !alter.deceased && alter.distance <= 100;
}
