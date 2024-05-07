import { defaultGender } from "./Gender";

export interface Ego {
  name: string;
  age: string;
  currentGender: string;
  note: string;
  size: string;
}

export function initEgo(): Ego {
  return {
    name: "",
    currentGender: defaultGender,
    age: "",
    note: "",
    size: "",
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
