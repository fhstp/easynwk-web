import { SYMBOL_DECEASED } from "@/assets/utils";
import { Alter, initAlter } from "@/data/Alter";
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
import { pseudonymPlugin, PseudonymState } from "./pseudonymPlugin";
import {
  TAB_BASE,
  viewOptionsModule,
  ViewOptionsState,
} from "./viewOptionsModule";

export interface IStoreState {
  nwk: NWK;
  view: ViewOptionsState;
  unredo: IUnReDoState;
  pseudonym: PseudonymState;
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

  displayName(state: IStoreState) {
    return (alter: Alter) =>
      (alter.deceased ? SYMBOL_DECEASED : "") +
      (state.pseudonym.active
        ? store.getters["pseudonym/pseudonize"](alter.id)
        : alter.name);
  },

  // networkAnalysis(state: NWK): NetworkAnalysis {
  //   return analyseNWK(state);
  // },
};

const mutations = {
  addAlter(state: IStoreState): void {
    const newAlter = initAlter();
    // set id depending on alteri in list
    // bugfix: if any id is undefined, NaN, or null --> default to 1
    newAlter.id =
      state.nwk.alteri.length > 0
        ? Math.max(...state.nwk.alteri.map((v) => (v.id ? v.id : 1))) + 1
        : 1;

    // new alter is always added on top of list
    state.nwk.alteri.unshift(newAlter);
    state.view.editIndex = 0;
    state.view.editTab = TAB_BASE;
  },
  // removes a newly added alter from the list
  cancelAddAlter(state: IStoreState, alterIndex: number): void {
    console.log("cancel " + alterIndex);

    // canceled alter is new and therefore cannot have connections
    state.nwk.alteri.splice(alterIndex, 1);

    state.view.editIndex = null;
    state.view.editTab = "";
  },
  openAlterFormById(
    state: IStoreState,
    payload: { alterId: number; tab?: string }
  ): void {
    const index = state.nwk.alteri.findIndex((a) => a.id === payload.alterId);
    state.view.editIndex = index;
    state.view.editTab = payload.tab ? payload.tab : TAB_BASE;
  },
};

const plugins =
  process.env.NODE_ENV !== "production"
    ? [createLogger(), localStoragePlugin, pseudonymPlugin]
    : [localStoragePlugin, pseudonymPlugin];

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
