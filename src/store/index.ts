import { Alter } from "@/data/Alter";
import { NWK, initNWK, loadNWK } from "@/data/NWK";
import { InjectionKey } from "vue";
import {
  createLogger,
  createStore,
  useStore as baseUseStore,
  Store,
} from "vuex";

import { initStateFromStore, localStoragePlugin } from "./localStoragePlugin";

// root state object.
// each Vuex instance is just a single state tree.
const state = initStateFromStore(initNWK);

// mutations are operations that actually mutate the state.
// each mutation handler gets the entire state tree as the
// first argument, followed by additional payload arguments.
// mutations must be synchronous and can be recorded by plugins
// for debugging purposes.
const mutations = {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  editEgo(state: NWK, payload: any) {
    // using spread to merge objects <https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/Spread_syntax#spread_in_object_literals>
    state.ego = { ...state.ego, ...payload };
  },

  newNWK(state: NWK) {
    loadNWK(state, initNWK());
  },

  loadNWK(state: NWK, payload: NWK) {
    loadNWK(state, payload);
  },

  addAlter(state: NWK, newAlter: Alter) {
    state.alteri.unshift(newAlter);
  },

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  editAlter(state: NWK, payload: { alter: Alter; changes: any }) {
    // based oen vuex\examples\composition\todomvc\store\mutations.js
    const index = state.alteri.indexOf(payload.alter);
    // using spread to merge objects <https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/Spread_syntax#spread_in_object_literals>
    const changedAlter = {
      ...payload.alter,
      ...payload.changes,
    };
    state.alteri.splice(index, 1, changedAlter);
  },

  removeAlter(state: NWK, removableAlter: Alter) {
    // old cold
    // this.alteri = this.alteri.filter((item) => item.id !== alterToRemove.id);

    // based oen vuex\examples\composition\todomvc\store\mutations.js
    state.alteri.splice(state.alteri.indexOf(removableAlter), 1);
  },
};

const plugins =
  process.env.NODE_ENV !== "production"
    ? [createLogger(), localStoragePlugin]
    : [localStoragePlugin];

export const store = createStore<NWK>({
  strict: process.env.NODE_ENV !== "production",
  state,
  mutations,
  plugins,
});

// TypeScript support <https://next.vuex.vuejs.org/guide/typescript-support.html#typing-usestore-composition-function>
// define injection key
export const key: InjectionKey<Store<NWK>> = Symbol();

// define your own `useStore` composition function
export function useStore(): Store<NWK> {
  return baseUseStore(key);
}
