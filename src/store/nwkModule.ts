import { initAlter } from "@/data/Alter";
import { NWK, initNWKasJSON, loadNWK, TAB_BASE } from "@/data/NWK";

import { loadStateFromStore } from "./localStoragePlugin";

// root state object.
// each Vuex instance is just a single state tree.
const state = JSON.parse(loadStateFromStore());

const getters = {
  editedAlterValid(state: NWK): boolean {
    if (state.editIndex != null) {
      const alter = state.alteri[state.editIndex];
      return alter.distance > 0 && alter.name.trim().length > 0;
    } else {
      // no alter open to edit --> always valid
      return true;
    }
  },
};

// mutations are operations that actually mutate the state.
// each mutation handler gets the entire state tree as the
// first argument, followed by additional payload arguments.
// mutations must be synchronous and can be recorded by plugins
// for debugging purposes.
const mutations = {
  // eslint-disable-next-line
  editEgo(state: NWK, payload: any): void {
    // using spread to merge objects <https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/Spread_syntax#spread_in_object_literals>
    state.ego = { ...state.ego, ...payload };
  },

  newNWK(state: NWK): void {
    loadNWK(state, initNWKasJSON());
  },

  loadNWK(state: NWK, payload: string): void {
    loadNWK(state, payload);
  },

  addAlter(state: NWK): void {
    const newAlter = initAlter();
    // set id depending on alteri in list
    newAlter.id =
      state.alteri.length > 0
        ? Math.max(...state.alteri.map((v) => v.id)) + 1
        : 0;

    // new alter is always added on top of list
    state.alteri.unshift(newAlter);
    state.editIndex = 0;
    state.editTab = TAB_BASE;
  },

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  editAlter(state: NWK, payload: { index: number; changes: any }): void {
    // based oen vuex\examples\composition\todomvc\store\mutations.js
    // const index = state.alteri.indexOf(payload.alter);

    // lookup does not work for 2 parallel mutations (form change & map click)
    if (payload.index >= 0 && payload.index < state.alteri.length) {
      // using spread to merge objects <https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/Spread_syntax#spread_in_object_literals>
      const changedAlter = {
        ...state.alteri[payload.index],
        ...payload.changes,
      };
      state.alteri.splice(payload.index, 1, changedAlter);
    } else {
      console.warn("alter index out of bounds: " + payload.index);
    }
  },

  removeAlter(state: NWK, alterIndex: number): void {
    // remove connections to/from alter
    const id = state.alteri[alterIndex].id;
    state.connections = state.connections.filter(
      (c) => c.id1 != id && c.id2 != id
    );

    // old code
    // this.alteri = this.alteri.filter((item) => item.id !== alterToRemove.id);

    // based oen vuex\examples\composition\todomvc\store\mutations.js
    state.alteri.splice(alterIndex, 1);
  },

  addConnection(state: NWK, payload: { id1: number; id2: number }): void {
    state.connections.push(payload);
  },

  removeConnection(state: NWK, payload: { id1: number; id2: number }): void {
    state.connections = state.connections.filter(
      (c) => c.id1 != payload.id1 || c.id2 != payload.id2
    );
    state.connections = state.connections.filter(
      (c) => c.id1 != payload.id2 || c.id2 != payload.id1
    );
  },

  openAlterForm(
    state: NWK,
    payload: { alterIndex: number; tab?: string }
  ): void {
    state.editIndex = payload.alterIndex;
    state.editTab = payload.tab ? payload.tab : TAB_BASE;
  },

  closeAlterForm(state: NWK): void {
    state.editIndex = null;
  },
};

export const nwkModule = {
  // namespaced: true,
  state,
  getters,
  mutations,
};
