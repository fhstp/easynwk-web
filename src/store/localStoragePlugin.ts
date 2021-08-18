/* vuex 4 module handling persistance in localStorage and undo/redo.

undo/redo inspired by <https://github.com/factorial-io/undo-redo-vuex>
and <https://github.com/anthonygore/vuex-undo-redo> */

import { initNWKasJSON } from "@/data/NWK";
import { MutationPayload, Store } from "vuex";
import { IStoreState } from ".";

const STORAGE_KEY = "easynwk";
const UNREDO_MODULE = "unredo";

export interface IUnReDoState {
  undoCount: number;
  redoCount: number;
}

export function loadStateFromStore(): string {
  const storedNWK = localStorage.getItem(STORAGE_KEY);
  if (storedNWK != null) {
    return storedNWK;
  } else {
    return initNWKasJSON();
  }
}

export const localStoragePlugin = (store: Store<IStoreState>): void => {
  // keep track of undo history as local (non-reactive) vars
  const history = {
    initialState: loadStateFromStore(),
    initialViewState: JSON.stringify(store.state.view),
    done: [] as Array<MutationPayload>,
    undone: [] as Array<MutationPayload>,
    replaying: false,
  };

  store.registerModule(UNREDO_MODULE, {
    namespaced: true,
    state: {
      undoCount: 0,
      redoCount: 0,
    },
    mutations: {
      undo(state: IUnReDoState) {
        // console.log("undo, done length is " + history.done.length);

        // move last mutation to undone list
        const last = history.done.pop();
        if (last) {
          state.undoCount--;
          history.undone.push(last);
          state.redoCount++;
        }

        // make subscribers aware that we are replaying
        history.replaying = true;
        // reset to initial state
        store.commit("loadNWK", history.initialState);
        store.state.view = JSON.parse(history.initialViewState);
        // replay all mutations (but last)
        for (const c of history.done) {
          store.commit(c.type, c.payload);
        }
        history.replaying = false;

        // console.log("ok,   done length is " + history.done.length);
      },

      redo(state: IUnReDoState) {
        // handle state modified by user before redo
        if (state.redoCount == 0) {
          history.undone = [];
        }

        // simply commit most recently undone mutation
        const last = history.undone.pop();
        if (last) {
          state.redoCount--;
          history.done.push(last);
          state.undoCount++;

          history.replaying = true;
          store.commit(last.type, last.payload);
          history.replaying = false;
        }
      },
      usermutation(state: IUnReDoState) {
        state.undoCount = history.done.length;
        state.redoCount = 0;
      },
    },
  });

  // track mutation in undo history
  store.subscribe((mutation) => {
    if (!mutation.type.startsWith(UNREDO_MODULE)) {
      if (!history.replaying) {
        history.done.push(mutation);
        store.commit(UNREDO_MODULE + "/usermutation");
      }
    }
  });

  // persist change to NWK in localStorage
  store.subscribe((mutation, stateAfter: IStoreState) => {
    // skip replayed mutations, but persist after undo mutation itself
    // skip internal update counts mutation
    if (
      !(
        history.replaying ||
        mutation.type === UNREDO_MODULE + "/usermutation" ||
        mutation.type.startsWith("view/")
      )
    ) {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(stateAfter.nwk));
    }
  });
};
