import { Gender, defaultGender } from "./Gender";
import rolesEN from "./roles_en.json";
import rolesDE from "./roles_de.json";

export const RolesEng = rolesEN.map((d) => ({
  german: d.german,
  label: d.label,
}));

export const Roles = rolesDE.map((d) => ({ german: d.german, label: d.label }));

const DEFAULT_ABBREV = "X";

export function getGenderDefaultByRole(role: string): string {
  const roleInfo = rolesDE.find((d) => d.german == role);
  if (roleInfo) return Gender[roleInfo.gender];
  else return defaultGender;
}

export function getRoleAbbrev(role: string): string {
  const roleInfo = rolesDE.find((d) => d.german == role);
  if (roleInfo) return roleInfo.abbrev;
  else return DEFAULT_ABBREV;
}

/**
 * generate unique pseudonyms based on role abbreviation and an increasing index number
 */
export class PseudonymGenerator {
  /** stores maximum index for each abbrev in the pseudonyms made */
  private indexByAbbrev = new Map<string, number>();

  public makePseudonym(role: string): string {
    const abbrev = getRoleAbbrev(role);

    const indexKnown = this.indexByAbbrev.get(abbrev);
    if (indexKnown !== undefined) {
      const indexNew = indexKnown + 1;
      // update map of used indices
      this.indexByAbbrev.set(abbrev, indexNew);
      return abbrev + indexNew;
    } else {
      // update map of used indices
      this.indexByAbbrev.set(abbrev, 1);

      // the first pseudonym does NOT get an index number
      return abbrev;
    }
  }

  public reset(): void {
    console.log(this.indexByAbbrev.size);
    this.indexByAbbrev.clear();
    console.log(this.indexByAbbrev.size);
  }
}
