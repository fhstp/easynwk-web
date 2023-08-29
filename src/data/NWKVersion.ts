import { initNWK, NWK } from "@/data/NWK";

const DEFAULT_NWK_VERSION = 1;

export interface NWKVersion {
  id: number;
  title: string;
  date: string;
  nwk: NWK;
}

export function initNWKVersion(): NWKVersion {
  return {
    id: DEFAULT_NWK_VERSION,
    title: "",
    date: new Date().toISOString().substring(0, 10),
    nwk: initNWK(),
  };
}
