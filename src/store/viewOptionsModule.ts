export const TAB_BASE = "base";
export const TAB_CONNECTIONS = "connections";

export interface ViewOptionsFlags {
  horizons: boolean;
  connections: boolean;
  alteriNames: boolean;
  statistics: boolean;
  details: boolean;
  roleShort: boolean;
}

export interface ViewOptionsState extends ViewOptionsFlags {
  selected: Set<number>;
  editIndex: number | null;
  editTab: string;
}

export function initViewOptionsState(): ViewOptionsState {
  return {
    // pseudonyms: true,
    horizons: true,
    connections: true,
    alteriNames: true,
    statistics: false,
    details: false,
    roleShort: false,

    selected: new Set<number>(),
    editIndex: null,
    editTab: "",
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

  toggle(state: ViewOptionsState, flag: keyof ViewOptionsFlags): void {
    state[flag] = !state[flag];
  },

  toggleAlterSelected(state: ViewOptionsState, alterId: number): void {
    if (state.selected.has(alterId)) {
      state.selected.delete(alterId);
    } else {
      state.selected.add(alterId);
    }
  },

  selectSingleAlter(state: ViewOptionsState, alterId: number): void {
    if (state.selected.has(alterId) && state.selected.size == 1) {
      // exactly this alter was already selected
      state.selected.clear();
    } else {
      state.selected.clear();
      state.selected.add(alterId);
    }
  },

  selectAlters(state: ViewOptionsState, alterIds: number[]): void {
    state.selected = new Set(alterIds);
  },

  clearSelectedAlters(state: ViewOptionsState): void {
    state.selected.clear();
  },

  openAlterForm(
    state: ViewOptionsState,
    payload: { alterIndex: number; tab?: string }
  ): void {
    state.editIndex = payload.alterIndex;
    state.editTab = payload.tab ? payload.tab : TAB_BASE;
  },

  closeAlterForm(state: ViewOptionsState): void {
    state.editIndex = null;
    state.editTab = "";
  },
};

export const viewOptionsModule = {
  namespaced: true,
  state,
  getters,
  mutations,
};
