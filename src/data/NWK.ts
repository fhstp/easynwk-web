import { Alter } from "@/data/Alter";
import { Ego, initEgo } from "@/data/Ego";
import { Connection } from "./Connection";

export const TAB_BASE = "base";
export const TAB_CONNECTIONS = "connections";

// define your typings for the store state
export interface NWK {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  // [x: string]: any;

  ego: Ego;
  alteri: Array<Alter>;
  connections: Array<Connection>;

  editIndex: number | null;
  editTab: string;
}

export function initNWKasJSON(): string {
  return JSON.stringify({
    ego: initEgo(),
    alteri: [],
    connections: [],

    editIndex: null,
    editTab: "",
  });
}

export function loadNWK(state: NWK, loadedText: string): void {
  const loaded = JSON.parse(loadedText);
  state.ego = loaded.ego;
  state.alteri = loaded.alteri;
  state.connections = loaded.connections;

  // aspects of state to be reseted
  state.editIndex = null;
  state.editTab = "";
}
