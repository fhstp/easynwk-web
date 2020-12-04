export const Gender = [
  "nicht festgelegt",
  "weiblich",
  "männlich",
  "divers",
  "kein Mensch"
];

export function shapeByGender(gender: string) {
  if (gender === Gender[1]) return "circle";
  else if (gender === Gender[2]) return "square";
  else if (gender === Gender[3]) return "triangle";
  else if (gender === Gender[4]) return "star";
  else return "pentagram";
}
