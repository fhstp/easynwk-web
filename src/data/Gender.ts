export const Gender = [
  "nicht festgelegt", // 0
  "weiblich", // 1
  "männlich", // 2
  "divers", // 3
];

export function shapeByGender(gender: string): string {
  if (gender === Gender[1]) return "circle";
  else if (gender === Gender[2]) return "square";
  else if (gender === Gender[3]) return "triangle";
  else if (gender === Gender[0]) return "pentagram";
  else return "star";
}
