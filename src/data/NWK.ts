import { Alter } from "@/data/Alter";
import { Ego, initEgo } from "@/data/Ego";
import { Connection } from "./Connection";
import { Version } from "@/data/Version";
import { CurrentVersion, initCurrentVersion } from "@/data/CurrentVersion";

// define your typings for the store state
export interface NWK {
  ego: Ego;
  alteri: Array<Alter>;
  connections: Array<Connection>;
  versions: Array<Version>;
  currentVersion: CurrentVersion;
}

export function initNWKasJSON(): string {
  return JSON.stringify({
    ego: initEgo(),
    alteri: [],
    connections: [],
    versions: [],
    currentVersion: initCurrentVersion(),
  });
}

export function loadNWK(state: NWK, loadedText: string): void {
  const loaded = JSON.parse(loadedText);
  state.ego = loaded.ego;
  state.alteri = loaded.alteri;
  state.connections = loaded.connections;
  state.versions = loaded.versions;
  state.currentVersion = loaded.currentVersion;
}
