import { Gender } from "@/data/Gender";

export interface Alter {
  id: number;
  name: string;
  role: string;
  contactOfPartner: boolean;
  currentGender: string;
  age: string;
  note: string;
  edgeWeight: number;
  angle: number;
  distance: number;
  isSelected: boolean;
}

export function initAlter(): Alter {
  return {
    id: -1,
    name: "",
    role: "",
    contactOfPartner: false,
    currentGender: Gender[0],
    age: "",
    note: "",
    edgeWeight: 0,
    angle: 0,
    distance: 0,
    isSelected: false,
  };
}
