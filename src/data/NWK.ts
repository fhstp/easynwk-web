import { Alter } from "@/data/Alter";
import { Ego } from "@/data/Ego";
import { Connection } from "./Connection";
import { initEgo } from "@/data/Ego";

export interface NWK {
  ego: Ego;
  alteri: Array<Alter>;
  connections: Array<Connection>;
}

export function loadNWK(state: NWK, loadedText: string): void {
  const loaded = JSON.parse(loadedText);
  state.ego = loaded.ego;
  state.alteri = loaded.alteri;
  state.connections = loaded.connections;
}

export function initNWK(): NWK {
  return {
    ego: initEgo(),
    alteri: [],
    connections: [],
  };
}

export function initNWKAsJSON(): string {
  return JSON.stringify({
    ego: initEgo(),
    alteri: [],
    connections: [],
  });
}
