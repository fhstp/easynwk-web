export interface ViewOptionsFlags {
  anonymized: boolean;
  horizons: boolean;
  connections: boolean;
  statistics: boolean;
}

export interface ViewOptionsState extends ViewOptionsFlags {
  selected: Set<number>;
}

export function initViewOptionsState(): ViewOptionsState {
  return {
    anonymized: false,
    horizons: true,
    connections: true,
    statistics: false,
    selected: new Set<number>(),
  };
}

const state = initViewOptionsState();

const getters = {
  isSelected:
    (state: ViewOptionsState) =>
    (alterId: number): boolean =>
      state.selected.has(alterId),
};

const mutations = {
  enable(state: ViewOptionsState, flag: keyof ViewOptionsFlags): void {
    state[flag] = true;
  },

  disable(state: ViewOptionsState, flag: keyof ViewOptionsFlags): void {
    state[flag] = false;
  },

  toggleAlterSelected(state: ViewOptionsState, alterId: number): void {
    if (state.selected.has(alterId)) {
      state.selected.delete(alterId);
    } else {
      state.selected.add(alterId);
    }
  },

  selectAlters(state: ViewOptionsState, alterIds: number[]): void {
    state.selected = new Set(alterIds);
  },
};

export const viewOptionsModule = {
  namespaced: true,
  state,
  getters,
  mutations,
};
