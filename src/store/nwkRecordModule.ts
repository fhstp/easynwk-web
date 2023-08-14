import { loadNWKRecordStateFromStore } from "@/store/localStoragePlugin";
// import { initNWKRecordAsJSON } from "@/data/NWKRecord";

const state = JSON.parse(loadNWKRecordStateFromStore());
// const state = JSON.parse(initNWKRecordAsJSON());

const mutations = {
  // n.b. new and load are at root level b/c side-effects on nwkModule
  // editEgo(state: NWKHistory, payload: Partial<Ego>): void {
  //   state.versions[0].nwk.ego = { ...state.versions[0].nwk.ego, ...payload };
  // },
};

export const nwkRecordModule = {
  namespaced: true,
  state,
  mutations,
};
