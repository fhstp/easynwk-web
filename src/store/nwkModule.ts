import { Alter, isConnectable } from "@/data/Alter";
import { Ego } from "@/data/Ego";
import { NWK, initNWKasJSON, loadNWK } from "@/data/NWK";
import { applyAdaptiveNWKDefaults } from "./adaptiveNWKDefaults";

import { loadStateFromStore } from "./localStoragePlugin";

// root state object.
// each Vuex instance is just a single state tree.
const state = JSON.parse(loadStateFromStore());

// mutations are operations that actually mutate the state.
// each mutation handler gets the entire state tree as the
// first argument, followed by additional payload arguments.
// mutations must be synchronous and can be recorded by plugins
// for debugging purposes.
const mutations = {
  editEgo(state: NWK, payload: Partial<Ego>): void {
    // using spread to merge objects <https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/Spread_syntax#spread_in_object_literals>
    state.ego = { ...state.ego, ...payload };
  },

  newNWK(state: NWK): void {
    loadNWK(state, initNWKasJSON());
  },

  loadNWK(state: NWK, payload: string): void {
    loadNWK(state, payload);
  },

  editAlter(
    state: NWK,
    payload: { index: number; changes: Partial<Alter> }
  ): void {
    // based oen vuex\examples\composition\todomvc\store\mutations.js
    // const index = state.alteri.indexOf(payload.alter);

    // lookup does not work for 2 parallel mutations (form change & map click)
    if (
      payload.index != null &&
      payload.index >= 0 &&
      payload.index < state.alteri.length
    ) {
      // using spread to merge objects <https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/Spread_syntax#spread_in_object_literals>
      const changedAlter = {
        ...state.alteri[payload.index],
        ...payload.changes,
      };
      applyAdaptiveNWKDefaults(changedAlter, payload.changes);
      if (!isConnectable(changedAlter)) {
        removeAllConnections(state, payload.index);
      }
      state.alteri.splice(payload.index, 1, changedAlter);
    } else {
      console.warn("alter index out of bounds: " + payload.index);
    }
  },

  editAlterById(
    state: NWK,
    payload: { id: number; changes: Partial<Alter> }
  ): void {
    const index = state.alteri.findIndex((a) => a.id === payload.id);
    // const index = state.alteri.map((a) => a.id).indexOf(payload.id);
    if (index >= 0) {
      const changedAlter = {
        ...state.alteri[index],
        ...payload.changes,
      };
      applyAdaptiveNWKDefaults(changedAlter, payload.changes);
      state.alteri.splice(index, 1, changedAlter);
    } else {
      console.warn("alter id not found: " + payload.id);
    }
  },

  removeAlter(state: NWK, alterIndex: number): void {
    // remove connections to/from alter
    removeAllConnections(state, alterIndex);

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

  toggleConnection(state: NWK, payload: { id1: number; id2: number }): void {
    const index = state.connections.findIndex(
      (c) => c.id1 === payload.id1 && c.id2 === payload.id2
    );
    if (index >= 0) {
      state.connections.splice(index, 1);
    } else {
      const index2 = state.connections.findIndex(
        (c) => c.id2 === payload.id1 && c.id1 === payload.id2
      );
      if (index2 >= 0) {
        state.connections.splice(index2, 1);
      } else {
        state.connections.push(payload);
      }
    }
  },
};

/**
 * removes all connections to and from an alter
 */
function removeAllConnections(state: NWK, alterIndex: number): void {
  const id = state.alteri[alterIndex].id;
  state.connections = state.connections.filter(
    (c) => c.id1 != id && c.id2 != id
  );
}

export const nwkModule = {
  // namespaced: true,
  state,
  mutations,
};
