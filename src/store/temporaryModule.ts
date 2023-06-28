import { initNWKAsJSON, loadNWK, NWK } from "@/data/NWK";
import { Ego } from "@/data/Ego";
import { loadStateFromStore } from "@/store/localStoragePlugin";
import { ClientHistory } from "@/data/ClientHistory";

const initialState = JSON.parse(loadStateFromStore());

const mutations = {
  newTempNWK(state: NWK): void {
    loadNWK(state, initNWKAsJSON());
  },
  loadTempNWK(state: NWK): void {
    loadNWK(state, initNWKAsJSON());
  },
  editEgo(state: ClientHistory, payload: Partial<Ego>): void {
    state.versions[0].nwk.ego = { ...state.versions[0].nwk.ego, ...payload };
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
