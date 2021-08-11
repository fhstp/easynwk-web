import { NWK, initNWK } from "@/data/NWK";
import { MutationPayload, Store } from "vuex";
import { IStoreState } from ".";
// import { AppState } from ".";

const STORAGE_KEY = "easynwk";
const UNREDO_MODULE = "unredo";

export interface IUnReDoState {
  undoCount: number;
  redoCount: number;
  // done: Array<MutationPayload>;
  // undone: Array<MutationPayload>;
  // replaying: boolean;
}

export function initStateFromStore(): NWK {
  const storedNWK = localStorage.getItem(STORAGE_KEY);
  if (storedNWK != null) {
    return JSON.parse(storedNWK);
  } else {
    return initNWK();
  }
}

export const localStoragePlugin = (store: Store<IStoreState>): void => {
  console.log("plugin created");

  const history = {
    initialState: JSON.stringify(initStateFromStore()),
    done: [] as Array<MutationPayload>,
    undone: [] as Array<MutationPayload>,
    replaying: false,
  };
  // const done: Array<MutationPayload> = [];
  // const replaying = false;

  store.registerModule(UNREDO_MODULE, {
    namespaced: true,
    state: {
      undoCount: 0,
      redoCount: 0,
    },
    mutations: {
      undo(state: IUnReDoState) {
        console.log("undo, done length is " + history.done.length);

        // make subscribers aware that we are replaying
        history.replaying = true;
        store.commit("loadNWK", JSON.parse(history.initialState));
        const last = history.done.pop();
        state.undoCount--;

        for (const c of history.done) {
          store.commit(c.type, c.payload);
        }

        history.replaying = false;

        console.log("ok,   done length is " + history.done.length);
      },
      redo(state: IUnReDoState) {
        console.log("redo");
      },
      setStackLength(state: IUnReDoState, payload: number) {
        state.undoCount = payload;
      },
    },
  });

  store.subscribe((mutation) => {
    if (mutation.type.startsWith(UNREDO_MODULE)) {
      console.log("skip unredo ops");
    } else if (!history.replaying) {
      history.done.push(mutation);
      store.commit("unredo/setStackLength", history.done.length);
      // store.state.unredo.done.push(mutation);
      // store.commit(mutation.type, mutation.payload);
    }
  });

  store.subscribe((mutation, stateAfter: IStoreState) => {
    // skip replayed mutations, but persist after undo mutation itself
    if (!history.replaying) {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(stateAfter.nwk));
    }
  });
};
