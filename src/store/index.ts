import { InjectionKey } from "vue";
import {
  createLogger,
  createStore,
  useStore as baseUseStore,
  Store,
} from "vuex";

import { SYMBOL_DECEASED } from "@/assets/utils";
import { Alter, initAlter } from "@/data/Alter";
import { NWK } from "@/data/NWK";
import { NWKRecord } from "@/data/NWKRecord";

import { applyAdaptiveNWKDefaults } from "./adaptiveNWKDefaults";

import { IUnReDoState, localStoragePlugin } from "./localStoragePlugin";
import { editAlter, nwkModule } from "./nwkModule";
import { pseudonymPlugin, PseudonymState } from "./pseudonymPlugin";
import {
  TAB_BASE,
  viewOptionsModule,
  ViewOptionsState,
} from "./viewOptionsModule";
import {
  nwkRecordModule,
  nwkRecordMutationsAtRoot,
} from "@/store/nwkRecordModule";

export interface IStoreState {
  nwk: NWK;
  record: NWKRecord;
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
  ...nwkRecordMutationsAtRoot, // import mutations related to NWKRecord

  addAlter(state: IStoreState, initialValues: Partial<Alter> = {}): void {
    // initialize alter with default values and optionally with the passed values
    const newAlter = {
      ...initAlter(),
      ...initialValues,
    };
    applyAdaptiveNWKDefaults(newAlter, initialValues);

    // set id depending on alteri in list
    // bugfix: if any id is undefined, NaN, or null --> default to 1
    const maxIdNWK =
      state.nwk.alteri.length > 0
        ? Math.max(...state.nwk.alteri.map((v) => (v.id ? v.id : 1)))
        : 0;

    const maxIdRecord =
      state.record.versions.length > 0
        ? Math.max(
            ...state.record.versions.map((v) =>
              v.nwk.alteri.length > 0
                ? Math.max(...v.nwk.alteri.map((v) => (v.id ? v.id : 1)))
                : 0
            )
          )
        : 0;

    // console.log(`max id nwk:  ${maxIdNWK}  -- max id record:  ${maxIdRecord} `);
    newAlter.id = Math.max(maxIdNWK, maxIdRecord) + 1;

    // new alter is always added on top of list
    state.nwk.alteri.unshift(newAlter);
    state.view.editIndex = 0;
    state.view.editTab = TAB_BASE;
  },

  // removes a newly added alter from the list
  cancelAddAlter(state: IStoreState, alterIndex: number): void {
    // console.log("cancel " + alterIndex);

    // canceled alter is new and therefore cannot have connections
    // don't delete with index null value (see #97)
    if (alterIndex !== null) {
      state.nwk.alteri.splice(alterIndex, 1);
    }

    state.view.editIndex = null;
    state.view.editTab = "";
  },
  /*cancelAddVersion(state: IStoreState, versionIndex: number): void {
    // canceled alter is new and therefore cannot have connections
    // don't delete with index null value (see #97)
    if (versionIndex !== null) {
      state.nwk.versions.splice(versionIndex, 1);
    }

    state.view.editIndex = null;
    state.view.editTab = "";
  },

   */
  openAlterFormById(
    state: IStoreState,
    payload: { alterId: number; tab?: string }
  ): void {
    const index = state.nwk.alteri.findIndex((a) => a.id === payload.alterId);
    state.view.editIndex = index;
    state.view.editTab = payload.tab ? payload.tab : TAB_BASE;
  },
  editAndCloseAlterForm(
    state: IStoreState,
    payload: { changes: Partial<Alter> }
  ): void {
    const index = state.view.editIndex;

    editAlter(state.nwk, index, payload.changes);

    if (
      index == null ||
      (state.nwk.alteri[index].name.trim().length > 0 &&
        state.nwk.alteri[index].distance > 0)
    ) {
      // only close if the alter is valid (esp. has name)
      state.view.editIndex = null;
      state.view.editTab = "";
    }
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
    record: nwkRecordModule,
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
