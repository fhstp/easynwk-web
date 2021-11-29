import { Gender, defaultGender } from "./Gender";
import roles from "./roles.json";

export const Roles = roles.map((d) => d.label);

export function getGenderDefaultByRole(role: string): string {
  const roleInfo = roles.find((d) => d.label == role);
  if (roleInfo) return Gender[roleInfo.defaultGender];
  else return defaultGender;
}
