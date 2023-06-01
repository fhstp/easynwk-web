import { defaultGender } from "./Gender";
import { defaultVersion } from "@/data/Version";

export interface Ego {
  version: number;
  name: string;
  age: string;
  currentGender: string;
  note: string;
}

export function initEgo(): Ego {
  return {
    version: defaultVersion,
    name: "",
    currentGender: defaultGender,
    age: "",
    note: "",
  };
}

// eslint-disable-next-line
export function isEgo(arg: any): arg is Ego {
  return (
    arg &&
    arg.name &&
    typeof arg.name == "string" &&
    arg.age &&
    typeof arg.age == "string" &&
    arg.currentGender &&
    typeof arg.currentGender == "string" &&
    arg.note &&
    typeof arg.note == "string"
  );
}
