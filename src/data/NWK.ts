import { Alter } from "@/data/Alter";
import { Ego, initEgo } from "@/data/Ego";

// define your typings for the store state
export interface NWK {
  ego: Ego;
  alteri: Array<Alter>;
  editIndex: number | null;
}

export function initNWK(): NWK {
  return {
    ego: initEgo(),
    alteri: [],
    editIndex: null,
  };
}

export function loadNWK(state: NWK, loaded: NWK): void {
  state.ego = loaded.ego;
  state.alteri = loaded.alteri;
  state.editIndex = null;
}
