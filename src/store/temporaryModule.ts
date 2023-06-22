import { NWK, loadNWK, initNWK } from "@/data/NWK";
import { Ego } from "@/data/Ego";

const state = {
  temporaryNWK: initNWK(), // Initialize the temporary NWK object using initNWK() function
};

const mutations = {
  loadTemporaryNWKData(state: any, loadedText: string) {
    loadNWK(state.temporaryNWK, loadedText);
  },
  saveTemporaryNWKData(state: any) {
    state.version.versions.push({
      id: state.version.currentVersion.id + 1,
      title: "",
      date: "2023-06-15",
      nwk: state.temporaryNWK,
    });

    // Reset temporaryNWK to its initial state
    state.temporaryNWK = initNWK();
  },
  editEgo(state: NWK, payload: Partial<Ego>) {
    state.ego = { ...state.ego, ...payload };
  },
};

export const temporaryModule = {
  namespaced: true,
  state,
  mutations,
};
