import { Alter, isConnectable } from "@/data/Alter";
import { Ego } from "@/data/Ego";
import { NWK, initNWKasJSON, loadNWK } from "@/data/NWK";
import { applyAdaptiveNWKDefaults } from "./adaptiveNWKDefaults";

import { loadStateFromStore } from "./localStoragePlugin";
import { Version } from "@/data/Version";
import { CurrentVersion } from "@/data/CurrentVersion";

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

  editCurrentVersion(state: NWK, payload: Partial<CurrentVersion>): void {
    state.currentVersion = { ...state.currentVersion, ...payload };
  },

  newNWK(state: NWK): void {
    loadNWK(state, initNWKasJSON());
  },

  loadNWK(state: NWK, payload: string): void {
    loadNWK(state, payload);
  },

  editVersion(
    state: NWK,
    payload: { index: number; changes: Partial<Version> }
  ): void {
    editVersion(state, payload.index, payload.changes);
  },

  editAlter(
    state: NWK,
    payload: { index: number; changes: Partial<Alter> }
  ): void {
    editAlter(state, payload.index, payload.changes);
  },

  editAlterById(
    state: NWK,
    payload: { id: number; changes: Partial<Alter> }
  ): void {
    const index = state.alteri.findIndex((a) => a.id === payload.id);
    // const index = state.alteri.map((a) => a.id).indexOf(payload.id);
    editAlter(state, index, payload.changes);
  },

  removeAlter(state: NWK, alterIndex: number): void {
    // remove connections to/from alter
    removeAllConnections(state, alterIndex);

    // based on vuex\examples\composition\todomvc\store\mutations.js
    state.alteri.splice(alterIndex, 1);
  },

  addConnection(
    state: NWK,
    payload: { id1: number; id2: number; version: number }
  ): void {
    state.connections.push(payload);
  },

  addClusterConnections(state: NWK, payload: number[]): void {
    for (let i = 0; i < payload.length - 1; i++) {
      for (let x = i + 1; x < payload.length; x++) {
        state.connections.push({
          id1: payload[i],
          id2: payload[x],
          version: payload[state.currentVersion.id],
        });
      }
    }
  },

  removeConnection(state: NWK, payload: { id1: number; id2: number }): void {
    state.connections = state.connections.filter(
      (c) => c.id1 != payload.id1 || c.id2 != payload.id2
    );
    state.connections = state.connections.filter(
      (c) => c.id1 != payload.id2 || c.id2 != payload.id1
    );
  },

  removeClusterConnections(state: NWK, payload: number[]): void {
    state.connections = state.connections.filter(
      (c) => !(payload.includes(c.id1) && payload.includes(c.id2))
    );
  },

  toggleConnection(
    state: NWK,
    payload: { id1: number; id2: number; version: number }
  ): void {
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

export function editAlter(
  state: NWK,
  alterIndex: number | null,
  changes: Partial<Alter>
): void {
  // lookup does not work for 2 parallel mutations (form change & map click)
  if (
    alterIndex != null &&
    alterIndex >= 0 &&
    alterIndex < state.alteri.length
  ) {
    // based on vuex\examples\composition\todomvc\store\mutations.js
    // using spread to merge objects <https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/Spread_syntax#spread_in_object_literals>
    const changedAlter = {
      ...state.alteri[alterIndex],
      ...changes,
    };
    applyAdaptiveNWKDefaults(changedAlter, changes);
    if (!isConnectable(changedAlter)) {
      removeAllConnections(state, alterIndex);
    }
    state.alteri.splice(alterIndex, 1, changedAlter);
  } else {
    console.warn("alter index invalid or out of bounds: " + alterIndex);
  }
}

export function editVersion(
  state: NWK,
  versionIndex: number | null,
  changes: Partial<Alter>
): void {
  // lookup does not work for 2 parallel mutations (form change & map click)
  if (
    versionIndex != null &&
    versionIndex >= 0 &&
    versionIndex < state.versions.length
  ) {
    // based on vuex\examples\composition\todomvc\store\mutations.js
    // using spread to merge objects <https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/Spread_syntax#spread_in_object_literals>
    const changedVersion = {
      ...state.versions[versionIndex],
      ...changes,
    };
    state.versions.splice(versionIndex, 1, changedVersion);
  } else {
    console.warn("version index invalid or out of bounds: " + versionIndex);
  }
}

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
