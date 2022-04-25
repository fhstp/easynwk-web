import { Alter, isConnectable } from "@/data/Alter";
import { sectorIndex } from "@/data/AlterCategories";
import { getGenderDefaultByRole } from "@/data/Roles";
import { SectorDefaultRoles } from "@/data/Sectors";

export function applyAdaptiveNWKDefaults(
  changedAlter: Alter,
  changes: Partial<Alter>
): void {
  // monitor if user explicitly sets an edge type --> remember that
  if ("edgeType" in changes) {
    changedAlter.edgeTypeByUser = changedAlter.edgeType;
  }

  if ("human" in changes || "deceased" in changes || "distance" in changes) {
    if (isConnectable(changedAlter)) {
      // use remembered edge type, or by default normal edge
      changedAlter.edgeType =
        changedAlter.edgeTypeByUser >= 0 ? changedAlter.edgeTypeByUser : 1;
    } else {
      // not human --> keine aktuelle Beziehung
      // deceased --> keine aktuelle Beziehung
      changedAlter.edgeType = 0;
    }
  }

  // monitor if user has explicitly set a role --> never override that
  if (changedAlter.roleDefault && "role" in changes) {
    changedAlter.roleDefault = false;
  }

  if (changedAlter.roleDefault && "angle" in changes) {
    const sector = sectorIndex(changedAlter);
    if (sector != null) changedAlter.role = SectorDefaultRoles[sector];
  }

  // monitor if user has explicitly set a gender --> never override that
  if (changedAlter.genderDefault && "currentGender" in changes) {
    changedAlter.genderDefault = false;
  }

  if (changedAlter.genderDefault && "role" in changes) {
    changedAlter.currentGender = getGenderDefaultByRole(changedAlter.role);
  }
}
