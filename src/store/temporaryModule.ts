import { initNWKAsJSON, loadNWK, NWK } from "@/data/NWK";
import { Ego } from "@/data/Ego";
import { loadStateFromStore } from "@/store/localStoragePlugin";

const initialState = JSON.parse(loadStateFromStore());

const mutations = {
  newTempNWK(state: NWK): void {
    loadNWK(state, initNWKAsJSON());
  },
  editEgo(state: NWK, payload: Partial<Ego>): void {
    state.ego = { ...state.ego, ...payload };
  },
};

export const temporaryModule = {
  namespaced: true,
  state: {
    temporaryNWK: {
      ego: { ...initialState.ego },
      alteri: [],
      connections: [],
    },
  },
  mutations,
};
