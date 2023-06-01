import { Alter } from "@/data/Alter";
import { Ego, initEgo } from "@/data/Ego";
import { Connection } from "./Connection";
import { Version } from "@/data/Version";

// define your typings for the store state
export interface NWK {
  ego: Ego;
  alteri: Array<Alter>;
  connections: Array<Connection>;
  versions: Array<Version>;
}

export function initNWKasJSON(): string {
  return JSON.stringify({
    ego: initEgo(),
    alteri: [],
    connections: [],
    versions: [],
  });
}

export function loadNWK(state: NWK, loadedText: string): void {
  const loaded = JSON.parse(loadedText);
  state.ego = loaded.ego;
  state.alteri = loaded.alteri;
  state.connections = loaded.connections;
  state.versions = loaded.versions;
}
