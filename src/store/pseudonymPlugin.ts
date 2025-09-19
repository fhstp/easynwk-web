import { getRoleAbbrev, PseudonymGenerator } from "@/data/Roles";
import { Store } from "vuex";
import { IStoreState } from ".";

export interface PseudonymState {
  active: boolean;
}

export function initPseudonymState(): PseudonymState {
  return { active: false };
}

export const pseudonymPlugin = (store: Store<IStoreState>): void => {
  // keep track of undo history as local (non-reactive) vars
  const pseudonyms = new Map<number, string>();
  const generator = new PseudonymGenerator();

  store.registerModule("pseudonym", {
    namespaced: true,
    state: initPseudonymState(),
    getters: {
      pseudonize: () => (alterId: number) => pseudonyms.get(alterId) ?? "",
    },
    mutations: {
      toggle(state: PseudonymState): void {
        state.active = !state.active;
      },
    },
  });

  store.subscribe((mutation, stateAfter: IStoreState) => {
    if (mutation.type === "pseudonym/toggle") {
      if (stateAfter.pseudonym.active) {
        // do NOT assume pseudonyms were reset (e.g., b/c undo)
        pseudonyms.clear();
        generator.reset();

        // toggling pseudonyms on --> create for existing alteri
        for (const alter of stateAfter.nwk.alteri) {
          console.log("add pseudo for " + alter.name);
          pseudonyms.set(alter.id, generator.makePseudonym(alter.role));
        }
      } else {
        // toggling pseudonyms off --> throw away
        pseudonyms.clear();
        generator.reset();
      }
    } else if (stateAfter.pseudonym.active) {
      // while pseudonyms are shown
      if (mutation.type === "loadNWK") {
        // loadNWK --> throw away & fill
        generator.reset();
        pseudonyms.clear();
        for (const alter of stateAfter.nwk.alteri) {
          pseudonyms.set(alter.id, generator.makePseudonym(alter.role));
        }
      } else if (mutation.type === "newNWK") {
        // newNWK --> throw away
        pseudonyms.clear();
        generator.reset();
      } else if (mutation.type.startsWith("editAlter")) {
        // alter edited --> check if pseudonym fits role

        const alter =
          "index" in mutation.payload
            ? stateAfter.nwk.alteri[mutation.payload.index]
            : "id" in mutation.payload
            ? stateAfter.nwk.alteri.find((a) => a.id === mutation.payload.id)
            : null;

        if (alter != null) {
          const currPseudo = pseudonyms.get(alter.id);
          if (
            !(currPseudo && currPseudo.startsWith(getRoleAbbrev(alter.role)))
          ) {
            console.log(
              "update pseudonym for " + alter.name + " from " + currPseudo
            );
            pseudonyms.set(alter.id, generator.makePseudonym(alter.role));
          }
        }
      }
    }
  });
};
