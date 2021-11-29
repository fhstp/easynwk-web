export const Gender = [
  "weiblich", // 0
  "männlich", // 1
  "divers", // 2
  "nicht festgelegt", // 3
];

export function shapeByGender(human: boolean, gender: string): string {
  if (!human) return "star";

  if (gender === Gender[0]) return "circle";
  else if (gender === Gender[1]) return "square";
  else if (gender === Gender[2]) return "triangle";
  else return "pentagram";
}

export const defaultGender = Gender[3];
