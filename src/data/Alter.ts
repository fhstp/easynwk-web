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

  /** angle from x-axis between -180° and +180° */
  angle: number;

  /** distance from center normalized to 100 for the outer horizont.  */
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
