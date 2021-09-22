import { Alter } from "@/data/Alter";
import { sectorIndex } from "@/data/AlterCategories";
import { getGenderDefaultByRole } from "@/data/Roles";
import { SectorDefaultRoles } from "@/data/Sectors";

export function applyAdaptiveNWKDefaults(
  changedAlter: Alter,
  changes: Partial<Alter>
): void {
  // monitor if user has explicitly set an edge type --> never override that
  if (changedAlter.edgeTypeDefault && "edgeType" in changes) {
    changedAlter.edgeTypeDefault = false;
  }

  // not human -->keine aktuelle Beziehung
  // deceased -->keine aktuelle Beziehung
  if (
    changedAlter.edgeTypeDefault &&
    ("human" in changes || "deceased" in changes)
  ) {
    changedAlter.edgeType =
      changedAlter.human && !changedAlter.deceased ? 1 : 0;
  }

  // monitor if user has explicitly set a role --> never override that
  if (changedAlter.roleDefault && "role" in changes) {
    changedAlter.roleDefault = false;
  }

  if (changedAlter.roleDefault && "angle" in changes) {
    const sector = sectorIndex(changedAlter);
    if (sector != null) changedAlter.role = SectorDefaultRoles[sector];
  }

  // monitor if user has explicitly set a role --> never override that
  if (changedAlter.genderDefault && "currentGender" in changes) {
    changedAlter.genderDefault = false;
  }

  if (changedAlter.genderDefault && "role" in changes) {
    changedAlter.currentGender = getGenderDefaultByRole(changedAlter.role);
  }
}
