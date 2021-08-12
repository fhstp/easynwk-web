import { Alter } from "@/data/Alter";
import { Ego, initEgo } from "@/data/Ego";
import { Connection } from "./Connection";

// define your typings for the store state
export interface NWK {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  // [x: string]: any;

  ego: Ego;
  alteri: Array<Alter>;
  editIndex: number | null;
  connections: Array<Connection>;
}

export function initNWKasJSON(): string {
  return JSON.stringify({
    ego: initEgo(),
    alteri: [],
    editIndex: null,
    connections: [],
  });
}

export function loadNWK(state: NWK, loadedText: string): void {
  const loaded = JSON.parse(loadedText);
  state.ego = loaded.ego;
  state.alteri = loaded.alteri;
  state.connections = loaded.connections;

  // aspects of state to be reseted
  state.editIndex = null;
}
