import { type Alter } from "@/data/Alter";
import { type Ego, initEgo } from "@/data/Ego";
import { type Connection } from "./Connection";

// define your typings for the store state
export interface NWK {
  ego: Ego;
  alteri: Array<Alter>;
  connections: Array<Connection>;
}

export function initNWK(): NWK {
  return {
    ego: initEgo(),
    alteri: [],
    connections: [],
  };
}

/** load NWK independently from NWKRecord. Only to restore from localstorage */
export function restoreNWK(state: NWK, loadedText: string): void {
  const loaded = JSON.parse(loadedText);
  state.ego = loaded.ego;
  state.alteri = loaded.alteri;
  state.connections = loaded.connections;
}
