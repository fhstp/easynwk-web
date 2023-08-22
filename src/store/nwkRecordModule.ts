import { loadNWKRecordStateFromStore } from "@/store/localStoragePlugin";
import { IStoreState } from ".";
import { NWKRecord, initNWKRecord, loadNWKRecord } from "@/data/NWKRecord";
import { initNWK, NWK } from "@/data/NWK";
import { NWKVersion, initNWKVersion } from "@/data/NWKVersion";

const state = JSON.parse(loadNWKRecordStateFromStore());

const mutations = {
  // n.b. new and load are at root level b/c side-effects on nwkModule (see below)
  editVersion(
    state: NWKRecord,
    payload: { index: number; changes: Partial<NWKVersion> }
  ): void {
    editVersion(state, payload.index, payload.changes);
  },
};

export const nwkRecordMutationsAtRoot = {
  newNWK(state: IStoreState): void {
    // loadNWKRecord(state.record, initNWKRecordAsJSON());
    state.record = initNWKRecord();
    // set nwk as side-effects
    // assume new history has exactly 1 empty nwk
    state.nwk = state.record.versions[0].nwk;
  },

  removeVersion(state: IStoreState, versionIndex: number): void {
    console.log(versionIndex);
    state.record.versions.splice(versionIndex, 1);
  },

  loadJSON(state: IStoreState, payload: string): void {
    // data type needs to handle a JSON with just nwk
    loadNWKRecord(state.record, payload);

    // set nwk as side-effects
    // n.b. we try out if a shared reference to the same nwk object works (otherwise use structuredClone)
    const version = state.record.versions.find(
      (d) => d.id === state.record.currentVersion
    );
    state.nwk = version ? version.nwk : initNWK();
  },

  prepareToSaveJSON(state: IStoreState): void {
    ensureNWKisLinkedInRecord(state);
  },

  switchNWK(state: IStoreState, versionId: number) {
    ensureNWKisLinkedInRecord(state);

    const newVersion = state.record.versions.find((d) => d.id === versionId);
    if (newVersion) {
      state.nwk = newVersion.nwk;
      state.record.currentVersion = versionId;
    }
  },

  addNWKVersion(state: IStoreState, duplicateAll = false) {
    ensureNWKisLinkedInRecord(state);

    const newVersion = initNWKVersion();
    // set id depending on versions in list
    newVersion.id =
      state.record.versions.length > 0
        ? Math.max(...state.record.versions.map((v) => (v.id ? v.id : 1))) + 1
        : 1;
    if (duplicateAll) {
      newVersion.nwk = structuredClone(state.nwk);
    } else {
      // even a blank NWK, clones the Ego
      newVersion.nwk.ego = structuredClone(state.nwk.ego);
    }

    state.nwk = newVersion.nwk;
    state.record.versions.push(newVersion);
    state.record.currentVersion = newVersion.id;
  },

  // TODO delete version
  // TODO import version
};

/** make the NWK object in the current version of the NWKRecord point to the same reference as the NWK object in  */
function ensureNWKisLinkedInRecord(state: IStoreState) {
  const curVersion = state.record.versions.find(
    (d) => d.id === state.record.currentVersion
  );
  if (curVersion) {
    curVersion.nwk = state.nwk;
  } else {
    throw "The current NWK version id was not found in the record.";
  }
}

function editVersion(
  state: NWKRecord,
  versionIndex: number | null,
  changes: Partial<NWKVersion>
): void {
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

export const nwkRecordModule = {
  namespaced: true,
  state,
  mutations,
};
