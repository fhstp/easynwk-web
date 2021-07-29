import { initEgo } from "@/data/Ego";
import { Store } from "vuex";
import { State } from ".";

const STORAGE_KEY = "easynwk";

export function initStateFromStore(): State {
  const storedNWK = localStorage.getItem(STORAGE_KEY);
  if (storedNWK != null) {
    return JSON.parse(storedNWK);
  } else {
    return {
      ego: initEgo(),
      alteri: [],
    };
  }
}

// eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types
export const localStoragePlugin = (store: Store<State>) => {
  store.subscribe((mutation, stateAfter: State) => {
    //   if (mutation.type === "UPDATE_DATA") {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(stateAfter));
  });
};
