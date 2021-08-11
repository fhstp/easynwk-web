import { NWK } from "@/data/NWK";
import { MutationPayload, Store } from "vuex";
import { IStoreState } from ".";
// import { AppState } from ".";

const STORAGE_KEY = "easynwk";
const UNREDO_MODULE = "unredo";

export interface IUnReDoState {
  done: Array<MutationPayload>;
  undone: Array<MutationPayload>;
  replaying: boolean;
}

export function initStateFromStore(initEmptyState: () => NWK): NWK {
  const storedNWK = localStorage.getItem(STORAGE_KEY);
  if (storedNWK != null) {
    return JSON.parse(storedNWK);
  } else {
    return initEmptyState();
  }
}

export const ReUnDoModule = {
  namespaced: true,
  state: {
    done: [],
    undone: [],
    replaying: false,
  },
  mutations: {
    undo(state: any) {
      console.log("undo");
    },
    redo(state: any) {
      console.log("redo");
    },
  },
};

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const localStoragePlugin = (store: Store<IStoreState>): void => {
  console.log("plugin created");

  // store.registerModule(UNREDO_MODULE, );

  // const undoStack: Array<string> = [];

  store.subscribe((mutation, stateAfter: IStoreState) => {
    if (mutation.type.startsWith(UNREDO_MODULE)) {
      console.log("unredo ops");
    } else {
      // store.state.unredo.done.push(mutation);
      // store.commit(mutation.type, mutation.payload);
    }
  });

  store.subscribe((mutation, stateAfter: IStoreState) => {
    //   if (mutation.type === "UPDATE_DATA") {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(stateAfter));
  });
};
