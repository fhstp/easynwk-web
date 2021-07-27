import { Gender } from "@/data/Gender";
import { v4 as uuid } from "uuid";

export interface Alter {
  id: string;
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
    id: uuid(),
    name: "",
    role: "",
    contactOfPartner: false,
    currentGender: Gender[0],
    age: "",
    note: "",
    edgeWeight: 0,
    angle: 0,
    distance: 0,
    isSelected: true,
  };
}
