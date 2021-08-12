import { Alter } from "@/data/Alter";
import { Ego, initEgo } from "@/data/Ego";

// define your typings for the store state
export interface NWK {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  // [x: string]: any;

  ego: Ego;
  alteri: Array<Alter>;
  editIndex: number | null;
}

export function initNWKasJSON(): string {
  return JSON.stringify({
    ego: initEgo(),
    alteri: [],
    editIndex: null,
  });
}

export function loadNWK(state: NWK, loadedText: string): void {
  const loaded = JSON.parse(loadedText);
  console.log(loaded.alteri);
  state.ego = loaded.ego;
  state.alteri = loaded.alteri;
  state.editIndex = null;
}
