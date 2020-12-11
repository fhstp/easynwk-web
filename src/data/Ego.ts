import { Gender } from "./Gender";

export interface Ego {
  name: string;
  age: string;
  currentGender: string;
  note: string;
}

export function initEgo(): Ego {
  return {
    name: "",
    currentGender: Gender[0],
    age: "",
    note: ""
  };
}

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
