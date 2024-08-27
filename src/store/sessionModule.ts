export const TAB_BASE = "base";
export const TAB_CONNECTIONS = "connections";



export interface SessionState {
  selected: Set<number>;
  editIndex: number | null;
  editTab: string;
}

export function initSessionState(): SessionState {
  return {
    selected: new Set<number>(),
    editIndex: null,
    editTab: "",
  };
}

const state = initSessionState();

const getters = {
  isSelected:
    (state: SessionState) =>
    (alterId: number): boolean =>
      state.selected.has(alterId),
};

const mutations = {
  toggleAlterSelected(state: SessionState, alterId: number): void {
    if (state.selected.has(alterId)) {
      state.selected.delete(alterId);
    } else {
      state.selected.add(alterId);
    }
  },

  selectSingleAlter(state: SessionState, alterId: number): void {
    if (state.selected.has(alterId) && state.selected.size == 1) {
      // exactly this alter was already selected
      state.selected.clear();
    } else {
      state.selected.clear();
      state.selected.add(alterId);
    }
  },

  selectAlters(state: SessionState, alterIds: number[]): void {
    state.selected = new Set(alterIds);
  },

  clearSelectedAlters(state: SessionState): void {
    state.selected.clear();
  },

  openAlterForm(
    state: SessionState,
    payload: { alterIndex: number; tab?: string }
  ): void {
    state.editIndex = payload.alterIndex;
    state.editTab = payload.tab ? payload.tab : TAB_BASE;

    // intended side-effect: clearSelectedAlters
    state.selected.clear();
    // TODO nice to select opened alter (but index to id mapping missing)
  },

  closeAlterForm(state: SessionState): void {
    state.editIndex = null;
    state.editTab = "";
  },
};

export const sessionModule = {
  namespaced: true,
  state,
  getters,
  mutations,
};
