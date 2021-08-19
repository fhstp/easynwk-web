import { initAlter } from "@/data/Alter";
import { NWK } from "@/data/NWK";
import { InjectionKey } from "vue";
import {
  createLogger,
  createStore,
  useStore as baseUseStore,
  Store,
} from "vuex";

import { IUnReDoState, localStoragePlugin } from "./localStoragePlugin";
import { nwkModule } from "./nwkModule";
import {
  TAB_BASE,
  viewOptionsModule,
  ViewOptionsState,
} from "./viewOptionsModule";

export interface IStoreState {
  nwk: NWK;
  view: ViewOptionsState;
  unredo: IUnReDoState;
}

const getters = {
  editedAlterValid(state: IStoreState): boolean {
    if (state.view.editIndex != null) {
      const alter = state.nwk.alteri[state.view.editIndex];
      return alter.distance > 0 && alter.name.trim().length > 0;
    } else {
      // no alter open to edit --> always valid
      return true;
    }
  },

  // networkAnalysis(state: NWK): NetworkAnalysis {
  //   return analyseNWK(state);
  // },
};

const mutations = {
  addAlter(state: IStoreState): void {
    const newAlter = initAlter();
    // set id depending on alteri in list
    newAlter.id =
      state.nwk.alteri.length > 0
        ? Math.max(...state.nwk.alteri.map((v) => v.id)) + 1
        : 0;

    // new alter is always added on top of list
    state.nwk.alteri.unshift(newAlter);
    state.view.editIndex = 0;
    state.view.editTab = TAB_BASE;
  },
};

const plugins =
  process.env.NODE_ENV !== "production"
    ? [createLogger(), localStoragePlugin]
    : [localStoragePlugin];

export const store = createStore<IStoreState>({
  strict: process.env.NODE_ENV !== "production",
  modules: {
    nwk: nwkModule,
    view: viewOptionsModule,
  },
  getters,
  mutations,
  plugins,
});

// TypeScript support <https://next.vuex.vuejs.org/guide/typescript-support.html#typing-usestore-composition-function>
// define injection key
export const key: InjectionKey<Store<IStoreState>> = Symbol();

// define your own `useStore` composition function
export function useStore(): Store<IStoreState> {
  return baseUseStore(key);
}
