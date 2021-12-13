import { Store } from "vuex";
import { IStoreState } from ".";

export interface PseudonymState {
  active: boolean;
}

export const pseudonymPlugin = (store: Store<IStoreState>): void => {
  // keep track of undo history as local (non-reactive) vars
  const pseudonyms = new Map<number, string>();

  store.registerModule("pseudonym", {
    namespaced: true,
    state: {
      active: false,
    },
    getters: {
      pseudonize: () => (alterId: number) => pseudonyms.get(alterId),
    },
    mutations: {
      toggle(state: PseudonymState): void {
        state.active = !state.active;
      },
    },
  });

  store.subscribe((mutation, stateAfter: IStoreState) => {
    if (
      stateAfter.pseudonym.active &&
      mutation.type.startsWith("pseudonym/toggle")
    ) {
      for (const alter of stateAfter.nwk.alteri) {
        if (!pseudonyms.get(alter.id)) {
          console.log("add pseudo for " + alter.name);
          pseudonyms.set(alter.id, "max1");
        }
      }
    }
  });

  store.subscribe((mutation, stateAfter: IStoreState) => {
    if (
      stateAfter.pseudonym.active &&
      !mutation.type.startsWith("unredo/") &&
      !mutation.type.startsWith("view/")
    ) {
      for (const alter of stateAfter.nwk.alteri) {
        if (!pseudonyms.get(alter.id)) {
          console.log("add pseudo for " + alter.name);
          pseudonyms.set(alter.id, "max");
        }
      }
    }
  });
};
