import { initAlter } from "@/data/Alter";
import { NWK, initNWK, loadNWK } from "@/data/NWK";
import { InjectionKey } from "vue";
import {
  createLogger,
  createStore,
  useStore as baseUseStore,
  Store,
} from "vuex";

import {
  initStateFromStore,
  IUnReDoState,
  localStoragePlugin,
  ReUnDoModule,
} from "./localStoragePlugin";
import { nwkModule } from "./nwkModule";

export interface IStoreState {
  nwk: NWK;
  unredo: IUnReDoState;
}

// export interface AppState extends NWK {
//   done?: Array<Mutation<AppState>>,
//   undone?: Array<Mutation<AppState>>,
// }

// // root state object.
// // each Vuex instance is just a single state tree.
// const state = initStateFromStore(initNWK);

// // mutations are operations that actually mutate the state.
// // each mutation handler gets the entire state tree as the
// // first argument, followed by additional payload arguments.
// // mutations must be synchronous and can be recorded by plugins
// // for debugging purposes.
// const mutations = {
//   // eslint-disable-next-line @typescript-eslint/no-explicit-any
//   editEgo(state: NWK, payload: any) {
//     // using spread to merge objects <https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/Spread_syntax#spread_in_object_literals>
//     state.ego = { ...state.ego, ...payload };
//   },

//   newNWK(state: NWK) {
//     loadNWK(state, initNWK());
//   },

//   loadNWK(state: NWK, payload: NWK) {
//     loadNWK(state, payload);
//   },

//   addAlter(state: NWK) {
//     const newAlter = initAlter();
//     state.alteri.unshift(newAlter);
//     state.editIndex = 0;
//   },

//   // eslint-disable-next-line @typescript-eslint/no-explicit-any
//   editAlter(state: NWK, payload: { index: number; changes: any }) {
//     // based oen vuex\examples\composition\todomvc\store\mutations.js
//     // const index = state.alteri.indexOf(payload.alter);

//     // lookup does not work for 2 parallel mutations (form change & map click)
//     if (payload.index >= 0 && payload.index < state.alteri.length) {
//       // using spread to merge objects <https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/Spread_syntax#spread_in_object_literals>
//       const changedAlter = {
//         ...state.alteri[payload.index],
//         ...payload.changes,
//       };
//       state.alteri.splice(payload.index, 1, changedAlter);
//     } else {
//       console.warn("alter index out of bounds: " + payload.index);
//     }
//   },

//   removeAlter(state: NWK, alterIndex: number) {
//     // old code
//     // this.alteri = this.alteri.filter((item) => item.id !== alterToRemove.id);

//     // based oen vuex\examples\composition\todomvc\store\mutations.js
//     state.alteri.splice(alterIndex, 1);
//   },

//   openAlterForm(state: NWK, alterIndex: number) {
//     state.editIndex = alterIndex;
//   },

//   closeAlterForm(state: NWK) {
//     state.editIndex = null;
//   },
// };

const plugins =
  process.env.NODE_ENV !== "production"
    ? [createLogger(), localStoragePlugin]
    : [localStoragePlugin];

export const store = createStore<IStoreState>({
  strict: process.env.NODE_ENV !== "production",
  // state,
  // mutations,
  modules: {
    nwk: nwkModule,
    unredo: ReUnDoModule,
  },
  plugins,
});

// TypeScript support <https://next.vuex.vuejs.org/guide/typescript-support.html#typing-usestore-composition-function>
// define injection key
export const key: InjectionKey<Store<IStoreState>> = Symbol();

// define your own `useStore` composition function
export function useStore(): Store<IStoreState> {
  return baseUseStore(key);
}
