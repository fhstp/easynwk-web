import { NWK } from "@/data/NWK";
import { Store } from "vuex";

const STORAGE_KEY = "easynwk";

export function initStateFromStore(initEmptyState: () => NWK): NWK {
  const storedNWK = localStorage.getItem(STORAGE_KEY);
  if (storedNWK != null) {
    return JSON.parse(storedNWK);
  } else {
    return initEmptyState();
  }
}

// eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types
export const localStoragePlugin = (store: Store<NWK>) => {
  store.subscribe((mutation, stateAfter: NWK) => {
    //   if (mutation.type === "UPDATE_DATA") {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(stateAfter));
  });
};
