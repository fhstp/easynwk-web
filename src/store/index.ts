import { InjectionKey } from "vue";
import { createStore, useStore as baseUseStore, Store } from "vuex";

import { Alter } from "@/data/Alter";
import { Ego, initEgo } from "@/data/Ego";

// define your typings for the store state
export interface State {
  ego: Ego;
  alteri: Array<Alter>;
}

// root state object.
// each Vuex instance is just a single state tree.
const state = {
  ego: initEgo(),
  alteri: [],
};

// mutations are operations that actually mutate the state.
// each mutation handler gets the entire state tree as the
// first argument, followed by additional payload arguments.
// mutations must be synchronous and can be recorded by plugins
// for debugging purposes.
const mutations = {
  increment(state: State) {
    state.ego.name = "Rudi";
  },

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  editEgo(state: State, payload: any) {
    // using spread to merge objects <https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/Spread_syntax#spread_in_object_literals>
    state.ego = { ...state.ego, ...payload };
  },
};

export const store = createStore<State>({
  strict: process.env.NODE_ENV !== "production",
  state,
  mutations,
});

// TypeScript support <https://next.vuex.vuejs.org/guide/typescript-support.html#typing-usestore-composition-function>
// define injection key
export const key: InjectionKey<Store<State>> = Symbol();

// define your own `useStore` composition function
export function useStore(): Store<State> {
  return baseUseStore(key);
}
