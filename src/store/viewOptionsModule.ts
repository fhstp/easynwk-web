export interface ViewOptionsState {
  anonymized: boolean;
  horizons: boolean;
  statistics: boolean;
}

export function initViewOptionsState(): ViewOptionsState {
  return {
    anonymized: false,
    horizons: true,
    statistics: false,
  };
}

const state = initViewOptionsState();

const mutations = {
  enable(state: ViewOptionsState, flag: keyof ViewOptionsState): void {
    state[flag] = true;
  },

  disable(state: ViewOptionsState, flag: keyof ViewOptionsState): void {
    state[flag] = false;
  },
};

export const viewOptionsModule = {
  namespaced: true,
  state,
  mutations,
};
