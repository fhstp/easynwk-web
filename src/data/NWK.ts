import { Alter } from "@/data/Alter";
import { Ego, initEgo } from "@/data/Ego";

// define your typings for the store state
export interface NWK {
  ego: Ego;
  alteri: Array<Alter>;
}

export function initNWK(): NWK {
  return {
    ego: initEgo(),
    alteri: [],
  };
}

export function loadNWK(state: NWK, loaded: NWK): void {
  state.ego = loaded.ego;
  state.alteri = loaded.alteri;
}
