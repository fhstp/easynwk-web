export interface ViewOptionsFlags {
  horizons: boolean;
  connections: boolean;
  alteriNames: boolean;
  ageInNwk: boolean;
  roleInNwk: boolean;
}

export interface ViewOptionsState extends ViewOptionsFlags {
  labelSizeInNwk: number;
}

export function initViewOptionsState(): ViewOptionsState {
  return {
    // pseudonyms: true,
    horizons: false,
    connections: true,
    alteriNames: true,
    ageInNwk: false,
    roleInNwk: false,

    labelSizeInNwk: 5,
  };
}

const state = initViewOptionsState();

const getters = {};

const mutations = {
  updateFlag(
    state: ViewOptionsState,
    payload: { flag: keyof ViewOptionsFlags; value: boolean }
  ) {
    state[payload.flag] = payload.value;
  },

  enable(state: ViewOptionsState, flag: keyof ViewOptionsFlags): void {
    state[flag] = true;
  },

  disable(state: ViewOptionsState, flag: keyof ViewOptionsFlags): void {
    state[flag] = false;
  },

  toggle(state: ViewOptionsState, flag: keyof ViewOptionsFlags): void {
    state[flag] = !state[flag];
  },

  setLabelSizeInNwk(state: ViewOptionsState, newSize: number): void {
    state.labelSizeInNwk = newSize;
  },
};

export const viewOptionsModule = {
  namespaced: true,
  state,
  getters,
  mutations,
};
